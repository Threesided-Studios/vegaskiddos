import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuideView } from "@/components/GuideView";
import { HolidayGuide2026 } from "@/components/guides/HolidayGuide2026";
import { getGuideContent } from "@/lib/guide-content";
import { getAllGuideSlugs, getGuideMeta } from "@/lib/guides";
import { HOLIDAY_ES_BACK } from "@/lib/holiday-guide-es";
import { langAlternates } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return getAllGuideSlugs().flatMap((slug) => [
    { lang: "en", slug },
    { lang: "es", slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const meta = getGuideMeta(slug, lang);
  if (!meta) return {};
  const titleSuffix = meta.draftForReview ? " (draft)" : "";
  return {
    title: `${meta.title}${titleSuffix} | Vegas Kiddos`,
    description: meta.description,
    alternates: langAlternates(lang, `/guides/${slug}`),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      ...(lang === "es" ? { locale: "es_US" } : {}),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const meta = getGuideMeta(slug, lang);
  const Content = getGuideContent(slug);
  if (!meta || !Content) notFound();
  const spanishHoliday = lang === "es" && slug === "holiday-guide-2026";

  return (
    <GuideView meta={meta} lang={lang} backLabel={spanishHoliday ? HOLIDAY_ES_BACK : undefined}>
      {spanishHoliday ? <HolidayGuide2026 lang="es" /> : <Content />}
    </GuideView>
  );
}
