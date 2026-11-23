// Read-only MCP tools for Vegas Kiddos. Served at /mcp by worker.mjs.
// Nothing here writes: prepare_event_submission only builds a prefilled /submit
// link, and the parent still reviews and sends the form themselves.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AGE_TIERS, NEIGHBORHOODS, PRICE_TIERS, UNKNOWN_PRICE, venueSlug } from "../constants";
import { nextOccurrenceISO } from "../recurrence";
import {
  SITE,
  ageToTier,
  eventPageUrl,
  firstDateInRange,
  listedEvents,
  todayKey,
  venuePageUrl,
  weekendRange,
  type Lang,
  type McpEvent,
  type SnapshotRecord,
} from "./events";
import { getGuide, listGuides } from "./guides-data";

export const SERVER_INFO = { name: "vegas-kiddos", version: "1.0.0" };
export const TOOL_NAMES = [
  "search_events",
  "get_event",
  "events_this_weekend",
  "list_guides",
  "get_guide",
  "search_venues",
  "prepare_event_submission",
] as const;

export type RecordLoader = () => Promise<SnapshotRecord[]>;

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const DESC_SHORT = 220;
const DESC_LONG = 2000;

const HOOD_IDS = NEIGHBORHOODS.map((n) => n.id) as [string, ...string[]];
const AGE_IDS = AGE_TIERS.map((a) => a.id) as [string, ...string[]];
const langSchema = z.enum(["en", "es"]).default("en").describe("Language for titles and links: en or es");
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

