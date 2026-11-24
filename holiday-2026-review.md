# Holiday Guide 2026 review and image handoff

For Studio, to implement in the vegaskiddos repo. Nothing in this folder was pushed or deployed.

- Live page: https://vegaskiddos.com/guides/holiday-guide-2026
- Spanish URL exists, but the article body is still English (see below)
- Source repo: `Threesided-Studios/vegaskiddos` (this box has a checkout at `/workspace/vegaskiddos` on `main`). A search under `adamaragon` did not turn up a separate public copy.
- Rechecked: Mon, Nov 9, 2026, evening America/Los_Angeles
- Source data last noted as checked: Oct 27, 2026

## What to ship

1. Copy the 11 WebP files from `/workspace/vegaskiddos/holiday-2026-images/` into `public/guides/holiday-2026/`.
2. Apply `/workspace/vegaskiddos/holiday-2026-copy.patch` (`git apply holiday-2026-copy.patch`). It already checks clean against current `main`.
3. Build, click through the guide, then open a PR. Promo is not shipping this.

The patch updates facts in `lib/holiday-guide-data.ts` and `components/guides/HolidayGuideBody.tsx`, adds an optional `image` field on `GuideVenue`, renders that image in `VenueCard`, and adds a hero image at the top of the holiday guide. It also turns Bellagio Conservatory and The Nutcracker into full venue cards, since both now have official 2026 dates.

## Spanish version

https://vegaskiddos.com/es/guides/holiday-guide-2026 exists and uses the same slug, but `HolidayGuideBody` is English-only. The `/es/` route only translates chrome (nav, footer). There is no Spanish guide body to fact-check, and no Spanish alt text yet. A translation pass is a follow-up, not part of this patch.

## Counts

- Current featured venue cards: 8
- Other named listings in the body (free/paid lists, not cards today): Bellagio Conservatory, The Nutcracker
- Recurring board chips (library Kids Cafe, teen hangouts, pajama storytime, STEM): 14, not illustrated
- Images made: 11 (1 hero + 8 current cards + Bellagio + Nutcracker)
- Copy corrections in the patch: see "Key corrections" below

## Key corrections

These are the changes parents would notice.

### Downtown Summerlin: 2026 schedule is up; source link and prices were stale

The guide still pointed at a Nov 1, 2025 press page (`https://summerlin.com/downtown-summerlin-kicks-off-2025-holiday-season/`). That page is still live, so it is not a 404, but it is last year's announcement. The official 2026 announcement is https://summerlin.com/celebrate-the-holidays-at-downtown-summerlin/ (Nov 3, 2026).

Update from last season / "not posted yet" to:

- Parade: Fri–Sat 6 p.m., Nov 20–Dec 19, 2026; no parade on Nov 27. Free.
- Rock Rink: Nov 13, 2026–Jan 18, 2027. Official page lists skate rentals at $22, with special pricing on select dates. The old "$18" figure is from the 2025 announcement.
- Santa Chalet: daily Nov 13–Dec 24, photo packages from $39.99 (this price is unchanged).
- Jupiter Express train: $7 a person, beginning Nov 13. The guide still says $5, which is the 2025 price.
- Sensory-friendly Santa is confirmed for 2026: Sat Dec 5, 10 a.m.–noon. The guide currently says "watch for it again."
- Optional add: Hanukkah with Jewish Nevada, Sun Dec 6, 4–6 p.m.

### Glittering Lights: closing hours are posted

Dates, cash/card price, Fast Pass, and Santa Tram were already right, from the official fact sheet. The hours line ("Opens 5 p.m. nightly; closing time not posted") is now stale.

