import type { KidEvent } from "./types";
import { cardPlaceLabel } from "./eventPlace";

// Every event handed to a client component ("use client") is serialized into
// the page twice: once as HTML, once in the RSC payload that hydrates it. The
// home page passes the whole listing to <EventBrowser>, so full descriptions,
// both translations and bookkeeping fields made the HTML ~700 KB and hydration
// slow on phones. Cards show a 3-line description; the keyword search only needs
// the start of it. Keep what the browser UI reads, trimmed.
const DESC_MAX = 280;

function trimText(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

export function toClientEvent(e: KidEvent): KidEvent {
  const slim: KidEvent = {
    id: e.id,
    title: e.title,
    description: trimText(e.description || "", DESC_MAX),
    venue: e.venue,
    address: e.address,
    neighborhood: e.neighborhood,
    lat: e.lat,
    lng: e.lng,
    start: e.start,
    end: e.end,
    ageTiers: e.ageTiers,
    priceTier: e.priceTier,
    priceText: e.priceText,
    image: e.image,
    source: e.source,
    indoor: e.indoor,
    recurrence: e.recurrence,
    canceled: e.canceled,
    canceledDates: e.canceledDates?.length ? e.canceledDates : undefined,
  };
  // The card's 📍 line can come from a street address buried deep in the
  // description; keep it if trimming would lose it.
  const place = cardPlaceLabel(e);
  if (place && cardPlaceLabel(slim) !== place) slim.address = place;
  return slim;
}

export function toClientEvents(events: KidEvent[]): KidEvent[] {
  return events.map(toClientEvent);
}
