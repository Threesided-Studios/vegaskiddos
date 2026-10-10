// Helpers for recurring events. A recurring event stores one instance's Start
// (giving the time + weekday) plus a human label in `recurrence`. We compute the
// next real occurrence on the fly so the series never shows a stale past date.
//
// Civil-date math is always America/Los_Angeles — Cloudflare Workers are UTC,
// and evening PT events sit on the next UTC day.

const LA = "America/Los_Angeles";
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function laParts(d: Date) {
  const map: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("en-US", {
    timeZone: LA,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d)) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    weekday: DOW.indexOf(map.weekday),
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

function fromLosAngeles(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  const civil = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
  for (const off of ["-07:00", "-08:00"] as const) {
    const d = new Date(`${civil}${off}`);
    const p = laParts(d);
    if (p.year === year && p.month === month && p.day === day && p.hour === hour && p.minute === minute) {
      return d;
    }
  }
  return new Date(`${civil}-07:00`);
}

export function laDateKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function isRecurring(recurrence?: string): boolean {
  return Boolean(recurrence && recurrence.trim());
}

// ── Listing / expiry rules ─────────────────────────────────────────────────
// A recurring series stores ONE instance's Start plus a label; the app projects
// the next weekly occurrence forever. That is right for a live storytime, but
// it made dead series (e.g. a July 4th weekend scraped as "Weekly · Sun / Sat")
// resurface with phantom future dates months later. A series therefore expires
// when ANY of these is true:
//  • the scraper hasn't re-seen it for SERIES_STALE_DAYS (sources are scraped
//    daily and refresh ScrapedAt on every sighting, so a series that vanished
//    from its feed is over), and its stored start is that old too;
//  • its title names a date-bound holiday/observance and it started more than
//    HOLIDAY_SERIES_DAYS ago (a "4th of July" event can't recur in October);
//  • its title carries a year that is already over ("… Festival 2025").
// Manually-entered series (no ScrapedAt) only expire via the last two rules.
export const SERIES_STALE_DAYS = 30;
export const HOLIDAY_SERIES_DAYS = 14;
const DAY_MS = 86_400_000;

export const DATED_HOLIDAY_RE =
  /\b(4th of july|fourth of july|july 4(th)?|4th july|independence day|halloween|trick[- ]or[- ]treat|thanksgiving|christmas|xmas|new year'?s|valentine'?s|st\.? patrick'?s|easter|cinco de mayo|memorial day|labor day|mother'?s day|father'?s day|juneteenth|flag day|veterans day|world oceans day|earth day|d[ií]a de (los )?muertos|day of the dead)\b/i;

export interface ListableEvent {
  start: string;
  end?: string;
  recurrence?: string;
  title?: string;
  scrapedAt?: string;
}

function laYear(d: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: LA, year: "numeric" }).format(d));
}

export function seriesExpired(event: ListableEvent, now: Date = new Date()): boolean {
  const startMs = Date.parse(event.start);
  const nowMs = now.getTime();
  const title = event.title || "";
  if (Number.isFinite(startMs) && DATED_HOLIDAY_RE.test(title) && nowMs - startMs > HOLIDAY_SERIES_DAYS * DAY_MS) {
    return true;
  }
  const yr = title.match(/\b(20\d\d)\b/);
  if (yr && Number(yr[1]) < laYear(now)) return true;
  if (event.scrapedAt) {
    const seenMs = Date.parse(event.scrapedAt);
    if (
      Number.isFinite(seenMs) &&
      nowMs - seenMs > SERIES_STALE_DAYS * DAY_MS &&
      Number.isFinite(startMs) &&
      nowMs - startMs > SERIES_STALE_DAYS * DAY_MS
    ) {
      return true;
    }
  }
  return false;
}

// A one-time event stays listed until ~a day after it starts, or until its End
// for multi-day events (festivals, exhibits). Ends more than 180 days after the
// start are treated as bad data and ignored.
export function isListedEvent(event: ListableEvent, now: Date = new Date()): boolean {
  if (isRecurring(event.recurrence)) return !seriesExpired(event, now);
  const startMs = Date.parse(event.start);
  if (startMs > now.getTime() - DAY_MS) return true;
  const endMs = event.end ? Date.parse(event.end) : NaN;
  return Number.isFinite(endMs) && endMs > startMs && endMs - startMs <= 180 * DAY_MS && endMs > now.getTime();
}

export function eventHasEnded(event: ListableEvent, now: Date = new Date()): boolean {
  return !isListedEvent(event, now);
}

export function isDateCanceled(canceledDates: string[] | undefined, key: string): boolean {
  return Boolean(canceledDates && canceledDates.includes(key));
}

export function nextOccurrenceISO(
  startIso: string,
  recurrence?: string,
  canceledDates?: string[]
): string {
  const start = new Date(startIso);
  const now = new Date();
  if (!isRecurring(recurrence)) return startIso;

  const cancelled = canceledDates && canceledDates.length ? new Set(canceledDates) : null;
  const startP = laParts(start);
  const nowP = laParts(now);
  const daily = /daily|multiple days/i.test(recurrence!);
  const targetDow = startP.weekday;

  let y = nowP.year;
  let m = nowP.month;
  let d = nowP.day;
  if (start > now) {
    y = startP.year;
    m = startP.month;
    d = startP.day;
  }

  let guard = 0;
  while (guard < 120) {
    const instant = fromLosAngeles(y, m, d, startP.hour, startP.minute);
    const key = `${y}-${pad(m)}-${pad(d)}`;
    const rightDay = daily || laParts(instant).weekday === targetDow;
    if (rightDay && instant >= now && !(cancelled && cancelled.has(key))) {
      return instant.toISOString();
    }
    const next = fromLosAngeles(y, m, d, 12, 0);
    next.setUTCDate(next.getUTCDate() + 1);
    const np = laParts(next);
    y = np.year;
    m = np.month;
    d = np.day;
    guard++;
  }
  return fromLosAngeles(y, m, d, startP.hour, startP.minute).toISOString();
}

export function recursOnDay(
  startIso: string,
  recurrence: string | undefined,
  y: number,
  m: number,
  d: number,
  canceledDates?: string[]
): boolean {
  if (!isRecurring(recurrence)) return false;
  const startP = laParts(new Date(startIso));
  const cell = fromLosAngeles(y, m + 1, d, 12, 0);
  const startDay = fromLosAngeles(startP.year, startP.month, startP.day, 0, 0);
  if (cell < startDay) return false;
  const onDay = /daily|multiple days/i.test(recurrence!)
    ? true
    : laParts(cell).weekday === startP.weekday;
  if (!onDay) return false;
  if (canceledDates && canceledDates.length) {
    const key = `${y}-${pad(m + 1)}-${pad(d)}`;
    if (canceledDates.includes(key)) return false;
  }
  return true;
}
