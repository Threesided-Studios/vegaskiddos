import { cache } from "react";
import type { KidEvent } from "./types";
import { MOCK_EVENTS } from "./mock-events";
import { NEIGHBORHOODS, type AgeTierId, type PriceTierId, type NeighborhoodId } from "./constants";
import { nextOccurrenceISO, isListedEvent } from "./recurrence";
import type { Lang } from "./i18n";
import { artTemplateSrc, artTypeFor } from "./eventArt";
import { getSnapshotRecords } from "./snapshot";
import { safeHttpUrl } from "./httpUrl";

function byNextOccurrence(a: KidEvent, b: KidEvent) {
  return nextOccurrenceISO(a.start, a.recurrence, a.canceledDates).localeCompare(
    nextOccurrenceISO(b.start, b.recurrence, b.canceledDates)
  );
}

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;

const IMG_CDN = "https://img.vegaskiddos.com";

export function isAirtableConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE);
}

function failClosed(): boolean {
  return process.env.NODE_ENV === "production" && isAirtableConfigured();
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

const KNOWN_HOODS = new Set<string>(NEIGHBORHOODS.map((n) => n.id));

function parseNeighborhood(raw: unknown): NeighborhoodId {
  const id = String(raw || "");
  return KNOWN_HOODS.has(id) ? (id as NeighborhoodId) : "unknown";
}

function mapRecord(rec: AirtableRecord): KidEvent | null {
  const f = rec.fields;
  if (!f.Title || !f.Start) return null;
  const art = artTypeFor(String(f.Title), String(f.Description || ""));
  return {
    id: rec.id,
    title: String(f.Title),
    description: String(f.Description || ""),
    titleEs: f.TitleEs ? String(f.TitleEs) : undefined,
    descriptionEs: f.DescriptionEs ? String(f.DescriptionEs) : undefined,
    venue: String(f.Venue || ""),
    address: String(f.Address || ""),
    neighborhood: parseNeighborhood(f.Neighborhood),
    lat: Number(f.Lat) || 0,
    lng: Number(f.Lng) || 0,
    start: String(f.Start),
    end: f.End ? String(f.End) : undefined,
    ageTiers: (Array.isArray(f.AgeTiers) ? f.AgeTiers : [])
      .map(String)
      .filter(Boolean) as AgeTierId[],
    priceTier: (f.PriceTier as PriceTierId) || "free",
    priceText: f.PriceText ? String(f.PriceText) : undefined,
    url: safeHttpUrl(f.Url ? String(f.Url) : undefined),
    image: `${IMG_CDN}${artTemplateSrc(art.id)}`,
    source: String(f.Source || "Community"),
    indoor: f.Indoor == null ? undefined : Boolean(f.Indoor),
    recurrence: f.Recurrence ? String(f.Recurrence) : undefined,
    canceled: f.Canceled == null ? undefined : Boolean(f.Canceled),
    canceledReason: f.CanceledReason ? String(f.CanceledReason) : undefined,
    canceledDates: f.CanceledDates
      ? String(f.CanceledDates).split(/[\s,]+/).map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s))
      : undefined,
    scrapedAt: f.ScrapedAt ? String(f.ScrapedAt) : undefined,
  };
}

function localize(events: KidEvent[], lang: Lang): KidEvent[] {
  if (lang !== "es") return events;
  return events.map((e) =>
    e.titleEs || e.descriptionEs
      ? { ...e, title: e.titleEs || e.title, description: e.descriptionEs || e.description }
      : e
  );
}

// Public pages read the daily Airtable snapshot (lib/snapshot.ts), never
// Airtable itself. The snapshot holds every approved event; listing pages keep
// the ones that can still be shown, evaluated against "now" at render time.
const LISTABLE_PAST_MS = 2 * 86_400_000;

function listableRecord(rec: AirtableRecord, now: number): boolean {
  const f = rec.fields;
  if (String(f.Recurrence ?? "").length > 0) return true; // series expiry: lib/recurrence.ts
  const last = Date.parse(String(f.End || f.Start || ""));
  return Number.isFinite(last) && last > now - LISTABLE_PAST_MS;
}

function toEvents(records: AirtableRecord[], lang: Lang): KidEvent[] {
  return localize(
    records.map(mapRecord).filter((e): e is KidEvent => e !== null).sort(byNextOccurrence),
    lang,
  );
}

function mockEvents(lang: Lang): KidEvent[] {
  return localize([...MOCK_EVENTS].sort(byNextOccurrence), lang);
}

// Snapshot records, or null when there is no data source / it failed.
async function snapshotRecords(): Promise<AirtableRecord[] | null> {
  if (!isAirtableConfigured()) return null;
  try {
    return await getSnapshotRecords();
  } catch (err) {
    console.error("Event snapshot unavailable:", err);
    return null;
  }
}

export const getApprovedEvents = cache(async (lang: Lang = "en"): Promise<KidEvent[]> => {
  const records = await snapshotRecords();
  if (records === null) return failClosed() ? [] : mockEvents(lang);
  const events = toEvents(records, lang);
  if (events.length) return events;
  if (failClosed()) {
    console.error("Snapshot has zero approved events — failing closed");
    return [];
  }
  return mockEvents(lang);
});

// Listing pages: only events that can actually be shown right now.
export const getEvents = cache(async (lang: Lang = "en"): Promise<KidEvent[]> => {
  const records = await snapshotRecords();
  if (records === null) return failClosed() ? [] : mockEvents(lang).filter((e) => isListedEvent(e));
  const now = Date.now();
  return toEvents(records.filter((r) => listableRecord(r, now)), lang).filter((e) => isListedEvent(e));
});

const AIRTABLE_ID = /^rec[a-zA-Z0-9]{10,}$/;

export type EventLookup =
  | { kind: "ok"; event: KidEvent }
  | { kind: "gone" }
  | { kind: "missing" };

export const lookupEvent = cache(async (id: string, lang: Lang = "en"): Promise<EventLookup> => {
  if (!AIRTABLE_ID.test(id)) return { kind: "missing" };

  if (!isAirtableConfigured()) {
    const event = localize(MOCK_EVENTS, lang).find((e) => e.id === id);
    return event ? { kind: "ok", event } : { kind: "missing" };
  }

  const records = await snapshotRecords();
  if (records === null) return { kind: "missing" };
  const rec = records.find((r) => r.id === id);
  if (!rec) return { kind: "gone" }; // deleted, rejected, archived or unapproved
  const event = mapRecord(rec);
  if (!event) return { kind: "gone" };
  return { kind: "ok", event: localize([event], lang)[0] };
});

export const getEvent = cache(async (id: string, lang: Lang = "en"): Promise<KidEvent | undefined> => {
  const hit = await lookupEvent(id, lang);
  return hit.kind === "ok" ? hit.event : undefined;
});

export const getEventsByIds = cache(async (ids: string[], lang: Lang = "en"): Promise<KidEvent[]> => {
  const uniq = [...new Set(ids)].filter((id) => AIRTABLE_ID.test(id)).slice(0, 40);
  if (!uniq.length) return [];

  if (!isAirtableConfigured()) {
    const want = new Set(uniq);
    return localize(MOCK_EVENTS.filter((e) => want.has(e.id)), lang);
  }

  const records = await snapshotRecords();
  if (records === null) return [];
  const want = new Set(uniq);
  return toEvents(records.filter((r) => want.has(r.id)), lang);
});
