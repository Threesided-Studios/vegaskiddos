import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { langAlternates } from "@/lib/seo";
import { PARTNERS, PARTNERS_COPY } from "@/lib/partners";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  const c = PARTNERS_COPY[lang] ?? PARTNERS_COPY.en;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: langAlternates(lang, "/partners"),
    openGraph: {
      title: c.ogTitle,
      description: c.metaDesc,
    },
    twitter: {
      title: c.ogTitle,
      description: c.metaDesc,
    },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Lang };
  const c = PARTNERS_COPY[lang] ?? PARTNERS_COPY.en;
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.ogTitle,
    itemListElement: PARTNERS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: p.name,
        url: p.url,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <JsonLd data={listLd} />
      <h1 className="font-display text-4xl font-700 text-ink">{c.h1}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">{c.intro}</p>

      <ul className="mt-8 space-y-6">
        {PARTNERS.map((partner) => {
          const blurb = partner.blurb[lang] ?? partner.blurb.en;
          const cta = partner.cta[lang] ?? partner.cta.en;
          return (
            <li key={partner.id}>
              <article className="rounded-blob border-2 border-dashed border-ink/15 bg-white p-6 shadow-card sm:p-8">
                {partner.logoSrc ? (
                  <div className="mb-5 flex justify-center rounded-2xl bg-white p-4">
                    <Image
                      src={partner.logoSrc}
                      alt={partner.name}
                      width={partner.logoWidth ?? 1400}
                      height={partner.logoHeight ?? 871}
                      className="h-auto w-full max-w-[280px] object-contain"
                    />
                  </div>
                ) : null}
                <h2 className="font-display text-2xl font-700 text-ink">{partner.name}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink/80">{blurb}</p>
                <a
                  href={partner.url}
                  className="hover-pop mt-5 inline-flex min-h-[44px] items-center rounded-full bg-coral-btn px-5 py-3 font-800 text-white shadow-pop transition hover:bg-coral-btnHover"
                >
                  {cta}
                </a>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-base leading-relaxed text-ink/70">
        {c.closerPre}
        <Link href="/contact" className="font-700 text-coral hover:underline">
          {c.closerLink}
        </Link>
        {c.closerPost}
      </p>
    </div>
  );
}
