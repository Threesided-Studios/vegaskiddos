// Custom Cloudflare Worker entry that wraps the OpenNext-generated worker.
//
// 1) Guard: a percent-encoded first path segment (e.g. /robots%2etxt,
// /sitemap%2exml, /%72obots.txt) is decoded by Next and routed into the
// app/[lang] tree with lang="robots.txt", while the R2 incremental cache keys
// it as "/robots.txt" — the same key as the real robots/sitemap/manifest route
// handlers. The two entry kinds collide (APP_PAGE vs APP_ROUTE) and Next throws
// "Invariant ... received invalid cache entry", 500-ing the probe and, in the
// other order, poisoning the real /robots.txt. No legitimate top-level segment
// on this site is ever percent-encoded, so 404 those before Next sees them.
// (Sentry VEGASKIDDOS-F)
//
// 2) Edge HTML cache: even an ISR "HIT" went Worker → middleware → R2 read on
// every request (~250 ms–1.2 s TTFB). Anonymous page views of ISR/static pages
// are now kept in the Cloudflare edge cache for EDGE_TTL seconds and served
// straight from the colo. Short TTL so admin approvals still show within a few
// minutes (ISR itself regenerates every 5 min). Never cached: non-GET, API,
// admin, RSC/router requests, private/no-store responses, admin sessions, and
// English paths for visitors whose vk_lang=es cookie makes middleware redirect.
//
// 3) File-looking misses: static files (public/, _next/static) are served by
// Workers Assets before this code runs, so a request that reaches here for
// "/something.php" or "/apple-touch-icon.png" is a miss. Next routed those into
// app/[lang] (lang="something.php") and rendered a ~600 KB 404 in several
// seconds; bots and browsers' automatic icon probes hit that constantly. Only
// the real dynamic metadata routes below are let through.
import handler from "./.open-next/worker.js";

const FILE_ROUTES = new Set(["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/icon.svg", "/favicon.ico"]);

const EDGE_TTL = 120;
const ES_COOKIE = "vk_lang=es; Path=/; Max-Age=31536000; SameSite=Lax";

function isSpanishPath(pathname) {
  return pathname === "/es" || pathname.startsWith("/es/");
}

function edgeCacheable(request, url) {
  if (request.method !== "GET") return false;
  const p = url.pathname;
  if (p.startsWith("/api/") || p.startsWith("/_next/") || p.startsWith("/cdn-cgi/")) return false;
  if (/(^|\/)admin(\/|$)/.test(p)) return false;
  if (url.searchParams.has("_rsc")) return false;
  const h = request.headers;
  if (h.has("rsc") || h.has("next-router-prefetch") || h.has("next-router-state-tree") || h.has("next-action")) return false;
  if (!(h.get("accept") || "").includes("text/html")) return false;
  const cookie = h.get("cookie") || "";
  if (/(?:^|;\s*)vk_admin/.test(cookie)) return false;
  if (/(?:^|;\s*)vk_lang=es(?:;|$)/.test(cookie) && !isSpanishPath(p)) return false;
  return true;
}

function storable(res) {
  if (res.status !== 200) return false;
  if (!(res.headers.get("content-type") || "").includes("text/html")) return false;
  const cc = res.headers.get("cache-control") || "";
  if (/private|no-store|no-cache/.test(cc) || !/s-maxage/.test(cc)) return false;
  return true;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const first = url.pathname.split("/")[1] || "";
    if (first.includes("%")) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
      });
    }

    if (
      /\.[a-z0-9]{1,12}$/i.test(url.pathname) &&
      !FILE_ROUTES.has(url.pathname) &&
      !url.pathname.startsWith("/_next/") &&
      !url.pathname.startsWith("/api/")
    ) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
      });
    }

    if (!edgeCacheable(request, url) || typeof caches === "undefined") {
      return handler.fetch(request, env, ctx);
    }

    const cache = caches.default;
    const key = new Request(`${url.origin}${url.pathname}${url.search}`, { method: "GET" });
    const hit = await cache.match(key);
    if (hit) {
      const res = new Response(hit.body, hit);
      res.headers.set("cache-control", res.headers.get("x-vk-origin-cc") || "public, max-age=0, must-revalidate");
      res.headers.delete("x-vk-origin-cc");
      res.headers.set("x-vk-edge", "HIT");
      if (isSpanishPath(url.pathname)) res.headers.append("set-cookie", ES_COOKIE);
      return res;
    }

    const res = await handler.fetch(request, env, ctx);
    if (!storable(res)) return res;

    const out = new Response(res.body, res);
    out.headers.set("x-vk-edge", "MISS");
    const copy = out.clone();
    const stored = new Response(copy.body, copy);
    stored.headers.set("x-vk-origin-cc", res.headers.get("cache-control") || "");
    stored.headers.set("cache-control", `public, max-age=${EDGE_TTL}`);
    stored.headers.delete("set-cookie");
    ctx.waitUntil(cache.put(key, stored).catch(() => {}));
    return out;
  },
};
