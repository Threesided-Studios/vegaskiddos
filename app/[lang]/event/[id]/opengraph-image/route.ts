import { lookupEvent } from "@/lib/data";
import { renderEventOgCard } from "@/lib/eventOgCard";
import { socialCardUrl, MIN_OG_BYTES } from "@/lib/ogEvent";

const CACHE = "public, immutable, max-age=31536000";

/**
 * Same-origin OG image for Facebook link previews.
 * Cloudflare Workers cannot reliably embed remote WebP/JPEG inside
 * ImageResponse, so we either proxy a pre-rendered R2 social card or
 * render a gradient+text PNG with no external assets.
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
    /* fall through to dynamic PNG */
  }

  try {
    const hit = await lookupEvent(id, "en");
    const event = hit.kind === "ok" ? hit.event : null;
    return renderEventOgCard(event);
  } catch (err) {
    console.error("event OG image failed:", err);
    return renderEventOgCard(null);
  }
}
