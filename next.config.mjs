/** @type {import('next').NextConfig} */

// Only opt into the custom image loader when an external image CDN is set
// (NEXT_PUBLIC_IMAGE_CDN — e.g. Bunny, used on Cloudflare Workers since workerd
// can't run sharp). A custom loader DISABLES Next's built-in /_next/image
// endpoint, which then 404s anywhere that doesn't provide its own optimizer —
// including `next dev` locally. So when no CDN is configured we fall back to the
// built-in optimizer, which serves images via sharp locally. See
// lib/imageLoader.ts.
const imageCdn = process.env.NEXT_PUBLIC_IMAGE_CDN;

const nextConfig = {
  // English lives at the root but is rendered by the app/[lang] tree with
  // lang="en". This rewrite used to happen in middleware, but Next decides
  // "is this a prerendered/ISR route?" from the URL *before* a middleware
  // rewrite: "/event/rec…" doesn't match "/[lang]/event/[id]", so every English
  // event and venue page was rendered dynamically ("private, no-store", ~10 s
  // with the Airtable fetch). A config rewrite is resolved before that check,
  // so these pages are cached like their /es twins. afterFiles: real files and
  // static routes (sitemap, robots, icons, API) win first; /es, /en, /api and
  // /_next are excluded explicitly. Middleware still handles the vk_lang=es
  // redirect and the /en → / canonical redirect.
  async rewrites() {
    return {
      afterFiles: [
        { source: "/", destination: "/en" },
        // First segment as its own param (excluding api/_next/es/en and anything
        // with a dot), the remainder as a repeat param. OpenNext compiles the
        // destination with path-to-regexp, which rejects a single param that
        // spans several segments.
        // The lookahead must stop at the segment boundary ("/" or end): a bare
        // `api$` only excluded the single-segment "/api", so dynamic API routes
        // such as /api/admin/events/[id] were rewritten into the page tree and
        // 404'd.
        { source: "/:first((?!(?:api|_next|es|en)(?:/|$))[^/.]+)/:rest*", destination: "/en/:first/:rest*" },
      ],
    };
  },
  images: {
    ...(imageCdn
      ? { loader: "custom", loaderFile: "./lib/imageLoader.ts" }
      : {}),
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
