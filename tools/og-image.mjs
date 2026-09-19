// Shared OG-image helpers for Facebook posting tools.
// Event pages expose a same-origin PNG at /event/<id>/opengraph-image (1200×630).

export const SITE = "https://vegaskiddos.com";
export const IMG_CDN = "https://img.vegaskiddos.com";
export const GRAPH = "https://graph.facebook.com/v21.0";

/** Canonical English OG image URL (same-origin PNG — FB-scrape friendly). */
export function eventOgImageUrl(eventId) {
  return `${SITE}/event/${eventId}/opengraph-image`;
}

/** Event page URL that Facebook scrapes for link previews. */
export function eventPageUrl(eventId) {
  return `${SITE}/event/${eventId}`;
}

/**
 * Verify the event's same-origin OG image resolves.
 * @returns {{ ok: boolean, url: string, reason?: string }}
 */
export async function ogImageOkForEvent(rec) {
  const url = eventOgImageUrl(rec.id);
  try {
    const r = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
      headers: { "User-Agent": "VegasKiddos-OG-Check/1.0" },
    });
    if (!r.ok) return { ok: false, url, reason: `HEAD ${r.status}` };
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("image")) return { ok: false, url, reason: `content-type: ${ct || "(none)"}` };
    return { ok: true, url };
  } catch (e) {
    return { ok: false, url, reason: String(e) };
  }
}

/** Ask Facebook to re-scrape an event page before posting (refreshes link-preview cache). */
export async function scrapeOg(pageUrl, pageToken) {
  if (!pageToken) return null;
  const u = `${GRAPH}/?id=${encodeURIComponent(pageUrl)}&scrape=true&access_token=${encodeURIComponent(pageToken)}`;
  const r = await fetch(u, { method: "POST", signal: AbortSignal.timeout(20000) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.warn(`    OG scrape failed (${r.status}): ${JSON.stringify(data).slice(0, 160)}`);
    return null;
  }
  return data;
}

/** Extract og:image from a Facebook scrape response, if present. */
export function scrapedOgImage(scrapeResult) {
  const img = scrapeResult?.image?.[0]?.url || scrapeResult?.og_object?.image?.[0]?.url;
  return img || null;
}

/** True when a URL looks like a dedicated event OG (not the site-wide default). */
export function isDedicatedOgUrl(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes("/opengraph-image") && !u.includes("/event/")) return false;
  if (u.includes("img.vegaskiddos.com/type/")) return true;
  if (u.includes("img.vegaskiddos.com/social/")) return true;
  if (u.includes("img.vegaskiddos.com/event/")) return true;
  if (/\/event\/rec[a-z0-9]+\/opengraph-image/i.test(u)) return true;
  return false;
}
