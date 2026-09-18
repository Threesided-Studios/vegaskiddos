import type { GuideVenue } from "@/lib/fall-guide-data";
import { GUIDE_URLS } from "@/lib/fall-guide-data";

export const linkClass = "font-700 text-teal-btn hover:underline";

export function GuideLink({
  href,
  children,
  className = linkClass,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function VenueCard({ venue }: { venue: GuideVenue }) {
  return (
    <article
      id={venue.id}
      data-guide-item
      data-age={venue.ages.join(" ")}
      data-price={venue.price}
      data-hood={venue.hoods.join(" ")}
      className={`rounded-blob border-2 bg-white p-5 shadow-card ${
        venue.featured ? "border-coral/30" : "border-ink/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunny/30 text-xl"
          aria-hidden
        >
          {venue.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-lg font-600 text-ink">
            <GuideLink href={venue.url}>{venue.name}</GuideLink>
          </h4>
          {venue.blurb && <p className="mt-1 text-sm text-ink/70">{venue.blurb}</p>}
          {venue.facts.length > 0 && (
            <dl className="mt-3 space-y-1.5 text-sm">
              {venue.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                  <dt className="font-700 text-ink/60">{f.label}</dt>
                  <dd className="text-ink/80">
                    {f.label === "Tickets" && f.value.includes("HallOVeen") ? (
                      <>
                        Date-specific at{" "}
                        <GuideLink href={GUIDE_URLS.halloveen}>HallOVeen.org</GuideLink>
                      </>
                    ) : f.label === "Tickets" && f.value.includes("trickortreatfestlv") ? (
                      <>
                        TBA on{" "}
                        <GuideLink href={GUIDE_URLS.trickOrTreatFest}>trickortreatfestlv.com</GuideLink>
                        ; county listing ~$15, confirm on fest site
                      </>
                    ) : (
                      f.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </article>
  );
}

export function GuideSection({
  id,
  title,
  wash,
  matchRequired,
  children,
}: {
  id?: string;
  title: string;
  wash: "white" | "coral" | "teal" | "sunny" | "grape" | "cream";
  matchRequired?: boolean;
  children: React.ReactNode;
}) {
  const washes = {
    white: "bg-white/70",
    coral: "bg-coral/10",
    teal: "bg-teal/10",
    sunny: "bg-sunny/15",
    grape: "bg-grape/10",
    cream: "bg-sand/80",
  };
  return (
    <section
      id={id}
      className={`-mx-4 px-4 py-8 sm:-mx-6 sm:px-6 ${washes[wash]}`}
      {...(matchRequired ? { "data-guide-match-required": true } : {})}
    >
      <h2 className="font-display text-2xl font-600 text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
