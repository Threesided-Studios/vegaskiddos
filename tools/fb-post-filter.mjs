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
    patterns: [/\bsummer tutoring\b/i, /\bsummer camp\b/i, /\bsummer reading\b/i, /\bsummer program\b/i],
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

const PAST_GRACE_MS = 24 * 60 * 60 * 1000; // one-time: still OK the day after start (daily)
const MAX_AHEAD_MS = 60 * 24 * 60 * 60 * 1000; // don't promote events >60d out on daily/roundup

/**
 * Whether an event should be eligible for FB posting at `postAt` (PT-aware month gate).
 * @param {object} fields — Airtable Events fields (Title, Start, Recurrence, …)
 * @param {Date} postAt — slot time (schedule) or now (daily/roundup)
 * @param {{ mode?: "daily"|"schedule"|"roundup" }} [opts]
 */
export function isFbPostRelevant(fields, postAt, opts = {}) {
  const mode = opts.mode || "daily";
  if (!postableTitle(fields?.Title)) return false;
  if (!seasonallyRelevant(fields.Title, fields.Recurrence, postAt)) return false;

  const rec = fields.Recurrence && String(fields.Recurrence).trim();
  if (rec) return true; // year-round recurring; seasonal keywords gated above

  const start = fields.Start;
  if (!start) return false;
  const startMs = new Date(start).getTime();
  const postMs = postAt.getTime();
  if (Number.isNaN(startMs)) return false;

  if (mode === "schedule") return startMs > postMs;

  if (startMs < postMs - PAST_GRACE_MS) return false;
  if (startMs > postMs + MAX_AHEAD_MS) return false;
  return true;
}
