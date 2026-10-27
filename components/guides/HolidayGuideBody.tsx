import { Cloud, Star } from "@/components/Doodles";
import {
  HOLIDAY_AGE_BANDS,
  HOLIDAY_BOARD_ITEMS,
  HOLIDAY_CHECKLIST,
  HOLIDAY_NEIGHBORHOODS,
  HOLIDAY_PLAN,
  HOLIDAY_URLS,
  HOLIDAY_VENUES,
  holidayVenueById,
} from "@/lib/holiday-guide-data";
import {
  FallGuideFilterBar,
  FallGuideFilterEmpty,
  FallGuideNeighborhoodMap,
} from "./FallGuideFilterProvider";
import { GuideLink, GuideSection, VenueCard } from "./fall-guide-ui";

export function HolidayGuideBody() {
  return (
    <>
      <div className="relative overflow-hidden rounded-blob bg-gradient-to-br from-teal/20 via-sunny/20 to-coral/20 p-6 shadow-card">
        <Star className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 rotate-12 text-sunny/30" />
        <Cloud className="pointer-events-none absolute bottom-2 left-4 h-12 w-16 text-teal/20" />
        <p className="relative text-lg leading-relaxed text-ink/80">
          Six weeks, four holidays, one winter break. The valley lights up and the calendar fills
          itself.
        </p>
        <p className="relative mt-3 text-ink/80">
          A plain parent guide to Thanksgiving through New Year&apos;s around the valley, sorted by
          age, free vs paid, and neighborhood. Dates below are checked against each venue or a
          named listing, and we say which. Several 2026 schedules are still coming out, so check
          back.
        </p>
      </div>

      <GuideSection id="how-to" title="How to use this" wash="white">
        <p className="text-ink/80">
          Use the filters below to narrow by age, budget, and neighborhood, or tap a zone on the
          map. Start broad, then tighten once you see what fits your week.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-6 text-ink/80">
          <li>Pick an <span className="font-700">age band</span> chip.</li>
          <li>Choose <span className="font-700">free</span> or <span className="font-700">paid</span>.</li>
          <li>
            Set a <span className="font-700">neighborhood</span> (or tap the map). December
            traffic near the Strip is its own holiday tradition.
          </li>
        </ol>
        <p className="mt-3 text-sm text-ink/70">
          Always re-check the venue page the week you go. Holiday hours change around Thanksgiving,
          Christmas, and New Year&apos;s.
        </p>
        <FallGuideFilterBar />
      </GuideSection>

      <FallGuideFilterEmpty />

      <GuideSection title="Age bands" wash="coral" matchRequired>
        {HOLIDAY_AGE_BANDS.map((band) => (
          <div key={band.id} data-guide-age-band={band.id} className="mb-8 last:mb-0">
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
                    <GuideLink href={HOLIDAY_URLS.glitteringLights}>Glittering Lights</GuideLink>{" "}
                    from the car seat, pajamas on
                  </li>
                  <li>
                    <GuideLink href={HOLIDAY_URLS.ethelM}>Ethel M cactus garden</GuideLink> (under
                    2 free, short loop)
                  </li>
                  <li>
                    <GuideLink href={HOLIDAY_URLS.discoveryKids}>Noon Year&apos;s Eve</GuideLink> at
                    DISCOVERY Children&apos;s Museum
                  </li>
                  <li>
                    Library storytimes and pajama nights (check your branch on{" "}
                    <GuideLink href={HOLIDAY_URLS.vkStorytime}>Vegas Kiddos</GuideLink>)
                  </li>
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
                  {HOLIDAY_VENUES.filter((v) => v.ages.includes("kids")).map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              </>
            )}

            {band.id === "tweens" && (
              <>
                <p className="mt-3 font-700 text-ink/80">Good fits:</p>
                <div className="mt-3 space-y-4">
                  {HOLIDAY_VENUES.filter((v) => v.ages.includes("tweens")).map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                  <div
                    data-guide-item
                    data-age="tweens"
                    data-price="free"
                    data-hood="west north downtown henderson"
                    className="rounded-blob border border-ink/10 bg-white/80 p-4 text-ink/80"
                  >
                    Library teen hangouts and game nights over winter break (free; recurring on{" "}
                    <GuideLink href={HOLIDAY_URLS.vkHome}>vegaskiddos.com</GuideLink>)
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </GuideSection>

      <GuideSection title="Free vs paid" wash="teal" matchRequired>
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            data-guide-price-col="free"
            className="rounded-blob border border-teal/20 bg-white/80 p-4"
          >
            <h3 className="font-display text-lg font-600 text-ink">🆓 Free (or free entry)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                <GuideLink href={HOLIDAY_URLS.winterfest}>Henderson WinterFest</GuideLink> Dec 3–4:
                tree lighting and light parade
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.downtownSummerlin}>Downtown Summerlin</GuideLink>{" "}
                weekend parade with snowfall (2026 dates not posted yet; check before you go)
              </li>
              <li>
                Bellagio Conservatory holiday display on the Strip: free, open around the clock;
                last year it ran mid-November to early January
              </li>
              <li>
                Library programs, kids cafe meals, and teen hangouts:{" "}
                <GuideLink href={HOLIDAY_URLS.vkHome}>vegaskiddos.com</GuideLink>
              </li>
              <li>Neighborhood light streets: drive slowly, park legally, stay on the sidewalk</li>
            </ul>
          </div>
          <div
            data-guide-price-col="paid"
            className="rounded-blob border border-coral/20 bg-white/80 p-4"
          >
            <h3 className="font-display text-lg font-600 text-ink">💳 Paid</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                <GuideLink href={HOLIDAY_URLS.ethelM}>Ethel M Holiday Cactus Garden</GuideLink> ($3
                per person; under 2 and 65+ free)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.glitteringLights}>Glittering Lights</GuideLink> (per
                car, $39 cash or $44 card)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.magicalForest}>Magical Forest</GuideLink> (3 and
                under free; 2026 prices not posted yet, check before you go)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.springsPreserve}>Springs Preserve</GuideLink> (Nevada
                resident kids $4.95)
              </li>
              <li>
                Nevada Ballet Theatre&apos;s <span className="italic">The Nutcracker</span> at The
                Smith Center (resale sites list Dec 16–27; buy from the box office)
              </li>
              <li>Skating, Santa photos, and train rides at Downtown Summerlin</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/80">
          Tip: the cheapest night out is still a thermos of cocoa and a slow drive past the
          neighbor who went overboard. Every street has one.
        </p>
      </GuideSection>

      <GuideSection title="By neighborhood" wash="sunny" matchRequired>
        <FallGuideNeighborhoodMap />
        <div className="mt-6 space-y-6">
          {HOLIDAY_NEIGHBORHOODS.map((hood) => {
            const hoodVenues = hood.venueIds.map((id) => holidayVenueById(id)).filter(Boolean);
            return (
              <div
                key={hood.id}
                id={`hood-${hood.id}`}
                data-guide-hood-block={hood.id}
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
                    <li key={v!.id}>
                      <GuideLink href={v!.url}>{v!.name}</GuideLink>
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
      </GuideSection>

      <GuideSection title="On the board now" wash="grape" matchRequired>
        <p className="text-ink/80">
          A free/local slice from the Vegas Kiddos board. These keep running through winter break,
          when kids are home and a free lunch matters.
        </p>
        <p className="mt-3 text-ink/80">
          <span className="font-700">Free recurring meals (Three Square Kids Cafe / Meet Up to Eat Up):</span>{" "}
          Ages about 2–18. First-come while food lasts. Branches with listings on Vegas Kiddos:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {HOLIDAY_BOARD_ITEMS.filter((b) => b.id.startsWith("kc-")).map((b) => (
            <li key={b.id}>
              <a
                href={b.url}
                data-guide-item
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
          {HOLIDAY_BOARD_ITEMS.filter((b) => !b.id.startsWith("kc-")).map((b) => (
            <p
              key={b.id}
              data-guide-item
              data-age={b.ages.join(" ")}
              data-price={b.price}
              data-hood={b.hoods.join(" ")}
              className="text-ink/80"
            >
              <GuideLink href={b.url}>{b.label}</GuideLink>
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink/70">
          Holiday storytimes, menorah lightings, Kwanzaa programs, and Santa visits land on the
          board as venues post them. Search{" "}
          <GuideLink href={HOLIDAY_URLS.vkHolidaySearch}>holiday</GuideLink> or{" "}
          <GuideLink href={HOLIDAY_URLS.vkSantaSearch}>Santa</GuideLink> on Vegas Kiddos the week
          you go.
        </p>
      </GuideSection>

      <GuideSection title="The dates that move everything" wash="cream">
        <ul className="list-disc space-y-1 pl-6 text-ink/80">
          <li>
            <span className="font-700">Thanksgiving:</span> Thu, Nov 26. Museums and the Springs
            Preserve close for the day.
          </li>
          <li>
            <span className="font-700">Hanukkah:</span> begins the evening of Fri, Dec 4, through
            Sat, Dec 12.
          </li>
          <li>
            <span className="font-700">Christmas:</span> Fri, Dec 25. Most attractions close or run
            short hours on the 24th and 25th.
          </li>
          <li>
            <span className="font-700">Kwanzaa:</span> Sat, Dec 26 through Fri, Jan 1.
          </li>
          <li>
            <span className="font-700">New Year&apos;s Eve:</span> Thu, Dec 31. Several venues close
            early; New Year&apos;s Day closures are common.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="A simple season plan" wash="cream">
        <div className="grid gap-3 sm:grid-cols-2">
          {HOLIDAY_PLAN.map((item) => (
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
      </GuideSection>

      <GuideSection title="Cold-night checklist" wash="cream">
        <div className="grid gap-3 sm:grid-cols-2">
          {HOLIDAY_CHECKLIST.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-blob border border-ink/10 bg-white p-3 shadow-sm"
            >
              <span className="text-xl" aria-hidden>{item.emoji}</span>
              <p className="text-sm text-ink/80">{item.text}</p>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="What we are not listing yet" wash="white">
        <p className="text-ink/80">
          Pop-up Santa photo ops, unofficial light displays, and anything without a public date or
          address. When Downtown Summerlin and the museum post their 2026 schedules and Magical
          Forest posts ticket prices, we update this page.
        </p>
      </GuideSection>

      <p className="mt-6 text-lg italic text-ink/70">
        You do not have to do all of it. One night of lights and one slow morning is a good season.
      </p>
    </>
  );
}