function trim(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}...`;
}

function laTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "es" ? "es-US" : "en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function priceLabel(e: McpEvent): string {
  const tier = PRICE_TIERS.find((p) => p.id === e.priceTier) ?? UNKNOWN_PRICE;
  return e.priceText ? `${tier.label} (${e.priceText})` : tier.label;
}

function hoodLabel(id: string): string {
  return NEIGHBORHOODS.find((n) => n.id === id)?.label ?? "Las Vegas";
}

function summary(e: McpEvent, lang: Lang, on?: string) {
  const next = nextOccurrenceISO(e.start, e.recurrence, e.canceledDates);
  return {
    id: e.id,
    title: e.title,
    when: laTime(next, lang),
    next_start: next,
    ...(on ? { on_date: on } : {}),
    repeats: e.recurrence || undefined,
    venue: e.venue,
    area: hoodLabel(e.neighborhood),
    ages: e.ageTiers,
    price: priceLabel(e),
    free: e.priceTier === "free",
    indoor: e.indoor,
    canceled: e.canceled || undefined,
    description: trim(e.description, DESC_SHORT),
    page: eventPageUrl(e.id, lang),
  };
}

function json(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}
function toolError(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

interface Filters {
  query?: string;
  ageTier?: string;
  free_only?: boolean;
  indoor_only?: boolean;
  neighborhood?: string;
}

export function matches(e: McpEvent, f: Filters): boolean {
  if (f.free_only && e.priceTier !== "free") return false;
  if (f.indoor_only && !e.indoor) return false;
  if (f.neighborhood && e.neighborhood !== f.neighborhood) return false;
  if (f.ageTier && e.ageTiers.length && !e.ageTiers.includes(f.ageTier as McpEvent["ageTiers"][number])) return false;
  if (f.query) {
    const hay = `${e.title} ${e.description} ${e.venue}`.toLowerCase();
    if (!f.query.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t))) return false;
  }
  return true;
}

export function createVegasKiddosServer(loadRecords: RecordLoader, now: () => Date = () => new Date()): McpServer {
  const server = new McpServer(SERVER_INFO, {
    instructions:
      "Read-only tools for Vegas Kiddos (vegaskiddos.com), a free bilingual calendar of kid-friendly events in Las Vegas. Dates are Las Vegas local time. Nothing here writes or sends data; prepare_event_submission only returns a link the parent opens and submits.",
  });

  const events = async (lang: Lang) => listedEvents(await loadRecords(), lang, now());

  server.registerTool(
    "search_events",
    {
      title: "Search kid events",
      description:
        "Find kid-friendly Las Vegas events by keyword, date range, age, price, indoor and area. Returns upcoming events soonest first with links to their Vegas Kiddos pages.",
      inputSchema: {
        query: z.string().max(80).optional().describe("Words that must appear in the title, description or venue"),
        date_from: dateSchema.optional().describe("First day, YYYY-MM-DD (Las Vegas). Defaults to today"),
        date_to: dateSchema.optional().describe("Last day, YYYY-MM-DD. Defaults to no end (max 62 days after date_from when set)"),
        age: z.number().int().min(0).max(17).optional().describe("Child's age in years"),
        age_group: z.enum(AGE_IDS).optional().describe("Or an age group: baby, toddler, kids, tweens"),
        free_only: z.boolean().optional(),
        indoor_only: z.boolean().optional(),
        area: z.enum(HOOD_IDS).optional().describe("Neighborhood id"),
        lang: langSchema,
        limit: z.number().int().min(1).max(20).default(10),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      const lang = a.lang as Lang;
      const today = todayKey(now());
      const from = a.date_from && a.date_from > today ? a.date_from : today;
      if (a.date_to && a.date_to < from) return toolError("date_to is before date_from (or before today).");
      const f: Filters = {
        query: a.query,
        ageTier: a.age_group ?? (a.age != null ? ageToTier(a.age) : undefined),
        free_only: a.free_only,
        indoor_only: a.indoor_only,
        neighborhood: a.area,
      };
      const hits: { e: McpEvent; on?: string }[] = [];
      for (const e of await events(lang)) {
        if (!matches(e, f)) continue;
        if (a.date_from || a.date_to) {
          const to = a.date_to ?? addDaysKey(from, 62);
          const on = firstDateInRange(e, from, to);
          if (!on) continue;
          hits.push({ e, on });
        } else hits.push({ e });
      }
      if (a.date_from || a.date_to) hits.sort((x, y) => (x.on ?? "").localeCompare(y.on ?? ""));
      const limit = a.limit ?? 10;
      return json({
        total: hits.length,
        showing: Math.min(limit, hits.length),
        results: hits.slice(0, limit).map((h) => summary(h.e, lang, h.on)),
        browse: `${SITE}${lang === "es" ? "/es" : "/"}${a.query ? `?q=${encodeURIComponent(a.query)}` : ""}`,
      });
    },
  );

  server.registerTool(
    "get_event",
    {
      title: "Get event details",
      description: "Full details for one Vegas Kiddos event by id (the rec... id in its page URL).",
      inputSchema: {
        id: z.string().regex(/^rec[a-zA-Z0-9]{10,20}$/, "Event ids look like rec followed by letters and digits"),
        lang: langSchema,
      },
      annotations: READ_ONLY,
    },
    async ({ id, lang }) => {
      const l = lang as Lang;
      const e = (await events(l)).find((x) => x.id === id);
      if (!e) return toolError(`No current event with id ${id}. It may have ended or been removed.`);
      return json({
        ...summary(e, l),
        description: trim(e.description, DESC_LONG),
        address: e.address || undefined,
        starts: e.start,
        ends: e.end,
        skipped_dates: e.canceledDates,
        organizer_link: e.url,
        source: e.source,
        venue_page: e.venue ? venuePageUrl(e.venue, l) : undefined,
      });
    },
  );

  server.registerTool(
    "events_this_weekend",
    {
      title: "This weekend",
      description: "Kid-friendly Las Vegas events happening this Saturday and Sunday (Las Vegas time).",
      inputSchema: {
        free_only: z.boolean().optional(),
        age: z.number().int().min(0).max(17).optional(),
        area: z.enum(HOOD_IDS).optional(),
        lang: langSchema,
        limit: z.number().int().min(1).max(20).default(20),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      const lang = a.lang as Lang;
      const { from, to } = weekendRange(now());
      const f: Filters = { free_only: a.free_only, neighborhood: a.area, ageTier: a.age != null ? ageToTier(a.age) : undefined };
      const hits: { e: McpEvent; on: string }[] = [];
      for (const e of await events(lang)) {
        if (!matches(e, f)) continue;
        const on = firstDateInRange(e, from, to);
        if (on) hits.push({ e, on });
      }
      hits.sort((x, y) => x.on.localeCompare(y.on));
      const limit = a.limit ?? 20;
      return json({
        weekend: { from, to },
        total: hits.length,
        showing: Math.min(limit, hits.length),
        results: hits.slice(0, limit).map((h) => summary(h.e, lang, h.on)),
        page: `${SITE}${lang === "es" ? "/es" : ""}/this-weekend`,
      });
    },
  );

  server.registerTool(
    "list_guides",
    {
      title: "List parent guides",
      description: "List the Vegas Kiddos parent guides (seasonal, long-form).",
      inputSchema: { lang: langSchema },
      annotations: READ_ONLY,
    },
    async ({ lang }) => json(listGuides(lang as Lang)),
  );

  server.registerTool(
    "get_guide",
    {
      title: "Get a parent guide",
      description: "Read one Vegas Kiddos parent guide: its places (with dates, hours and prices as published), a simple plan, and a packing checklist.",
      inputSchema: {
        slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/).describe("Guide slug from list_guides"),
        lang: langSchema,
      },
      annotations: READ_ONLY,
    },
    async ({ slug, lang }) => {
      const g = getGuide(slug, lang as Lang);
      return g ? json(g) : toolError(`No guide "${slug}". Use list_guides.`);
    },
  );

  server.registerTool(
    "search_venues",
    {
      title: "Search venues",
      description: "Find Las Vegas venues (libraries, parks, museums and more) that have upcoming kid events, with how many and what is next.",
      inputSchema: {
        query: z.string().max(80).optional().describe("Words in the venue name or address"),
        area: z.enum(HOOD_IDS).optional(),
        lang: langSchema,
        limit: z.number().int().min(1).max(20).default(10),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      const lang = a.lang as Lang;
      const terms = (a.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
      const bySlug = new Map<string, { name: string; address: string; area: string; events: McpEvent[] }>();
      for (const e of await events(lang)) {
        const slug = venueSlug(e.venue);
        if (!slug) continue;
        if (a.area && e.neighborhood !== a.area) continue;
        const v = bySlug.get(slug) ?? { name: e.venue, address: e.address, area: hoodLabel(e.neighborhood), events: [] };
        if (!v.address && e.address) v.address = e.address;
        v.events.push(e);
        bySlug.set(slug, v);
      }
      const venues = [...bySlug.values()]
        .filter((v) => terms.every((t) => `${v.name} ${v.address}`.toLowerCase().includes(t)))
        .sort((x, y) => y.events.length - x.events.length || x.name.localeCompare(y.name));
      const limit = a.limit ?? 10;
      return json({
        total: venues.length,
        results: venues.slice(0, limit).map((v) => ({
          name: v.name,
          address: v.address || undefined,
          area: v.area,
          upcoming_events: v.events.length,
          next: v.events.slice(0, 3).map((e) => ({ title: e.title, when: laTime(nextOccurrenceISO(e.start, e.recurrence, e.canceledDates), lang), page: eventPageUrl(e.id, lang) })),
          page: venuePageUrl(v.name, lang),
        })),
      });
    },
  );

  server.registerTool(
    "prepare_event_submission",
    {
      title: "Prepare an event submission",
      description:
        "Build a link to the Vegas Kiddos 'Add an event' form with these details filled in. This does not submit anything: the person opens the link, checks the details, adds the rest, and sends it for review.",
      inputSchema: {
        title: z.string().min(3).max(120),
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Use YYYY-MM-DDTHH:MM in Las Vegas time").describe("Start, Las Vegas local time, YYYY-MM-DDTHH:MM"),
        venue: z.string().min(2).max(120),
        address: z.string().max(200).optional(),
        url: z.string().url().max(500).optional().describe("Organizer or RSVP link (http or https)"),
        description: z.string().max(600).optional(),
        lang: langSchema,
      },
      annotations: { ...READ_ONLY, openWorldHint: false },
    },
    async (a) => {
      if (a.url && !/^https?:\/\//i.test(a.url)) return toolError("url must start with http:// or https://");
      const q = new URLSearchParams();
      q.set("title", a.title);
      q.set("start", a.start);
      q.set("venue", a.venue);
      if (a.address) q.set("address", a.address);
      if (a.url) q.set("url", a.url);
      if (a.description) q.set("description", a.description);
      const link = `${SITE}${a.lang === "es" ? "/es" : ""}/submit?${q.toString()}`;
      return json({
        submit_link: link,
        submitted: false,
        next_step:
          "Open the link, check the details, choose the area, ages and price, and press submit. A Vegas Kiddos editor reviews every event before it is listed.",
      });
    },
  );

  return server;
}

function addDaysKey(key: string, n: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
