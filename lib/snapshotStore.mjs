// Airtable → R2 event snapshot. Plain JS so both the Worker entry
// (worker.mjs `scheduled`, the daily import) and Next route handlers (admin
// approve/reject → on-demand refresh) can share it.
//
// Public pages never call Airtable: they read this snapshot (lib/data.ts).
// The snapshot holds every *approved* event with only the public columns, as
// raw Airtable records; mapping/filtering happens at render time so date-based
// expiry is always evaluated against "now", not against import time.

export const SNAPSHOT_KEY = "events/approved-v1.json";

export const PUBLIC_FIELDS = [
  "Title", "Description", "TitleEs", "DescriptionEs", "Venue", "Address",
  "Neighborhood", "Lat", "Lng", "Start", "End", "AgeTiers", "PriceTier",
  "PriceText", "Url", "Source", "Indoor", "Recurrence", "Canceled",
  "CanceledReason", "CanceledDates", "ScrapedAt",
];

/** Fetch every approved event from Airtable (public columns only). */
export async function fetchApprovedRecords({ token, base, table = "Events" }) {
  if (!token || !base) throw new Error("Airtable not configured");
  const records = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`);
    url.searchParams.set("filterByFormula", "{Approved}=1");
    url.searchParams.set("pageSize", "100");
    for (const f of PUBLIC_FIELDS) url.searchParams.append("fields[]", f);
    if (offset) url.searchParams.set("offset", offset);
    // No cache option: inside Next, an explicit no-store would turn the static
    // page that triggered a bootstrap import into a dynamic one.
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Airtable ${res.status}`);
    const data = await res.json();
    for (const r of data.records) records.push({ id: r.id, fields: r.fields });
    offset = data.offset;
  } while (offset);
  return records;
}

/**
 * Import from Airtable and write the snapshot to R2. Refuses to overwrite a
 * good snapshot with an empty result (an Airtable hiccup must not blank the
 * site). Returns the snapshot object.
 */
export async function refreshSnapshot(bucket, airtable, reason = "manual") {
  const records = await fetchApprovedRecords(airtable);
  if (!records.length) throw new Error("Airtable returned zero approved events; keeping the previous snapshot");
  const snapshot = { generatedAt: new Date().toISOString(), reason, count: records.length, records };
  await bucket.put(SNAPSHOT_KEY, JSON.stringify(snapshot), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { generatedAt: snapshot.generatedAt, reason, count: String(records.length) },
  });
  return snapshot;
}

/** Read the snapshot, or null when none has been written yet. */
export async function readSnapshot(bucket) {
  const obj = await bucket.get(SNAPSHOT_KEY);
  if (!obj) return null;
  return obj.json();
}
