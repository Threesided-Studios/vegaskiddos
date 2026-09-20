import { SITE } from "./seo";
import type { Lang } from "./i18n";

/** Standard OG card dimensions (Facebook / Twitter large card). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** Minimum valid OG body size — rejects CF Worker 1101 error pages (~17 bytes). */
export const MIN_OG_BYTES = 1024;

const IMG_CDN = "https://img.vegaskiddos.com";

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
