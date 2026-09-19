import { ImageResponse } from "next/og";
import { lookupEvent } from "@/lib/data";
import { artTypeFor } from "@/lib/eventArt";
import { OG_IMAGE_SIZE, socialCardUrl } from "@/lib/ogEvent";
import type { Lang } from "@/lib/i18n";

export const alt = "Event — Vegas Kiddos";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

const IMG_CDN = "https://img.vegaskiddos.com";

// Tailwind gradient names → hex stops for next/og (no Tailwind in ImageResponse).
const GRADIENT: Record<string, [string, string]> = {
  "from-teal to-sunny": ["#23C4B5", "#FFC93C"],
  "from-sunny to-coral": ["#FFC93C", "#FF6B5E"],
  "from-sunny to-teal": ["#FFC93C", "#23C4B5"],
  "from-coral to-sunny": ["#FF6B5E", "#FFC93C"],
  "from-teal to-grape": ["#23C4B5", "#7B5EA7"],
  "from-coral to-grape": ["#FF6B5E", "#7B5EA7"],
  "from-grape to-coral": ["#7B5EA7", "#FF6B5E"],
  "from-grape to-teal": ["#7B5EA7", "#23C4B5"],
};

function gradientFor(typeGradient: string): [string, string] {
  return GRADIENT[typeGradient] || ["#FF6B5E", "#FFC93C"];
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

async function loadBackground(eventId: string, title: string, description: string): Promise<string | null> {
  // Prefer GPT social card (JPEG on R2) when present.
  try {
    const social = await fetch(socialCardUrl(eventId), { signal: AbortSignal.timeout(4000) });
    if (social.ok) return socialCardUrl(eventId);
  } catch {
    /* fall through */
  }
  // Type template illustration (WebP on R2).
  const art = artTypeFor(title, description);
  return `${IMG_CDN}/type/${art.id}/1024.webp?v=1`;
}

export default async function EventOgImage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = (await params) as { lang: Lang; id: string };
  const hit = await lookupEvent(id, "en");

  const fallback = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF6B5E 0%, #FFC93C 100%)",
        color: "white",
        fontFamily: "sans-serif",
        padding: 60,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 80 }}>🌵</div>
      <div style={{ fontSize: 52, fontWeight: 800, marginTop: 12 }}>Vegas Kiddos</div>
      <div style={{ fontSize: 28, marginTop: 16, opacity: 0.95 }}>Kid-safe Las Vegas events</div>
    </div>
  );

  if (hit.kind !== "ok") {
    return new ImageResponse(fallback, { ...size });
  }

  const event = hit.event;
  const art = artTypeFor(event.title, event.description);
  const [c1, c2] = gradientFor(art.gradient);
  const bgUrl = await loadBackground(event.id, event.title, event.description);

  const title = truncate(event.title, 72);
  const venue = truncate(event.venue || "Las Vegas", 48);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "sans-serif",
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        }}
      >
        {bgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(45,42,50,0.92) 0%, rgba(45,42,50,0.45) 55%, rgba(45,42,50,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            padding: "48px 56px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 56 }}>{art.emoji}</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                background: "rgba(255,255,255,0.22)",
                padding: "8px 20px",
                borderRadius: 999,
              }}
            >
              vegaskiddos.com
            </span>
          </div>
          <div
            style={{
              fontSize: title.length > 48 ? 44 : 52,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1,
              textShadow: "0 4px 24px rgba(0,0,0,0.35)",
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 16,
              opacity: 0.95,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>📍</span>
            <span>{venue}</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
