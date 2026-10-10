import type { ScrapedEvent } from "./types";
import { laDateKey } from "../recurrence";

// Collapses repeated instances of the same event into a single "series" record,
// AND dedups the same event across sources (a farmers market listed by 3 feeds
// becomes one card). Grouping ignores source; same-day duplicates are merged
// keeping the richest data (image, geo, description, price).
//
// Per-instance cancellations are preserved, not lost: if a source cancels a
// single occurrence (e.g. the library cancels next Tuesday), that day is recorded
// in the series' `canceledDates` and the rest of the series continues. A one-time
// event that is itself cancelled is flagged `canceled`. So one cancelled instance
// never removes the whole series.

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function norm(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function laWeekday(iso: string): number {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short" }).format(new Date(iso));
  return WEEKDAY_ABBR.indexOf(s);
}
function richness(e: ScrapedEvent): number {
  return (e.image ? 4 : 0) + (e.lat ? 2 : 0) + (e.priceTier ? 1 : 0) + Math.min(1, (e.description || "").length / 100);
}
// Merge missing fields into the primary from a secondary duplicate.
function fill(primary: ScrapedEvent, other: ScrapedEvent): ScrapedEvent {
  return {
    ...primary,
    image: primary.image || other.image,
    lat: primary.lat ?? other.lat,
    lng: primary.lng ?? other.lng,
    neighborhood: primary.neighborhood || other.neighborhood,
    priceTier: primary.priceTier || other.priceTier,
    priceText: primary.priceText || other.priceText,
    url: primary.url || other.url,
    description: (primary.description || "").length >= (other.description || "").length ? primary.description : other.description,
  };
}

const DAY_MS = 86_400_000;

// Whole LA calendar days between two "YYYY-MM-DD" keys.
function dayGap(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / DAY_MS);
}

// True when a group's dates are one short, back-to-back run (e.g. Sat Jul 4 +
// Sun Jul 5) AND the feed clearly covers the following week too (it lists other
// events 7+ days past the run's last day). A real weekly series would have shown
// another instance by then, so this is ONE multi-day event, not "Weekly · Sun /
// Sat". Treating it as weekly is what projected a July 4th weekend onto Oct 10.
export function isMultiDayRun(dateKeys: string[], feedLastKey: string): boolean {
  const keys = [...new Set(dateKeys)].sort();
  if (keys.length < 2 || keys.length > 4) return false;
  for (let i = 1; i < keys.length; i++) if (dayGap(keys[i - 1], keys[i]) !== 1) return false;
  return dayGap(keys[keys.length - 1], feedLastKey) >= 7;
}

export function collapseRecurring(events: ScrapedEvent[]): ScrapedEvent[] {
  const feedLastKey = events.reduce((max, e) => {
    const k = laDateKey(new Date(e.start));
    return k > max ? k : max;
  }, "");
  const groups = new Map<string, ScrapedEvent[]>();
  for (const e of events) {
    const key = `${norm(e.title)}|${norm(e.venue)}`; // cross-source: no source in key
    const g = groups.get(key);
    if (g) g.push(e);
    else groups.set(key, [e]);
  }

  const out: ScrapedEvent[] = [];
  for (const [key, group] of groups) {
    // 1) merge same-day duplicates (cross-source) into one instance per LA day.
    //    A day is cancelled only if NONE of its instances is live — a single live
    //    listing for that day wins (the event is happening). Keying on the LA
    //    calendar day matches how the app computes occurrences (lib/recurrence).
    const byDay = new Map<string, ScrapedEvent>();
    const hasLiveDay = new Set<string>();
    const hasCanceledDay = new Set<string>();
    for (const e of group) {
      const day = laDateKey(new Date(e.start));
      if (e.canceled) hasCanceledDay.add(day);
      else hasLiveDay.add(day);
      const existing = byDay.get(day);
      if (!existing) byDay.set(day, e);
      else if (existing.canceled && !e.canceled) byDay.set(day, e); // prefer a live listing
      else if (!existing.canceled && e.canceled) { /* keep the live one */ }
      else {
        const [hi, lo] = richness(e) >= richness(existing) ? [e, existing] : [existing, e];
        byDay.set(day, fill(hi, lo));
      }
    }
    // A day is cancelled only if it has no live instance at all.
    const canceledDays = [...hasCanceledDay].filter((d) => !hasLiveDay.has(d)).sort();
    const allInstances = [...byDay.values()].sort((a, b) => a.start.localeCompare(b.start));
    const liveInstances = allInstances.filter((e) => !canceledDays.includes(laDateKey(new Date(e.start))));

    // 2a) single distinct day -> one-time event (flagged canceled if that day is).
    if (allInstances.length === 1) {
      const only = allInstances[0];
      out.push({ ...only, canceled: canceledDays.length > 0 });
      continue;
    }

    // 2b) a single multi-day event listed once per day (festival weekend, a
    //     holiday Sat+Sun) -> one-time event spanning first..last day. Keeps the
    //     series externalId so the upsert updates (and de-recurs) the same record.
    const runKeys = allInstances.map((e) => laDateKey(new Date(e.start)));
    if (isMultiDayRun(runKeys, feedLastKey)) {
      const first = liveInstances[0] || allInstances[0];
      const last = allInstances[allInstances.length - 1];
      out.push({
        ...first,
        end: last.end || last.start,
        recurrence: undefined,
        externalId: `series:${key}`,
        canceledDates: [],
        canceled: liveInstances.length === 0,
      });
      continue;
    }

    // 2c) multiple distinct days -> recurring series. The label reflects the full
    //     schedule (incl. cancelled days); canceledDates carries the cancelled
    //     occurrences; the representative instance is a LIVE one when possible.
    const days = [...new Set(allInstances.map((e) => laWeekday(e.start)))].sort();
    const dateKeys = new Set(allInstances.map((e) => laDateKey(new Date(e.start))));
    let recurrence: string;
    if (days.length >= 5) recurrence = "Multiple days a week";
    else if (days.length === 1) recurrence = `Weekly on ${WEEKDAY[days[0]]}s`;
    else if (days.length <= 3 && dateKeys.size >= days.length) recurrence = `Weekly · ${days.map((d) => WEEKDAY_ABBR[d]).join(" / ")}`;
    else recurrence = `${dateKeys.size} upcoming dates`;

    const base = liveInstances[0] || allInstances[0];
    out.push({ ...base, recurrence, externalId: `series:${key}`, canceledDates: canceledDays, canceled: false });
  }
  return out;
}
