import { lookupEvent } from "@/lib/data";
import { renderEventOgCard, renderEventOgCardWithArt } from "@/lib/eventOgCard";
import {
  bytesToDataUrl,
  fetchCdnImage,
  MIN_OG_BYTES,
  ogFallbackArtUrls,
  proxyImageBytes,
  socialCardUrl,
} from "@/lib/ogEvent";

const CACHE = "public, immutable, max-age=31536000";

/**
 * Same-origin OG image for Facebook link previews.
 * 1. GPT social card on R2 (JPEG) — proxied bytes.
 * 2. Event or type-template art on R2 — composited with title/venue via inline
 *    data URL (Worker-safe; no remote <img src>), or proxied raw if composite fails.
 * 3. Gradient + text PNG (last resort).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; id: string }> },
) {
  const { id } = await params;

  // Prefer pre-rendered GPT social card (JPEG on R2) — proxy bytes, no ImageResponse.
  try {
    const social = await fetch(socialCardUrl(id), { signal: AbortSignal.timeout(5000) });
    if (social.ok) {
      const buf = await social.arrayBuffer();
      if (buf.byteLength >= MIN_OG_BYTES) {
        return new Response(buf, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": CACHE,
          },
        });
      }
    }
  } catch {
    /* fall through to CDN art / dynamic PNG */
  }

  try {
    const hit = await lookupEvent(id, "en");
    const event = hit.kind === "ok" ? hit.event : null;

    if (event) {
      for (const url of ogFallbackArtUrls(event)) {
        const art = await fetchCdnImage(url);
        if (!art) continue;

        try {
          const dataUrl = bytesToDataUrl(art.buf, art.contentType);
          return renderEventOgCardWithArt(event, dataUrl);
        } catch (err) {
          console.warn("event OG art composite failed, proxying CDN bytes:", err);
          return proxyImageBytes(art.buf, art.contentType);
        }
      }
    }

    return renderEventOgCard(event);
  } catch (err) {
    console.error("event OG image failed:", err);
    return renderEventOgCard(null);
  }
}
