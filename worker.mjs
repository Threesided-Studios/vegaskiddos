// Custom Cloudflare Worker entry that wraps the OpenNext-generated worker.
//
// Guard: a percent-encoded first path segment (e.g. /robots%2etxt,
// /sitemap%2exml, /%72obots.txt) is decoded by Next and routed into the
// app/[lang] tree with lang="robots.txt", while the R2 incremental cache keys
// it as "/robots.txt" — the same key as the real robots/sitemap/manifest route
// handlers. The two entry kinds collide (APP_PAGE vs APP_ROUTE) and Next throws
// "Invariant ... received invalid cache entry", 500-ing the probe and, in the
// other order, poisoning the real /robots.txt. No legitimate top-level segment
// on this site is ever percent-encoded, so 404 those before Next sees them.
// (Sentry VEGASKIDDOS-F)
import handler from "./.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const first = pathname.split("/")[1] || "";
    if (first.includes("%")) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
      });
    }
    return handler.fetch(request, env, ctx);
  },
};
