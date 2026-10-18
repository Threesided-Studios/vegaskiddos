// Season / date relevance for Facebook auto-posting (daily, schedule, roundup).
// Keeps stale holiday titles (e.g. "Red, White & Kaboom" in September) out of
// the queue even when Airtable marks them recurring. See tools/README.md § fb-post.

const LA = "America/Los_Angeles";

// Adult / closure filters — same rules as before, extracted for reuse + tests.
const CLOSURE_RE = /^closed\b|\bclosed for\b/i;
const ADULT_RE = /\badults?\b/i;
const YOUNG_ADULT_RE = /\byoung[\s-]+adults?\b/i;

export function postableTitle(t) {
  if (!t) return false;
  const s = String(t);
  if (CLOSURE_RE.test(s)) return false;
  if (ADULT_RE.test(s) && !YOUNG_ADULT_RE.test(s)) return false;
  return true;
}

/** Pacific-time calendar month (1–12) for a given instant. */
export function ptMonth(d) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: LA, month: "numeric" }).formatToParts(d);
  for (const x of p) if (x.type === "month") return +x.value;
  return new Date(d).getUTCMonth() + 1;
}

// If title + recurrence text matches a rule, posting is only allowed in those PT months.
// Avoid broad tokens like bare "summer" — "Summerlin" is a Vegas neighborhood.
// Use "summer <noun>" phrases (showcase, fest, series, concert, kickoff, …).
const SEASONAL_RULES = [
  {
    patterns: [
      /\b4th of july\b/i, /\bfourth of july\b/i, /\bindependence day\b/i,
      /\bjuly 4\b/i, /\bjuly fourth\b/i, /\bjuly freebies\b/i,
    ],
    months: [6, 7],
  },
  {
    patterns: [/\bred,?\s*white\b/i, /\bkaboom\b/i, /\bfireworks?\s+festival\b/i],
    months: [6, 7],
  },
  { patterns: [/\blabor day\b/i], months: [8, 9] }, // through early Sep; stale by Oct
  { patterns: [/\bhalloween\b/i, /\btrick[- ]?or[- ]?treat\b/i], months: [9, 10] },
  { patterns: [/\bthanksgiving\b/i], months: [10, 11] },
  {
    patterns: [/\bchristmas\b/i, /\bholiday lights\b/i, /\bnutcracker\b/i, /\bsanta\b/i],
    months: [11, 12, 1],
  },
  { patterns: [/\beaster\b/i, /\begg hunt\b/i], months: [3, 4] },
  { patterns: [/\bvalentine'?s?\b/i], months: [1, 2] },
  { patterns: [/\bnew year'?s?\b/i, /\bnye\b/i, /\bcountdown\b/i], months: [12, 1] },
  {
    patterns: [
      /\bsummer tutoring\b/i, /\bsummer camp\b/i, /\bsummer reading\b/i, /\bsummer program\b/i,
      /\bsummer showcase\b/i, /\bsummer fest(ival)?\b/i, /\bsummer series\b/i,
      /\bsummer concert\b/i, /\bsummer kickoff\b/i, /\bsummer fun\b/i,
      /\bend of summer\b/i, /\bbeat the heat\b/i,
    ],
    months: [5, 6, 7, 8],
  },
  { patterns: [/\bback to school\b/i, /\bschool supply\b/i], months: [7, 8, 9] },
  { patterns: [/\bspring break\b/i], months: [2, 3, 4] },
];

/** Title + recurrence text scanned together (Recurrence sometimes repeats the holiday). */
export function seasonallyRelevant(title, recurrence, postAt) {
  const text = `${title || ""} ${recurrence || ""}`;
  const month = ptMonth(postAt);
  for (const rule of SEASONAL_RULES) {
    if (rule.patterns.some((re) => re.test(text))) return rule.months.includes(month);
  }
  return true;
}

const MAX_AHEAD_MS = 60 * 24 * 60 * 60 * 1000; // don't promote events >60d out on daily/roundup
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Pacific-time calendar date ("YYYY-MM-DD") for an instant. */
export function ptDateKey(d) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: LA, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const m = {};
  for (const x of p) m[x.type] = x.value;
  return `${m.year}-${m.month}-${m.day}`;
}

/**
 * Normalise an Airtable Start/End value. Date-only values ("2026-10-16") are
 * all-day on that PT date — `new Date("2026-10-16")` would be UTC midnight,
 * i.e. 5 PM PT the day BEFORE, so they must never be compared as instants.
 * @returns {{ allDay: boolean, day: string, ms: number } | null}
 */
export function parseEventTime(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (DATE_ONLY_RE.test(s)) return { allDay: true, day: s, ms: NaN };
  const ms = new Date(s).getTime();
  if (Number.isNaN(ms)) return null;
  return { allDay: false, day: ptDateKey(new Date(ms)), ms };
}

/**
 * True when a one-time event is over at `at`, judged by America/Los_Angeles
 * calendar date. An event stays eligible through 11:59 PM PT on its last day,
 * even if it already started earlier that day (people can still join):
 *  • single-day (timed or date-only): last day = its Start PT date;
 *  • multi-day (End on a later PT date): last day = its End PT date.
 * It becomes past at midnight PT after that day.
 */
export function eventIsPast(fields, at) {
  const start = parseEventTime(fields?.Start);
  if (!start) return true;
  const end = parseEventTime(fields?.End);
  const lastDay = end && end.day > start.day ? end.day : start.day;
  return ptDateKey(at) > lastDay;
}

/**
 * Whether an event should be eligible for FB posting at `postAt` (PT-aware month gate).
 * @param {object} fields — Airtable Events fields (Title, Start, End, Recurrence, …)
 * @param {Date} postAt — slot time (schedule) or now (daily/roundup)
 * @param {{ mode?: "daily"|"schedule"|"roundup" }} [opts]
 */
export function isFbPostRelevant(fields, postAt, opts = {}) {
  const mode = opts.mode || "daily";
  if (!postableTitle(fields?.Title)) return false;
  if (!seasonallyRelevant(fields.Title, fields.Recurrence, postAt)) return false;

  const rec = fields.Recurrence && String(fields.Recurrence).trim();
  if (rec) return true; // year-round recurring; seasonal keywords gated above

  // Never promote an event whose last PT date is already over. (Previously a
  // 24h grace after Start let a Fri 6 PM event through on Sat afternoon.)
  if (eventIsPast(fields, postAt)) return false;

  if (mode === "schedule") return true;

  const start = parseEventTime(fields.Start);
  const startMs = start.allDay ? Date.parse(`${start.day}T00:00:00-08:00`) : start.ms;
  if (startMs > postAt.getTime() + MAX_AHEAD_MS) return false;
  return true;
}
