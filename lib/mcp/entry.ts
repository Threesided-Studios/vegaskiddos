// Entry used by worker.mjs: wires the MCP handler to the R2 event snapshot
// and the Workers Rate Limiting binding.

import { readSnapshot } from "../snapshotStore.mjs";
import { handleMcpRequest, LocalRateLimiter, type RateLimitBinding } from "./handler";
import type { SnapshotRecord } from "./events";

interface Env {
  DATA_BUCKET?: Parameters<typeof readSnapshot>[0];
  MCP_RATE_LIMITER?: RateLimitBinding;
}

const MEMO_MS = 60_000;
let memo: { at: number; records: SnapshotRecord[] } | null = null;
const fallbackLimiter = new LocalRateLimiter(60, 60_000);

export function isMcpPath(pathname: string): boolean {
  return pathname === "/mcp" || pathname === "/mcp/";
}

export async function serveMcp(request: Request, env: Env): Promise<Response> {
  const loadRecords = async () => {
    if (memo && Date.now() - memo.at < MEMO_MS) return memo.records;
    if (!env.DATA_BUCKET) throw new Error("event data unavailable");
    const snap = await readSnapshot(env.DATA_BUCKET);
    if (!snap) throw new Error("event data unavailable");
    memo = { at: Date.now(), records: snap.records as SnapshotRecord[] };
    return memo.records;
  };
  return handleMcpRequest(request, {
    loadRecords,
    limiter: env.MCP_RATE_LIMITER ?? fallbackLimiter,
    localLimiter: env.MCP_RATE_LIMITER ? fallbackLimiter : undefined,
  });
}
