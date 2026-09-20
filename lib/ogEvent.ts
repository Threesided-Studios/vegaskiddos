import { artTypeFor, ART_TEMPLATES_VERSION, type ArtTypeId } from "./eventArt";
import { SITE } from "./seo";
import type { Lang } from "./i18n";
import type { KidEvent } from "./types";

/** Standard OG card dimensions (Facebook / Twitter large card). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** Minimum valid OG body size — rejects CF Worker 1101 error pages (~17 bytes). */
export const MIN_OG_BYTES = 1024;

const IMG_CDN = "https://img.vegaskiddos.com";

const OG_CACHE = "public, immutable, max-age=31536000";

/** Bump when social-card JPEGs on R2 are regenerated (cache-bust ?v=). */
export const SOCIAL_CARD_VERSION = "2";

/** Same-origin dynamic OG route — Facebook scrapes this reliably (PNG, 1200×630). */
export function eventOgImagePath(eventId: string, lang: Lang = "en"): string {
  return lang === "es" ? `/es/event/${eventId}/opengraph-image` : `/event/${eventId}/opengraph-image`;
}

export function eventOgImageUrl(eventId: string, lang: Lang = "en"): string {
  return `${SITE}${eventOgImagePath(eventId, lang)}`;
}

export function eventOgImageMeta(eventId: string, lang: Lang = "en") {
  return {
    url: eventOgImageUrl(eventId, lang),
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    type: "image/png" as const,
    alt: "Event — Vegas Kiddos",
  };
}

/** Optional GPT-generated social-card background on R2 (JPEG for FB-friendly scraping). */
export function socialCardUrl(eventId: string): string {
  return `${IMG_CDN}/social/${eventId}/1200.jpg?v=${SOCIAL_CARD_VERSION}`;
}

const OG_FALLBACK_WIDTHS = [1600, 1024] as const;
const OG_FALLBACK_FORMATS = ["jpg", "webp"] as const;

export type OgImageFormat = (typeof OG_FALLBACK_FORMATS)[number];

/** Per-event synced art on R2 (ArtImage or scraped Image via sync-images.mjs). */
export function eventArtCdnUrl(
  eventId: string,
  width = 1600,
  format: OgImageFormat = "webp",
): string {
  return `${IMG_CDN}/event/${eventId}/${width}.${format}`;
}

/** Shared type-template art on R2 (sync-art-templates.mjs). */
export function typeArtCdnUrl(
  typeId: ArtTypeId,
  width = 1600,
  format: OgImageFormat = "webp",
): string {
  return `${IMG_CDN}/type/${typeId}/${width}.${format}?v=${ART_TEMPLATES_VERSION}`;
}

/** CDN URLs to try when no GPT social card exists (JPEG first, then WebP; event before type). */
export function ogFallbackArtUrls(event: KidEvent): string[] {
  const typeId = artTypeFor(event.title, event.description).id;
  const urls: string[] = [];
  for (const w of OG_FALLBACK_WIDTHS) {
    for (const fmt of OG_FALLBACK_FORMATS) {
      urls.push(eventArtCdnUrl(event.id, w, fmt));
    }
  }
  for (const w of OG_FALLBACK_WIDTHS) {
    for (const fmt of OG_FALLBACK_FORMATS) {
      urls.push(typeArtCdnUrl(typeId, w, fmt));
    }
  }
  return urls;
}

export function isValidOgImageBody(contentType: string | null, byteLength: number): boolean {
  const ct = (contentType || "").toLowerCase();
  if (!ct.includes("image")) return false;
  return byteLength >= MIN_OG_BYTES;
}

/** Fetch pre-rendered CDN image bytes (Worker-safe — no ImageResponse remote embed). */
export async function fetchCdnImage(
  url: string,
  timeoutMs = 5000,
): Promise<{ buf: ArrayBuffer; contentType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/webp";
    if (!isValidOgImageBody(contentType, buf.byteLength)) return null;
    return { buf, contentType };
  } catch {
    return null;
  }
}

/** Return fetched image bytes as an OG response (no compositing). */
export function proxyImageBytes(buf: ArrayBuffer, contentType: string): Response {
  const mime = contentType.split(";")[0].trim() || "image/webp";
  return new Response(buf, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": OG_CACHE,
    },
  });
}
