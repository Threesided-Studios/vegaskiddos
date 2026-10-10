export const SNAPSHOT_KEY: string;
export const PUBLIC_FIELDS: string[];
export interface SnapshotRecord { id: string; fields: Record<string, unknown> }
export interface Snapshot { generatedAt: string; reason: string; count: number; records: SnapshotRecord[] }
export interface AirtableConfig { token?: string; base?: string; table?: string }
export interface SnapshotBucket {
  get(key: string): Promise<{ json(): Promise<unknown> } | null>;
  put(key: string, value: string, opts?: unknown): Promise<unknown>;
}
export function fetchApprovedRecords(cfg: AirtableConfig): Promise<SnapshotRecord[]>;
export function refreshSnapshot(bucket: SnapshotBucket, cfg: AirtableConfig, reason?: string): Promise<Snapshot>;
export function readSnapshot(bucket: SnapshotBucket): Promise<Snapshot | null>;
