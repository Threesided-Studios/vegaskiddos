import {
  readSnapshot,
  refreshSnapshot,
  fetchApprovedRecords,
  type Snapshot,
  type SnapshotBucket,
  type SnapshotRecord,
} from "./snapshotStore.mjs";

// Server-side access to the daily Airtable snapshot (see lib/snapshotStore.mjs).
//
// Runtime (Cloudflare Worker): read from the DATA_BUCKET R2 binding, memoized
// per isolate for a minute. If no snapshot exists yet (brand-new bucket) the
// first read imports one — the only time a public request can reach Airtable.
// Build / local dev (no R2 binding): import straight from Airtable once per
// process; this is the "snapshot baked into the build" path for prerendering.

const MEMO_MS = 60_000;
let memo: { at: number; snap: Snapshot } | null = null;
let inflight: Promise<Snapshot> | null = null;

function airtableConfig() {
  return {
    token: process.env.AIRTABLE_TOKEN,
    base: process.env.AIRTABLE_BASE_ID,
    table: process.env.AIRTABLE_TABLE_NAME || "Events",
  };
}

async function dataBucket(): Promise<SnapshotBucket | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return ((env as unknown as Record<string, unknown>).DATA_BUCKET as SnapshotBucket) ?? null;
  } catch {
    return null; // next build / next dev: no Worker bindings
  }
}

async function direct(reason: string): Promise<Snapshot> {
  const records = await fetchApprovedRecords(airtableConfig());
  return { generatedAt: new Date().toISOString(), reason, count: records.length, records };
}

async function load(): Promise<Snapshot> {
  const bucket = await dataBucket();
  if (!bucket) return direct("build");
  let snap: Snapshot | null = null;
  try {
    snap = await readSnapshot(bucket);
  } catch (err) {
    // A broken/locked bucket (e.g. the build's local R2 proxy) must not render
    // an empty site: fall back to a one-off import.
    console.error("snapshot read failed, importing directly:", err);
    return direct("fallback");
  }
  if (snap) return snap;
  return refreshSnapshot(bucket, airtableConfig(), "bootstrap");
}

/** All approved event records from the current snapshot. */
export async function getSnapshotRecords(): Promise<SnapshotRecord[]> {
  if (memo && Date.now() - memo.at < MEMO_MS) return memo.snap.records;
  if (!inflight) {
    inflight = load()
      .then((snap) => {
        memo = { at: Date.now(), snap };
        return snap;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return (await inflight).records;
}

export async function getSnapshotInfo(): Promise<{ generatedAt: string; reason: string; count: number } | null> {
  await getSnapshotRecords().catch(() => null);
  return memo ? { generatedAt: memo.snap.generatedAt, reason: memo.snap.reason, count: memo.snap.count } : null;
}

/**
 * Re-import from Airtable now (admin approve/reject/edit, manual refresh).
 * Pages pick the new data up on their next ISR regeneration (≤ 5 min).
 */
export async function refreshEventSnapshot(reason: string): Promise<{ ok: boolean; count?: number; generatedAt?: string; error?: string }> {
  const bucket = await dataBucket();
  if (!bucket) return { ok: false, error: "No DATA_BUCKET binding (not running on the Worker)" };
  try {
    const snap = await refreshSnapshot(bucket, airtableConfig(), reason);
    memo = { at: Date.now(), snap };
    return { ok: true, count: snap.count, generatedAt: snap.generatedAt };
  } catch (err) {
    console.error("snapshot refresh failed:", err);
    return { ok: false, error: String((err as Error)?.message || err) };
  }
}
