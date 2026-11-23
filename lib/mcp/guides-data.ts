// Guide content for the MCP tools, from the same data files the guide pages use.

import { GUIDES, getGuideMeta } from "../guides";
import { FLAGSHIP_VENUES, CHECKLIST, OCTOBER_PLAN, type GuideVenue } from "../fall-guide-data";
import { HOLIDAY_VENUES, HOLIDAY_CHECKLIST, HOLIDAY_PLAN } from "../holiday-guide-data";
import { holidayVenuesEs, HOLIDAY_ES_CHECKLIST, HOLIDAY_ES_PLAN } from "../holiday-guide-es";
import { SITE, type Lang } from "./events";

export function guideUrl(slug: string, lang: Lang): string {
  return `${SITE}${lang === "es" ? "/es" : ""}/guides/${slug}`;
}

function venueOut(v: GuideVenue) {
  return {
    id: v.id,
    name: v.name,
    summary: v.blurb ?? "",
    ages: v.ages,
    price: v.price,
    areas: v.hoods,
    facts: v.facts.map((f) => `${f.label}: ${f.value}`),
    url: v.url,
  };
}

export function listGuides(lang: Lang) {
  return GUIDES.filter((g) => !g.draftForReview).map((g) => {
    const m = getGuideMeta(g.slug, lang) ?? g;
    return { slug: g.slug, title: m.title, description: m.description, url: guideUrl(g.slug, lang) };
  });
}

export function getGuide(slug: string, lang: Lang) {
  const meta = getGuideMeta(slug, lang);
  if (!meta || meta.draftForReview) return null;
  const base = { slug, title: meta.title, description: meta.description, url: guideUrl(slug, lang) };
  if (slug === "holiday-guide-2026") {
    const es = lang === "es";
    return {
      ...base,
      venues: (es ? holidayVenuesEs() : HOLIDAY_VENUES).map(venueOut),
      plan: (es ? HOLIDAY_ES_PLAN : HOLIDAY_PLAN).map((p) => `${p.title}: ${p.text}`),
      checklist: (es ? HOLIDAY_ES_CHECKLIST : HOLIDAY_CHECKLIST).map((c) => c.text),
    };
  }
  if (slug === "fall-halloween-guide-2026") {
    return {
      ...base,
      language_note: lang === "es" ? "This guide is only available in English." : undefined,
      venues: FLAGSHIP_VENUES.map(venueOut),
      plan: OCTOBER_PLAN.map((p) => `${p.title}: ${p.text}`),
      checklist: CHECKLIST.map((c) => c.text),
    };
  }
  return base;
}
