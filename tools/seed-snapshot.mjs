// Write the Airtable → R2 event snapshot from a workstation/CI:
//   node tools/seed-snapshot.mjs > /tmp/snap.json
//   npx wrangler r2 object put vegaskiddos-data/events/approved-v1.json --file /tmp/snap.json --content-type application/json --remote
// Normally the Worker's daily cron (worker.mjs `scheduled`) and admin actions do this.
import { fetchApprovedRecords } from "../lib/snapshotStore.mjs";
const records = await fetchApprovedRecords({
  token: process.env.AIRTABLE_TOKEN,
  base: process.env.AIRTABLE_BASE_ID,
  table: process.env.AIRTABLE_TABLE_NAME || "Events",
});
if (!records.length) throw new Error("zero approved events");
process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), reason: "seed", count: records.length, records }));
