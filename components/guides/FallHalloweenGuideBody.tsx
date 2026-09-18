import { Cloud, Star } from "@/components/Doodles";
import {
  AGE_BANDS,
  BOARD_ITEMS,
  CHECKLIST,
  FLAGSHIP_VENUES,
  GUIDE_URLS,
  NEIGHBORHOODS,
  OCTOBER_PLAN,
  venueById,
} from "@/lib/fall-guide-data";
import {
  FallGuideFilterBar,
  FallGuideFilterEmpty,
  FallGuideNeighborhoodMap,
} from "./FallGuideFilterProvider";
import { GuideLink, GuideSection, VenueCard } from "./fall-guide-ui";

export function FallHalloweenGuideBody() {
  return (
    <>
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

      <GuideSection id="how-to" title="How to use this" wash="white">
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
        <FallGuideFilterBar />
      </GuideSection>

      <FallGuideFilterEmpty />

      <GuideSection title="Age bands" wash="coral" matchRequired>
        {AGE_BANDS.map((band) => (
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
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              </>
            )}

            {band.id === "tweens" && (
              <>
                <p className="mt-3 font-700 text-ink/80">Good fits:</p>
                <div className="mt-3 space-y-4">
                  {FLAGSHIP_VENUES.filter((v) => v.ages.includes("tweens")).map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                  <div
                    data-guide-item
                    data-age="tweens"
                    data-price="free"
                    data-hood="west north downtown henderson"
                    className="rounded-blob border border-ink/10 bg-white/80 p-4 text-ink/80"
                  >
                    Library teen hangouts / game nights (free; recurring on{" "}
                    <GuideLink href={GUIDE_URLS.vkHome}>vegaskiddos.com</GuideLink>)
                  </div>
                  <VenueCard venue={venueById("discovery-kids")!} />
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
            data-guide-price-col="paid"
            className="rounded-blob border border-coral/20 bg-white/80 p-4"
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
      </GuideSection>

      <GuideSection title="By neighborhood" wash="sunny" matchRequired>
        <FallGuideNeighborhoodMap />
        <div className="mt-6 space-y-6">
          {NEIGHBORHOODS.map((hood) => {
            const hoodVenues = hood.venueIds.map((id) => venueById(id)).filter(Boolean);
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
          A free/local slice from the Vegas Kiddos board. Not every October ticket, just the reliable
          patterns.
        </p>
        <p className="mt-3 text-ink/80">
          <span className="font-700">Free recurring meals (Three Square Kids Cafe / Meet Up to Eat Up):</span>{" "}
          Ages about 2–18. First-come while food lasts. Branches with listings on Vegas Kiddos:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {BOARD_ITEMS.filter((b) => b.id.startsWith("kc-")).map((b) => (
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
          {BOARD_ITEMS.filter((b) => !b.id.startsWith("kc-")).map((b) => (
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
          Ticketed{" "}
          <GuideLink href={GUIDE_URLS.halloveen}>HallOVeen</GuideLink>,{" "}
          <GuideLink href={GUIDE_URLS.viva}>VIVA</GuideLink>,{" "}
          <GuideLink href={GUIDE_URLS.hauntedHarvest}>Haunted Harvest</GuideLink>, and{" "}
          <GuideLink href={GUIDE_URLS.trickOrTreatFest}>Trick or Treat Fest</GuideLink> stay in the
          sections above with their official links. Check Vegas Kiddos the week you go.
        </p>
      </GuideSection>

      <GuideSection title="A simple October plan" wash="cream">
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
      </GuideSection>

      <GuideSection title="Costume and logistics checklist" wash="cream">
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
      </GuideSection>

      <GuideSection title="What we are not listing yet" wash="white">
        <p className="text-ink/80">
          Unverified pop-ups, unofficial &ldquo;haunted&rdquo; yards, and anything without a public
          date or address. If it is only a flyer in a Facebook comment, it is not here.
        </p>
      </GuideSection>

      <p className="mt-6 text-lg italic text-ink/70">
        The valley does fall in short bursts. Catch one good night and let the rest of the month be
        early bedtime.
      </p>
    </>
  );
}
