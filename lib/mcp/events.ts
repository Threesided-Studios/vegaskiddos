// Event data for the MCP tools: maps the public R2 snapshot records into a
// compact shape and applies the same listing rules as the public pages.
// No Next.js imports, so worker.mjs can use it before the OpenNext handler.

import { NEIGHBORHOODS, parsePriceTier, venueSlug, type AgeTierId, type NeighborhoodId, type PriceTierId } from "../constants";
import { isListedEvent, laDateKey, nextOccurrenceISO, recursOnDay, isRecurring } from "../recurrence";
import { safeHttpUrl } from "../httpUrl";

export const SITE = "https://vegaskiddos.com";
export type Lang = "en" | "es";

export interface SnapshotRecord {
  id: string;
  fields: Record<string, unknown>;
}

export interface McpEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  neighborhood: NeighborhoodId;
  start: string;
  end?: string;
  ageTiers: AgeTierId[];
  priceTier: PriceTierId;
  priceText?: string;
  url?: string;
  source: string;
  indoor?: boolean;
  recurrence?: string;
  canceled?: boolean;
  canceledDates?: string[];
  scrapedAt?: string;
}

const KNOWN_HOODS = new Set<string>(NEIGHBORHOODS.map((n) => n.id));
const LISTABLE_PAST_MS = 2 * 86_400_000;

export function mapRecord(rec: SnapshotRecord, lang: Lang): McpEvent | null {
  const f = rec.fields;
  if (!f.Title || !f.Start) return null;
  const hood = String(f.Neighborhood || "");
  const title = lang === "es" && f.TitleEs ? String(f.TitleEs) : String(f.Title);
  const description = lang === "es" && f.DescriptionEs ? String(f.DescriptionEs) : String(f.Description || "");
  return {
    id: rec.id,
    title,
    description,
    venue: String(f.Venue || ""),
    address: String(f.Address || ""),
    neighborhood: KNOWN_HOODS.has(hood) ? (hood as NeighborhoodId) : "unknown",
    start: String(f.Start),
    end: f.End ? String(f.End) : undefined,
    ageTiers: (Array.isArray(f.AgeTiers) ? f.AgeTiers : []).map(String).filter(Boolean) as AgeTierId[],
    priceTier: parsePriceTier(f.PriceTier),
    priceText: f.PriceText ? String(f.PriceText) : undefined,
    url: safeHttpUrl(f.Url ? String(f.Url) : undefined),
    source: String(f.Source || "Community"),
    indoor: f.Indoor == null ? undefined : Boolean(f.Indoor),
    recurrence: f.Recurrence ? String(f.Recurrence) : undefined,
    canceled: f.Canceled == null ? undefined : Boolean(f.Canceled),
    canceledDates: f.CanceledDates
      ? String(f.CanceledDates).split(/[\s,]+/).map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s))
      : undefined,
    scrapedAt: f.ScrapedAt ? String(f.ScrapedAt) : undefined,
  };
}

function listableRecord(rec: SnapshotRecord, now: number): boolean {
  const f = rec.fields;
  if (String(f.Recurrence ?? "").length > 0) return true;
  const last = Date.parse(String(f.End || f.Start || ""));
  return Number.isFinite(last) && last > now - LISTABLE_PAST_MS;
}

/** Events a visitor could see on the site right now, soonest first. */
export function listedEvents(records: SnapshotRecord[], lang: Lang, now: Date = new Date()): McpEvent[] {
  return records
    .filter((r) => listableRecord(r, now.getTime()))
    .map((r) => mapRecord(r, lang))
    .filter((e): e is McpEvent => e !== null && isListedEvent(e, now))
    .map((e) => ({ e, next: nextOccurrenceISO(e.start, e.recurrence, e.canceledDates) }))
    .sort((a, b) => a.next.localeCompare(b.next))
    .map((x) => x.e);
}

export function eventPageUrl(id: string, lang: Lang): string {
  return `${SITE}${lang === "es" ? "/es" : ""}/event/${id}`;
}

export function venuePageUrl(name: string, lang: Lang): string {
  return `${SITE}${lang === "es" ? "/es" : ""}/venue/${venueSlug(name)}`;
}

// ---- Date helpers (America/Los_Angeles civil dates) ----

function addDays(key: string, n: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function todayKey(now: Date = new Date()): string {
  return laDateKey(now);
}

/** Saturday and Sunday of the current weekend (just Sunday when today is Sunday). */
export function weekendRange(now: Date = new Date()): { from: string; to: string } {
  const today = todayKey(now);
  const dow = new Date(`${today}T12:00:00Z`).getUTCDay();
  if (dow === 0) return { from: today, to: today };
  const sat = addDays(today, (6 - dow + 7) % 7);
  return { from: sat, to: addDays(sat, 1) };
}

// Multi-day runs longer than this are treated like the site's /this-weekend
// page does (by start date only), so stale or open-ended ranges do not flood
// date searches. They still show up in plain searches.
export const MAX_SPAN_DAYS = 14;

/** LA end date of a short multi-day event, or null. */
export function multiDayEndKey(e: McpEvent): string | null {
  if (isRecurring(e.recurrence) || !e.end) return null;
  const startMs = Date.parse(e.start);
  const endMs = Date.parse(e.end);
  if (!Number.isFinite(endMs) || endMs <= startMs || endMs - startMs > MAX_SPAN_DAYS * 86_400_000) return null;
  const endKey = laDateKey(new Date(endMs));
  return endKey > laDateKey(new Date(startMs)) ? endKey : null;
}

/** First LA date in [from, to] on which the event happens, or null. */
export function firstDateInRange(e: McpEvent, from: string, to: string): string | null {
  if (isRecurring(e.recurrence)) {
    let key = from;
    for (let i = 0; i < 62 && key <= to; i++) {
      const [y, m, d] = key.split("-").map(Number);
      if (recursOnDay(e.start, e.recurrence, y, m - 1, d, e.canceledDates)) return key;
      key = addDays(key, 1);
    }
    return null;
  }
  const startKey = laDateKey(new Date(e.start));
  const endKey = multiDayEndKey(e) ?? startKey;
  if (endKey < from || startKey > to) return null;
  return startKey > from ? startKey : from;
}

export function ageToTier(age: number): AgeTierId {
  if (age < 1) return "baby";
  if (age < 3) return "toddler";
  if (age < 12) return "kids";
  return "tweens";
}
