// Stateless Streamable HTTP endpoint for the Vegas Kiddos MCP server.
// Read-only. No sessions, no cookies used, no tool inputs logged.

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createVegasKiddosServer, type RecordLoader } from "./server";

const MAX_BODY_BYTES = 16 * 1024;

const CORS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, accept, mcp-protocol-version, mcp-session-id, last-event-id",
  "access-control-expose-headers": "mcp-session-id, mcp-protocol-version",
  "access-control-max-age": "86400",
};

/** Workers Rate Limiting binding shape. */
export interface RateLimitBinding {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

/** In-isolate fallback when the binding is missing (local dev, tests). */
export class LocalRateLimiter implements RateLimitBinding {
  private hits = new Map<string, { start: number; count: number }>();
  constructor(private max = 60, private windowMs = 60_000) {}
  async limit({ key }: { key: string }) {
    const t = Date.now();
    const cur = this.hits.get(key);
    if (!cur || t - cur.start >= this.windowMs) {
      if (this.hits.size > 5000) this.hits.clear();
      this.hits.set(key, { start: t, count: 1 });
      return { success: true };
    }
    cur.count += 1;
    return { success: cur.count <= this.max };
  }
}

function withHeaders(res: Response, extra: Record<string, string>): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  headers.set("cache-control", "no-store");
  headers.set("x-robots-tag", "noindex");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function rpcError(status: number, code: number, message: string, extra: Record<string, string> = {}): Response {
  return withHeaders(
    new Response(JSON.stringify({ jsonrpc: "2.0", error: { code, message }, id: null }), {
      status,
      headers: { "content-type": "application/json" },
    }),
    { ...CORS, ...extra },
  );
}

export interface McpHandlerOptions {
  loadRecords: RecordLoader;
  limiter: RateLimitBinding;
  localLimiter?: RateLimitBinding;
  now?: () => Date;
}

export async function handleMcpRequest(request: Request, opts: McpHandlerOptions): Promise<Response> {
  if (request.method === "OPTIONS") return withHeaders(new Response(null, { status: 204 }), CORS);
  if (request.method !== "POST") {
    return rpcError(405, -32000, "Method not allowed. This MCP server is stateless: send JSON-RPC with POST.", { allow: "POST, OPTIONS" });
  }
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  let allowed = true;
  try {
    allowed = (await opts.limiter.limit({ key: `mcp:${ip}` })).success;
  } catch {
    allowed = true; // a limiter outage must not take the endpoint down
  }
  // The Workers binding is eventually consistent per location, so also keep
  // a strict per-isolate cap.
  if (allowed && opts.localLimiter) allowed = (await opts.localLimiter.limit({ key: ip })).success;
  if (!allowed) return rpcError(429, -32000, "Too many requests. Try again in a minute.", { "retry-after": "60" });

  const len = Number(request.headers.get("content-length") ?? "0");
  if (len > MAX_BODY_BYTES) return rpcError(413, -32600, "Request too large.");
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return rpcError(413, -32600, "Request too large.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return rpcError(400, -32700, "Parse error.");
  }

  // Lenient Accept: a plain fetch (like Cloudflare's WebMCP bridge) may send
  // only content-type. Responses here are always JSON.
  const headers = new Headers(request.headers);
  headers.set("accept", "application/json, text/event-stream");
  if (!headers.get("content-type")) headers.set("content-type", "application/json");
  headers.delete("cookie");
  const normalized = new Request(request.url, { method: "POST", headers, body });

  const server = createVegasKiddosServer(opts.loadRecords, opts.now);
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    const res = await transport.handleRequest(normalized, { parsedBody: parsed });
    return withHeaders(res, CORS);
  } finally {
    void transport.close();
    void server.close();
  }
}
