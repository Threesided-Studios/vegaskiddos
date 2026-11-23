// Prefill for the /submit form from URL params, e.g. a link built by the MCP
// tool prepare_event_submission. Only plain text fields; never the email,
// honeypot, area, ages or price. Values are length-capped and the visitor
// still reviews and submits the form themselves.

export const PREFILL_FIELDS = {
  title: 120,
  description: 600,
  venue: 120,
  address: 200,
  start: 16,
  url: 500,
} as const;

export type PrefillField = keyof typeof PREFILL_FIELDS;

export function readSubmitPrefill(search: string): Partial<Record<PrefillField, string>> {
  const params = new URLSearchParams(search);
  const out: Partial<Record<PrefillField, string>> = {};
  for (const [name, max] of Object.entries(PREFILL_FIELDS) as [PrefillField, number][]) {
    const raw = params.get(name);
    if (!raw) continue;
    const value = raw.trim().slice(0, max);
    if (!value) continue;
    if (name === "start" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) continue;
    if (name === "url" && !/^https?:\/\//i.test(value)) continue;
    out[name] = value;
  }
  return out;
}
