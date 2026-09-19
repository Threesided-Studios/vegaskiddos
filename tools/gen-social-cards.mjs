// Generate per-event social-card JPEGs for Facebook link previews.
// Illustrations are GPT-generated (bounded, cached per event), composited with
// title/venue text, then uploaded to R2 at social/<id>/1200.jpg. The site's
// opengraph-image route prefers these when present.
//
//   node tools/gen-social-cards.mjs batch [--limit n]   → generate missing cards
//   node tools/gen-social-cards.mjs --ids rec1,rec2     → regenerate specific events
//   add --dry-run to list selection only
//
// Env: OPENAI_API_KEY, AIRTABLE_TOKEN, AIRTABLE_BASE_ID,
//      CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { subjectFor } from "../lib/eventArt.ts";

const execFileP = promisify(execFile);

try {
  for (const line of fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const OPENAI = process.env.OPENAI_API_KEY;
const AT = process.env.AIRTABLE_TOKEN;
const BASE = process.env.AIRTABLE_BASE_ID;
const BUCKET = "vegaskiddos-media";
const MANIFEST = "tools/.social-card-manifest.json";
const WRANGLER = path.resolve("node_modules/.bin/wrangler");
const QUALITY = process.env.GEN_QUALITY || "medium";
const DRY = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg >= 0 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;
const idsArg = (() => {
  const i = process.argv.indexOf("--ids");
  return i >= 0 ? (process.argv[i + 1] || "").split(",").map((s) => s.trim()).filter(Boolean) : null;
})();

if (!AT || !BASE) {
  console.error("AIRTABLE_TOKEN / AIRTABLE_BASE_ID required");
  process.exit(1);
}

const manifest = (() => {
  if (FORCE) return {};
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    return {};
  }
})();

async function airtableAll(table, params = "") {
  const out = [];
  let offset;
  do {
    const u = `https://api.airtable.com/v0/${BASE}/${table}?pageSize=100${params}${offset ? `&offset=${offset}` : ""}`;
    const r = await fetch(u, { headers: { Authorization: `Bearer ${AT}` } });
    if (!r.ok) throw new Error(`${table} ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const d = await r.json();
    out.push(...d.records);
    offset = d.offset;
  } while (offset);
  return out;
}

function promptFor(f, id) {
  const subject = subjectFor(f.Title || "", f.Description || "");
  return (
    `Flat vector children's illustration banner of ${subject}, wide horizontal 3:2 composition. ` +
    `Vegas Kiddos brand palette: coral #FF6B5E, teal #23C4B5, sunny yellow #FFC93C, grape #7B5EA7 on warm sand. ` +
    `Playful, kid-safe, Las Vegas family-event vibe. Leave the bottom third relatively clear for text overlay. ` +
    `No text, no letters, no words, no real human faces, no photorealism.`
  );
}

async function generateIllustration(prompt) {
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1536x1024", quality: QUALITY, n: 1 }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${JSON.stringify(data).slice(0, 300)}`);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image returned: ${JSON.stringify(data).slice(0, 200)}`);
  return Buffer.from(b64, "base64");
}

function truncate(text, max) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

async function compositeCard(illustration, title, venue) {
  const W = 1200;
  const H = 630;
  const bg = await sharp(illustration).resize(W, H, { fit: "cover", position: "centre" }).jpeg({ quality: 88 }).toBuffer();
  const titleText = truncate(title, 64);
  const venueText = truncate(venue, 42);
  const titleSize = titleText.length > 48 ? 38 : 44;
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#2D2A32" stop-opacity="0.92"/>
          <stop offset="55%" stop-color="#2D2A32" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#2D2A32" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#shade)"/>
      <text x="56" y="${H - 120}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">vegaskiddos.com</text>
      <text x="56" y="${H - 72}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800">${escapeXml(titleText)}</text>
      <text x="56" y="${H - 28}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">📍 ${escapeXml(venueText)}</text>
    </svg>`;
  return sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function uploadCard(eventId, buf) {
  const tmp = path.join(os.tmpdir(), `vk-social-${eventId}.jpg`);
  fs.writeFileSync(tmp, buf);
  await execFileP(WRANGLER, [
    "r2", "object", "put", `${BUCKET}/social/${eventId}/1200.jpg`,
    "--file", tmp,
    "--content-type", "image/jpeg",
    "--cache-control", "public, max-age=31536000, immutable",
    "--remote",
  ], { env: process.env });
  fs.rmSync(tmp, { force: true });
}

async function main() {
  let recs;
  if (idsArg?.length) {
    const orClause = idsArg.map((id) => `RECORD_ID()='${id}'`).join(",");
    recs = (await airtableAll("Events", `&filterByFormula=${encodeURIComponent(`OR(${orClause})`)}`)).filter((r) => r.fields.Title);
  } else {
    recs = (await airtableAll("Events", `&filterByFormula=${encodeURIComponent("{Approved}=1")}`)).filter((r) => r.fields.Title);
    recs = recs.filter((r) => !manifest[r.id]);
  }

  if (LIMIT !== Infinity) recs = recs.slice(0, LIMIT);
  console.log(`${recs.length} event(s) selected for social cards${DRY ? " (dry-run)" : ""}.`);

  if (DRY) {
    for (const r of recs.slice(0, 20)) {
      console.log(`  • ${r.fields.Title} → social/${r.id}/1200.jpg`);
    }
    return;
  }

  if (!OPENAI) {
    console.error("OPENAI_API_KEY required");
    process.exit(1);
  }
  if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error("CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID required for R2 upload");
    process.exit(1);
  }

  let ok = 0;
  let fail = 0;
  for (const r of recs) {
    const f = r.fields;
    try {
      console.log(`🎨 ${f.Title} …`);
      const illo = await generateIllustration(promptFor(f, r.id));
      const card = await compositeCard(illo, f.Title, f.Venue || "Las Vegas");
      await uploadCard(r.id, card);
      manifest[r.id] = { at: new Date().toISOString(), title: String(f.Title) };
      fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));
      ok++;
      console.log(`   ✅ social/${r.id}/1200.jpg`);
    } catch (e) {
      fail++;
      console.error(`   ⚠️  ${f.Title}: ${String(e).slice(0, 160)}`);
    }
  }
  console.log(`\nDone. uploaded ${ok}, failed ${fail}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
