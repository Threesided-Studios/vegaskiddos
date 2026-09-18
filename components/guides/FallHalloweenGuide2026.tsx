"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cloud, Star } from "@/components/Doodles";
import { FallGuideValleyMap } from "./FallGuideValleyMap";
import {
  AGE_BANDS,
  BOARD_ITEMS,
  CHECKLIST,
  DEFAULT_FILTERS,
  FLAGSHIP_VENUES,
  GUIDE_URLS,
  NEIGHBORHOODS,
  OCTOBER_PLAN,
  filtersToSearch,
  matchesFilters,
  parseFiltersFromSearch,
  type GuideFilters,
  type GuideVenue,
  venueById,
} from "@/lib/fall-guide-data";

const linkClass = "font-700 text-teal-btn hover:underline";

function GuideLink({
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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-sm font-700 transition ${
        active
          ? "select-hop halo-coral bg-coral-btn text-white shadow-pop"
          : "bg-white/80 text-ink/70 hover:bg-coral/10"
      }`}
    >
      {children}
    </button>
  );
}

function VenueCard({ venue, hidden }: { venue: GuideVenue; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <article
      id={venue.id}
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

function Section({
  id,
  title,
  wash,
  children,
  hidden,
}: {
  id?: string;
  title: string;
  wash: "white" | "coral" | "teal" | "sunny" | "grape" | "cream";
  children: React.ReactNode;
  hidden?: boolean;
}) {
  if (hidden) return null;
  const washes = {
    white: "bg-white/70",
    coral: "bg-coral/10",
    teal: "bg-teal/10",
    sunny: "bg-sunny/15",
    grape: "bg-grape/10",
    cream: "bg-sand/80",
  };
  return (
    <section id={id} className={`-mx-4 px-4 py-8 sm:-mx-6 sm:px-6 ${washes[wash]}`}>
      <h2 className="font-display text-2xl font-600 text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FallHalloweenGuideContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<GuideFilters>(() =>
    parseFiltersFromSearch(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    const url = filtersToSearch(filters);
    window.history.replaceState(null, "", `${window.location.pathname}${url}`);
  }, [filters]);

  const setFilter = useCallback(<K extends keyof GuideFilters>(key: K, value: GuideFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const visibleVenues = useMemo(
    () => FLAGSHIP_VENUES.filter((v) => matchesFilters(v, filters)),
    [filters],
  );
  const visibleBoard = useMemo(
    () => BOARD_ITEMS.filter((b) => matchesFilters(b, filters)),
    [filters],
  );

  const hasActiveFilters =
    filters.age !== "all" || filters.price !== "all" || filters.hood !== "all";
  const hasMatches = visibleVenues.length > 0 || visibleBoard.length > 0;

  const venuesForAge = (age: GuideFilters["age"]) =>
    FLAGSHIP_VENUES.filter((v) => v.ages.includes(age as "toddler" | "kids" | "tweens") && matchesFilters(v, filters));

  return (
    <>
      {/* Intro hero */}
      <div className="relative overflow-hidden rounded-blob bg-gradient-to-br from-coral/20 via-sunny/20 to-teal/20 p-6 shadow-card">
        <Star className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 rotate-12 text-coral/20" />
        <Cloud className="pointer-events-none absolute bottom-2 left-4 h-12 w-16 text-teal/20" />
        <p className="relative text-lg leading-relaxed text-ink/80">
          Cooler nights. Costume aisles. A calendar that fills up if you let it.
        </p>
        <p className="relative mt-3 text-ink/80">
          A plain parent guide to fall and Halloween around the valley — sorted by age, free vs paid,
          and neighborhood. We pull from the same kid-safe lane as Vegas Kiddos. Venue facts below
          are verified where noted.
        </p>
      </div>

      {/* How to use + filters */}
      <Section id="how-to" title="How to use this" wash="white">
        <p className="text-ink/80">
          Use the filters below to narrow by age, budget, and neighborhood — or tap a zone on the
          map. Start broad, then tighten once you see what fits your week.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-6 text-ink/80">
          <li>Pick an <span className="font-700">age band</span> chip.</li>
          <li>Choose <span className="font-700">free</span> or <span className="font-700">paid</span>.</li>
          <li>
            Set a <span className="font-700">neighborhood</span> (or tap the map) to stay close to
            home. Traffic is part of the costume.
          </li>
        </ol>
        <p className="mt-3 text-sm text-ink/70">
          Always re-check the venue page the week you go. Hours move.
        </p>

        <div
          className="sticky top-2 z-20 mt-6 space-y-4 rounded-blob border border-ink/10 bg-white/95 p-4 shadow-card backdrop-blur-sm"
          aria-label="Guide filters"
        >
          <div>
            <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Age band</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filters.age === "all"} onClick={() => setFilter("age", "all")}>
                All ages
              </FilterChip>
              {AGE_BANDS.map((b) => (
                <FilterChip
                  key={b.id}
                  active={filters.age === b.id}
                  onClick={() => setFilter("age", b.id)}
                >
                  {b.emoji} {b.label}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Price</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filters.price === "all"} onClick={() => setFilter("price", "all")}>
                All
              </FilterChip>
              <FilterChip active={filters.price === "free"} onClick={() => setFilter("price", "free")}>
                🆓 Free / free entry
              </FilterChip>
              <FilterChip active={filters.price === "paid"} onClick={() => setFilter("price", "paid")}>
                💳 Paid
              </FilterChip>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Neighborhood</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filters.hood === "all"} onClick={() => setFilter("hood", "all")}>
                All valley
              </FilterChip>
              {NEIGHBORHOODS.map((n) => (
                <FilterChip
                  key={n.id}
                  active={filters.hood === n.id}
                  onClick={() => setFilter("hood", n.id)}
                >
                  {n.emoji} {n.title.split(" / ")[0]}
                </FilterChip>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-700 text-teal-btn hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </Section>

      {hasActiveFilters && !hasMatches && (
        <div className="rounded-blob border border-dashed border-ink/20 bg-white px-5 py-8 text-center text-ink/70">
          <p className="font-700">Nothing in this combo — widen a filter.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3 rounded-full bg-coral-btn px-4 py-2 text-sm font-800 text-white shadow-pop"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Age bands */}
      <Section title="Age bands" wash="coral" hidden={hasActiveFilters && visibleVenues.length === 0}>
        {AGE_BANDS.map((band) => {
          const bandVenues = venuesForAge(band.id);
          if (filters.age !== "all" && filters.age !== band.id) return null;
          if (band.id === "toddler" && filters.price === "paid") return null;
          if ((band.id === "kids" || band.id === "tweens") && hasActiveFilters && bandVenues.length === 0)
            return null;

          return (
            <div key={band.id} className="mb-8 last:mb-0">
              <h3 className="font-display text-xl font-600 text-ink">
                {band.emoji} {band.label}
                {band.id === "toddler" ? " (under ~3)" : ""}
              </h3>
              <p className="mt-2 text-ink/80">{band.intro}</p>

              {band.id === "toddler" && (
                <>
                  <p className="mt-3 font-700 text-ink/80">Good fits (verify before you go):</p>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-ink/80">
                    <li>
                      Library storytimes and pajama nights (city libraries rotate; check your branch
                      on <GuideLink href={GUIDE_URLS.vkHome}>vegaskiddos.com</GuideLink>)
                    </li>
                    <li>
                      Daytime pumpkin patches before the evening rush (
                      <GuideLink href={GUIDE_URLS.viva}>VIVA Pumpkin Patch</GuideLink>)
                    </li>
                    <li>Short outdoor concerts on plazas where you can leave without drama</li>
                  </ul>
                  <p className="mt-3 text-ink/80">
                    <span className="font-700">Skip or shorten:</span> {band.tips}
                  </p>
                </>
              )}

              {band.id === "kids" && (
                <>
                  <p className="mt-3 font-700 text-ink/80">Good fits:</p>
                  <div className="mt-3 space-y-4">
                    {FLAGSHIP_VENUES.filter((v) => v.ages.includes("kids")).map((v) => (
                      <VenueCard
                        key={v.id}
                        venue={v}
                        hidden={!matchesFilters(v, filters)}
                      />
                    ))}
                  </div>
                </>
              )}

              {band.id === "tweens" && (
                <>
                  <p className="mt-3 font-700 text-ink/80">Good fits:</p>
                  <div className="mt-3 space-y-4">
                    {FLAGSHIP_VENUES.filter((v) => v.ages.includes("tweens")).map((v) => (
                      <VenueCard
                        key={v.id}
                        venue={v}
                        hidden={!matchesFilters(v, filters)}
                      />
                    ))}
                    <div
                      data-age="tweens"
                      data-price="free"
                      data-hood="west north downtown"
                      className={`rounded-blob border border-ink/10 bg-white/80 p-4 text-ink/80 ${
                        matchesFilters(
                          { ages: ["tweens"], price: "free", hoods: ["west", "north", "downtown", "henderson"] },
                          filters,
                        )
                          ? ""
                          : "hidden"
                      }`}
                    >
                      Library teen hangouts / game nights (free; recurring on{" "}
                      <GuideLink href={GUIDE_URLS.vkHome}>vegaskiddos.com</GuideLink>)
                    </div>
                    <VenueCard
                      venue={venueById("discovery-kids")!}
                      hidden={!matchesFilters(venueById("discovery-kids")!, filters)}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </Section>

      {/* Free vs paid summary */}
      <Section title="Free vs paid" wash="teal" hidden={hasActiveFilters && !hasMatches}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            data-price="free"
            className={`rounded-blob border border-teal/20 bg-white/80 p-4 ${
              filters.price === "paid" ? "hidden" : ""
            }`}
          >
            <h3 className="font-display text-lg font-600 text-ink">🆓 Free (or free entry)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                City and county library programs (storytime, STEM, teen hangouts, kids cafe meals
                where offered) —{" "}
                <GuideLink href={GUIDE_URLS.vkHome}>vegaskiddos.com</GuideLink>
              </li>
              <li>
                <GuideLink href={GUIDE_URLS.viva}>VIVA Pumpkin Patch</GuideLink> free RSVP entry
                (rides/food/vendors cost extra)
              </li>
              <li>
                <GuideLink href={GUIDE_URLS.viva}>VIVA Trunk or Treat</GuideLink> Oct 30, 2 p.m.,
                free registration
              </li>
              <li>Other park patches: confirm whether rides and pumpkins cost extra</li>
              <li>
                Neighborhood trunk-or-treats hosted by schools, churches, and rec centers — watch{" "}
                <GuideLink href={GUIDE_URLS.summerlinTrunkTreat}>local listings</GuideLink> the first
                two weeks of October
              </li>
            </ul>
          </div>
          <div
            data-price="paid"
            className={`rounded-blob border border-coral/20 bg-white/80 p-4 ${
              filters.price === "free" ? "hidden" : ""
            }`}
          >
            <h3 className="font-display text-lg font-600 text-ink">💳 Paid</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                <GuideLink href={GUIDE_URLS.halloveen}>HallOVeen Magical Forest</GuideLink> ($24; 3
                and under free; date-specific tickets; reserve ahead near Halloween)
              </li>
              <li>
                <GuideLink href={GUIDE_URLS.hauntedHarvest}>Springs Preserve Haunted Harvest</GuideLink>{" "}
                ($14 ages 3+ non-members; members cheaper or free per tier; advance tickets; expected
                to sell out)
              </li>
              <li>
                <GuideLink href={GUIDE_URLS.trickOrTreatFest}>Trick or Treat Fest LV</GuideLink>{" "}
                (tickets TBA on fest site; county listing ~$15, confirm on fest site)
              </li>
              <li>
                <GuideLink href={GUIDE_URLS.discoveryKids}>Museum admission</GuideLink> add-ons
              </li>
              <li>Carnival ride wristbands at patches</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/80">
          Tip: if the free patch has paid rides, set a cash or card limit before you park. The
          negotiation at the ticket booth is the real haunted house.
        </p>
      </Section>

      {/* By neighborhood */}
      <Section title="By neighborhood" wash="sunny" hidden={hasActiveFilters && !hasMatches}>
        <FallGuideValleyMap
          activeHood={filters.hood}
          onSelectHood={(hood) => setFilter("hood", hood)}
        />
        <div className="mt-6 space-y-6">
          {NEIGHBORHOODS.map((hood) => {
            const hoodVenues = hood.venueIds
              .map((id) => venueById(id))
              .filter((v): v is GuideVenue => !!v && matchesFilters(v, filters));
            const showHood =
              filters.hood === "all" || filters.hood === hood.id;
            if (!showHood) return null;
            if (hoodVenues.length === 0 && hood.extraBullets.length === 0 && hasActiveFilters)
              return null;

            return (
              <div
                key={hood.id}
                id={`hood-${hood.id}`}
                data-hood={hood.id}
                className="rounded-blob border border-ink/10 bg-white/90 p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-sunny/30 text-2xl"
                    aria-hidden
                  >
                    {hood.emoji}
                  </span>
                  <h3 className="font-display text-lg font-600 text-ink">{hood.title}</h3>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-ink/80">
                  {hoodVenues.map((v) => (
                    <li key={v.id}>
                      <GuideLink href={v.url}>{v.name}</GuideLink>
                    </li>
                  ))}
                  {hood.extraBullets.map((b) => (
                    <li key={b.label}>
                      <GuideLink href={b.url}>{b.label}</GuideLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* On the board */}
      <Section title="On the board now" wash="grape" hidden={visibleBoard.length === 0 && hasActiveFilters}>
        <p className="text-ink/80">
          A free/local slice from the Vegas Kiddos board. Not every October ticket, just the reliable
          patterns.
        </p>
        <p className="mt-3 text-ink/80">
          <span className="font-700">Free recurring meals (Three Square Kids Cafe / Meet Up to Eat Up):</span>{" "}
          Ages about 2–18. First-come while food lasts. Branches with listings on Vegas Kiddos:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {BOARD_ITEMS.filter((b) => b.id.startsWith("kc-") && matchesFilters(b, filters)).map((b) => (
            <li key={b.id}>
              <a
                href={b.url}
                data-age={b.ages.join(" ")}
                data-price={b.price}
                data-hood={b.hoods.join(" ")}
                className="inline-block rounded-full bg-white/80 px-3 py-1 text-sm font-700 text-teal-btn shadow-sm hover:bg-white"
              >
                {b.label.replace(" Kids Cafe", "")}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          {BOARD_ITEMS.filter((b) => !b.id.startsWith("kc-") && matchesFilters(b, filters)).map(
            (b) => (
              <p
                key={b.id}
                data-age={b.ages.join(" ")}
                data-price={b.price}
                data-hood={b.hoods.join(" ")}
                className="text-ink/80"
              >
                <GuideLink href={b.url}>{b.label}</GuideLink>
              </p>
            ),
          )}
        </div>
        <p className="mt-4 text-sm text-ink/70">
          Ticketed{" "}
          <GuideLink href={GUIDE_URLS.halloveen}>HallOVeen</GuideLink>,{" "}
          <GuideLink href={GUIDE_URLS.viva}>VIVA</GuideLink>,{" "}
          <GuideLink href={GUIDE_URLS.hauntedHarvest}>Haunted Harvest</GuideLink>, and{" "}
          <GuideLink href={GUIDE_URLS.trickOrTreatFest}>Trick or Treat Fest</GuideLink> stay in the
          sections above with their official links. Check Vegas Kiddos the week you go.
        </p>
      </Section>

      {/* October plan */}
      <Section title="A simple October plan" wash="cream" hidden={hasActiveFilters && !hasMatches}>
        <div className="grid gap-3 sm:grid-cols-2">
          {OCTOBER_PLAN.map((item) => (
            <div
              key={item.title}
              className="rounded-blob border border-ink/10 bg-white p-4 shadow-sm"
            >
              <p className="text-2xl" aria-hidden>{item.emoji}</p>
              <p className="mt-1 font-700 text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink/80">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Checklist */}
      <Section title="Costume and logistics checklist" wash="cream" hidden={hasActiveFilters && !hasMatches}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHECKLIST.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-blob border border-ink/10 bg-white p-3 shadow-sm"
            >
              <span className="text-xl" aria-hidden>{item.emoji}</span>
              <p className="text-sm text-ink/80">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer sections — always visible */}
      <Section title="What we are not listing yet" wash="white">
        <p className="text-ink/80">
          Unverified pop-ups, unofficial &ldquo;haunted&rdquo; yards, and anything without a public
          date or address. If it is only a flyer in a Facebook comment, it is not here.
        </p>
      </Section>

      <p className="mt-6 text-lg italic text-ink/70">
        The valley does fall in short bursts. Catch one good night and let the rest of the month be
        early bedtime.
      </p>
    </>
  );
}

function GuideFallback() {
  return <p className="text-ink/70">Loading guide…</p>;
}

export function FallHalloweenGuide2026() {
  return (
    <Suspense fallback={<GuideFallback />}>
      <FallHalloweenGuideContent />
    </Suspense>
  );
}
