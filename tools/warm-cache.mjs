#!/usr/bin/env node
// Post-deploy cache warmer. OpenNext keys the R2 incremental cache by build, so
// after every deploy each event/venue page is cold and its first visitor waits
// for a full render + Airtable fetch (4–10 s). This walks the sitemap (English
// and the /es twin) with modest concurrency so real visitors get cached pages;
// later refreshes happen in the background via stale-while-revalidate.
//
//   node tools/warm-cache.mjs [https://vegaskiddos.com] [concurrency]
const base = (process.argv[2] || "https://vegaskiddos.com").replace(/\/$/, "");
const concurrency = Number(process.argv[3] || 6);

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = new Set();
for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
for (const m of xml.matchAll(/hreflang="es"\s+href="([^"]+)"/g)) urls.add(m[1]);
const list = [...urls].map((u) => u.replace(/^https:\/\/vegaskiddos\.com/, base));

let done = 0, slow = 0, failed = 0;
const started = Date.now();
async function worker() {
  while (list.length) {
    const url = list.shift();
    const t = Date.now();
    try {
      const res = await fetch(url, { headers: { accept: "text/html", "user-agent": "vk-cache-warmer" }, redirect: "manual" });
      await res.arrayBuffer();
      if (res.status >= 500) failed++;
    } catch {
      failed++;
    }
    if (Date.now() - t > 3000) slow++;
    done++;
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
console.log(`warmed ${done} urls in ${Math.round((Date.now() - started) / 1000)}s (cold renders: ${slow}, 5xx/errors: ${failed})`);
