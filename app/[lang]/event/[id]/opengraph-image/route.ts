import { lookupEvent } from "@/lib/data";
import { eventOgImageResponse } from "@/lib/eventOgCard";
import {
  fetchCdnImage,
  MIN_OG_BYTES,
  ogFallbackArtUrls,
  proxyImageBytes,
  socialCardUrl,
} from "@/lib/ogEvent";
import { staticOgFallbackResponse } from "@/lib/ogStaticFallback";

const CACHE = "public, immutable, max-age=31536000";

/**
 * Same-origin OG image for Facebook link previews.
 * 1. GPT social card on R2 (JPEG) — proxied bytes.
 * 2. Event or type-template art on R2 — proxied bytes (no ImageResponse; CF Workers
 *    crash on large data-URL composites the same way they do on remote embeds).
 * 3. Gradient + text PNG (last resort when CDN has no art).
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
        return proxyImageBytes(art.buf, art.contentType);
      }
    }

    return eventOgImageResponse(event);
  } catch (err) {
    console.error("event OG image failed:", err);
    try {
      return await eventOgImageResponse(null);
    } catch {
      return staticOgFallbackResponse();
    }
  }
}
