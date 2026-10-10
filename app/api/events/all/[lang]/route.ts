import { getEvents } from "@/lib/data";
import { PAGE_REVALIDATE } from "@/lib/pageCache";
import { toClientEvents } from "@/lib/clientEvents";
import type { Lang } from "@/lib/i18n";

// Full listed-event payload for the home page's client filters (see
// lib/allEvents.ts). Statically generated per language and refreshed on the
// same ISR window as the pages, so it never waits on Airtable.
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const events = toClientEvents(await getEvents(lang));
  return Response.json(
    { events },
    { headers: { "cache-control": `public, max-age=60, s-maxage=${PAGE_REVALIDATE}, stale-while-revalidate=600` } },
  );
}