Official 2026 fact sheet (https://glitteringlightslasvegas.com/fact-sheet/ and the PDF at https://glitteringlightslasvegas.com/wp-content/uploads/2026/06/Glittering-Lights-2026-Fact-Sheet.pdf):

- Sun–Thu 5–9 p.m.; Fri, Sat and holidays 5–10 p.m.
- Address: 7000 N. Las Vegas Blvd. Use I-15 exit 54 (Speedway Blvd). The venue warns that GPS can send you to a closed gate.
- Optional: Season Pass is $149 for two vehicles and includes Fast Pass.

### Springs Preserve: hours matter, and the place is closed Tue–Wed

Toddler Time, resident prices, and Thanksgiving/Christmas closures were already right. Two important facts were missing:

- Open Thu–Mon, 9 a.m.–4 p.m., last entry 3 p.m. Closed Tuesday and Wednesday.
- Cashless venue.
- Address: 333 S. Valley View Blvd, Las Vegas, NV 89107.
- Butterfly Habitat is seasonal and open through Nov 23, 2026. If this ships after that date, drop or past-tense that line.

Sources: https://www.springspreserve.org/visitor-information/tickets.html, https://www.springspreserve.org/visitor-information/plan-your-visit.html, https://www.springspreserve.org/events/?id=2178

### The Nutcracker: official dates are Dec 14–27, not Dec 16–27, and no kids under 3

The paid list currently says "resale sites list Dec 16–27; buy from the box office." Official Nevada Ballet Theatre calendar (https://nevadaballet.org/performances/the-nutcracker/) is Dec 14–27, 2026, at Reynolds Hall, The Smith Center, and it is not every day. Public showtimes listed on Nov 9:

- Dec 14, 15, 21, 22, 23: 2:00 p.m. and 7:30 p.m.
- Dec 19, 20: 7:30 p.m.
- Dec 24, 26: 2:00 p.m.
- Dec 27: 7:30 p.m.

The company page also says no children under 3 are admitted. That belongs in a kids guide. Buy from NBT or the box office, not a resale site.

### Bellagio Conservatory: 2026 dates are posted

The free list still says "last year it ran mid-November to early January." Official Bellagio calendar (https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html):

- Holiday display: Nov 14, 2026–Jan 2, 2027
- Closed for installation: Nov 8–13, 2026 (so it is dark as of this review)
- Still free and, as the guide already says, typically open around the clock

The official theme name is "Postcards From Christmas." We do not need to lean on that in the parent blurb.

### Henderson WinterFest: 2026 hours now match what we had as "last year"

Dates Dec 3–4, 2026 were already right. The hours were labeled "Last year" in the data file. FOX5, Nov 6, 2026, reporting the city's announcement, confirms the same hours for 2026:

- Thu Dec 3: tree lighting and drone show, 5–7:30 p.m.
- Fri Dec 4: Electric Light Parade, 6:30–8:30 p.m.
- Free. Water Street Plaza, 240 S. Water St., Henderson.
- No shuttle this year; parking is limited; arrive early.

The city's own WinterFest page (https://www.cityofhenderson.com/residents/special-interest/winterfest/) returned 403 from this review environment, so the patch cites the city via that FOX5 report. Hoodline, also Nov 6, 2026, repeats the same hours and notes the city was still finalizing the full performer lineup. Re-check the city page before publish if you can reach it.

### Magical Forest: tickets are on sale; a clear base price is still not on the official page

Dates, hours, "3 and under free," address, and "box office closes 30 minutes before the park" all still match https://www.opportunityvillage.org/ovevents/magical-forest.

Stale lines:

- "2026 ticket prices not posted yet"
- "Sales open this fall"

Tickets are now date-specific and on sale. The official page lists discounts and bulk pricing ($19 non-peak / $21 peak for 10 or more) but does not clearly state a public base price in the content we could read. Third-party listings (Family Fun Vegas) say $25, sometimes with $27 peak. Do not treat $25 / $27 as official until Opportunity Village posts it. The patch says: children 3 and under free; date-specific tickets are on sale; confirm the current price on the official page when you buy; free parking in the College of Southern Nevada lot.

One date caution: a blog post on the same Opportunity Village site and some third-party calendars list Dec 3–6 and Dec 10–24 (which would skip Dec 7–9). The official Magical Forest event page still says Nov 27–29, Dec 3–24, and Dec 26–Jan 1. The patch keeps the official event-page range.

### Ethel M: already accurate, with one useful add

Dates, hours, $3, under 2 and 65+ free, parking warning, and address all match https://www.ethelm.com/en-us/locations/henderson-flagship/cactus-garden/holiday-cactus-garden. The patch adds that Santa is on site through Dec 23, and not after that date.

### Turkey Trot: already accurate

https://bbscendurance.com/lasvegasturkeytrot/ confirms Thanksgiving Day, Nov 26, 2026; 5K and 1 mile start at 8:15 a.m.; Historic Railroad Trail lot, Lakeshore Rd, Boulder City; current late-registration tier through race day is $50 for the 1-mile stroll and $65 for the 5K. The patch only clarifies that this is the current late-registration tier.

### Noon Year's Eve: hours and closures are right; 2026 event still not on the museum site

Museum hours and holiday closures match https://discoverykidslv.org/hours-directions/. Address is 360 Promenade Place.

We could not verify a 2026 Noon Year's Eve listing on discoverykidslv.org (calendar: https://discoverykidslv.org/calendar/). Third-party pages claim Holiday Wonder Week Dec 26–31 and balloon drops at noon and 2 p.m. on Dec 31. Do not treat those as confirmed. The patch keeps "2026 is not posted on the museum site yet."

What is official, and missing from the guide: Elf Weekend, Nov 27–29, 10 a.m.–5 p.m. (https://discoverykidslv.org/event-calendar/elf-weekend-2026/). The patch adds this as an "Also this season" fact on the museum card.

## Copy notes (typos, em dashes, voice)

- No user-facing em dashes in the holiday guide. Date and time ranges use en dashes (Nov 6, 2026–Jan 3, 2027), which is the existing style. Leave those.
- No typos worth fixing in the current body. "HallOVeen" is the official event name.
- Voice is already plain and parent-facing. No AI-tell rewrite is needed. The intro still works; the patch only softens "Several 2026 schedules are still coming out" now that Summerlin, Bellagio, and WinterFest hours are posted.
- Update the closing "What we are not listing yet" paragraph so it no longer waits on Summerlin's schedule or Magical Forest ticket sales.

## Could not verify

- Official 2026 Noon Year's Eve on discoverykidslv.org. Third-party listings exist; the museum site does not, as of this review.
- Official Magical Forest base ticket price on the Opportunity Village page. Sales are open; the base adult/child price is not clearly posted there.
- City of Henderson WinterFest page itself (HTTP 403 from this environment). Hours and dates are taken from FOX5's Nov 6, 2026 report of the city's announcement.
- Whether Magical Forest is dark Dec 7–9. Official event page says Dec 3–24; a same-site blog and some calendars disagree. Patch follows the event page.

## Recommended adds (in the patch)

- Bellagio Conservatory as a full free venue card. Neighborhood note: it is on the Strip, and the guide has no Strip zone, so the card is tagged `downtown` for filters only. The neighborhood list calls out that it is on the Strip, and the card fact line says the same.
- The Nutcracker as a full paid venue card, downtown, kids and tweens only (no under-3).
- DISCOVERY Elf Weekend on the museum card.

## Optional adds (not in the patch)

These are already on the Vegas Kiddos board, or are strong 2026 family listings, and could be a later pass:

- Tamales & Mariachi Festival, Sat Dec 5, Las Vegas Civic Center plaza, free (City of Las Vegas)
- Cowboy Christmas & Classic Car Show, Sat Dec 5, Floyd Lamb Park, free (City of Las Vegas)
- A December to Remember at the Las Vegas Science & Natural History Museum (listed on Vegas Kiddos)
- City of Henderson Pictures with Santa (board listing is thin on venue details; confirm before adding)

Library Kids Cafe and teen programs were not re-verified one by one in this pass. They are recurring board items, not the holiday feature cards.

## Image implementation

Files and alt text: `/workspace/vegaskiddos/holiday-2026-images/manifest.md`

Copy into the repo as:

```
public/guides/holiday-2026/holiday-guide-2026-hero.webp
public/guides/holiday-2026/glittering-lights.webp
public/guides/holiday-2026/magical-forest.webp
public/guides/holiday-2026/ethel-m.webp
public/guides/holiday-2026/winterfest.webp
public/guides/holiday-2026/downtown-summerlin.webp
public/guides/holiday-2026/springs-preserve.webp
public/guides/holiday-2026/turkey-trot.webp
public/guides/holiday-2026/discovery-noon.webp
public/guides/holiday-2026/bellagio-conservatory.webp
public/guides/holiday-2026/nutcracker.webp
```

Hero is 1920x1080. Cards are 1200x800 (3:2), which matches a comfortable `VenueCard` photo. The fall Halloween guide can keep emoji-only cards; `image` is optional.

Do not use the `.source.jpg` files on the site. They are only there if you need to re-export.

## How to apply

From the repo root, after copying the WebP files into `public/guides/holiday-2026/`:

```
git apply holiday-2026-copy.patch
```

If the patch file is kept outside the repo, point `git apply` at `/workspace/vegaskiddos/holiday-2026-copy.patch`. Then run the usual install, lint, and a local click-through of `/guides/holiday-guide-2026` and `/es/guides/holiday-guide-2026`.

The `/es/` page will still be English in the body until a translation pass. Hero and card alt text are English, which is consistent with the current body.

## Files in this handoff

- `/workspace/vegaskiddos/holiday-2026-review.md` (this file)
- `/workspace/vegaskiddos/holiday-2026-copy.patch`
- `/workspace/vegaskiddos/holiday-2026-images/` (11 WebP + source JPEGs + `manifest.md`)

No commits, pushes, or deploys were made.
