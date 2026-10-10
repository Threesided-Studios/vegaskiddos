import type { KidEvent } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

// The home page server-renders only the first screenful of events (plus the
// default "this week" strip) so phones don't download, parse and hydrate the
// whole ~300-event list at startup. The full list is fetched once, on demand —
// the first time a visitor filters, searches, switches view, scrolls to the end
// of the first batch, or has saved preferences that need it.
const cache: Partial<Record<Lang, Promise<KidEvent[]>>> = {};

export function loadAllEvents(lang: Lang): Promise<KidEvent[]> {
  const hit = cache[lang];
  if (hit) return hit;
  const p = fetch(`/api/events/all/${lang}`)
    .then((r) => {
      if (!r.ok) throw new Error(`events ${r.status}`);
      return r.json() as Promise<{ events: KidEvent[] }>;
    })
    .then((d) => d.events)
    .catch((err) => {
      delete cache[lang]; // allow a retry on the next trigger
      throw err;
    });
  cache[lang] = p;
  return p;
}
