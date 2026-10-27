// Thanksgiving to New Year's 2026 guide: venue data, filter tags, and source URLs.
// Shares filter types, neighborhoods, and the client filter island with the fall guide.

import {
  GUIDE_URLS,
  type GuideAge,
  type GuideBoardItem,
  type GuideNeighborhood,
  type GuideVenue,
} from "./fall-guide-data";

/** External + VK URLs (checked 2026-10-27). */
export const HOLIDAY_URLS = {
  glitteringLights: "https://glitteringlightslasvegas.com/",
  magicalForest: "https://www.opportunityvillage.org/ovevents/magical-forest",
  ethelM: "https://www.ethelm.com/en-us/locations/henderson-flagship/cactus-garden/holiday-cactus-garden",
  winterfest: "https://www.cityofhenderson.com/residents/special-interest/winterfest/",
  downtownSummerlin: "https://summerlin.com/downtown-summerlin-kicks-off-2025-holiday-season/",
  springsPreserve: "https://www.springspreserve.org/events/",
  turkeyTrot: "https://bbscendurance.com/lasvegasturkeytrot/",
  discoveryKids: GUIDE_URLS.discoveryKids,
  vkHome: GUIDE_URLS.vkHome,
  vkStorytime: GUIDE_URLS.vkStorytime,
  vkHolidaySearch: "https://vegaskiddos.com/?q=holiday",
  vkSantaSearch: "https://vegaskiddos.com/?q=Santa",
} as const;

export const HOLIDAY_VENUES: GuideVenue[] = [
  {
    id: "glittering-lights",
    name: "Glittering Lights at Las Vegas Motor Speedway",
    url: HOLIDAY_URLS.glitteringLights,
    emoji: "🚗",
    blurb: "Drive-through lights. Pajamas and car seats welcome; nobody has to put on shoes.",
    ages: ["toddler", "kids", "tweens"],
    price: "paid",
    hoods: ["north"],
    featured: true,
    facts: [
      { label: "Dates", value: "Nov 6, 2026–Jan 3, 2027, nightly, holidays included (official fact sheet)" },
      { label: "Hours", value: "Opens 5 p.m. nightly; closing time not posted, check before you go" },
      { label: "Price", value: "Per car: $39 cash at the gate, $44 by card; Fast Pass $64; Santa Tram $25 a person on select nights" },
      { label: "Where", value: "Las Vegas Motor Speedway, far north end of the valley" },
    ],
  },
  {
    id: "magical-forest",
    name: "Magical Forest at Opportunity Village",
    url: HOLIDAY_URLS.magicalForest,
    emoji: "🎄",
    blurb: "Lights walk, rides, mini golf, the Forest Express train, and Santa's cabin. Same campus as HallOVeen.",
    ages: ["toddler", "kids", "tweens"],
    price: "paid",
    hoods: ["central"],
    featured: true,
    facts: [
      { label: "Dates", value: "Nov 27–29, Dec 3–24 and Dec 26–Jan 1 (Opportunity Village)" },
      { label: "Hours", value: "5:30–9 p.m. Sun–Thu; 5:30–9:30 p.m. Fri–Sat" },
      { label: "Price", value: "Children 3 and under free. 2026 ticket prices not posted yet; check before you go" },
      { label: "Tickets", value: "Sales open this fall; box office closes 30 minutes before the park" },
      { label: "Address", value: "6300 W Oakey Blvd" },
    ],
  },
  {
    id: "ethel-m",
    name: "Ethel M Holiday Cactus Garden",
    url: HOLIDAY_URLS.ethelM,
    emoji: "🌵",
    blurb: "Cactus wrapped in lights. Short walk, low cost, easy exit.",
    ages: ["toddler", "kids", "tweens"],
    price: "paid",
    hoods: ["henderson"],
    featured: true,
    facts: [
      { label: "Dates", value: "Nov 5, 2026–Jan 3, 2027, nightly; no reservations" },
      { label: "Hours", value: "5–10 p.m.; 5–8 p.m. Dec 24, Dec 31 and Jan 1; closed Dec 25" },
      { label: "Price", value: "$3 per person; under 2 and 65+ free" },
      { label: "Parking", value: "Ethel M lots or the Smith's lot across the street; nearby business-park lots tow" },
      { label: "Address", value: "2 Cactus Garden Drive, Henderson" },
    ],
  },
  {
    id: "winterfest",
    name: "Henderson WinterFest, Water Street District",
    url: HOLIDAY_URLS.winterfest,
    emoji: "✨",
    blurb: "Free city event: tree lighting one night, light parade the next.",
    ages: ["toddler", "kids", "tweens"],
    price: "free",
    hoods: ["henderson"],
    facts: [
      { label: "Dates", value: "Dec 3–4, 2026 (City of Henderson)" },
      { label: "Last year", value: "Night one: tree lighting and drone show, 5–7:30 p.m. Night two: electric light parade, 6:30–8:30 p.m." },
      { label: "Price", value: "Free" },
    ],
  },
  {
    id: "downtown-summerlin",
    name: "Downtown Summerlin holiday season",
    url: HOLIDAY_URLS.downtownSummerlin,
    emoji: "⛸️",
    blurb: "Free weekend parade with snowfall, plus paid skating, Santa photos, and a mini train.",
    ages: ["toddler", "kids", "tweens"],
    price: "free",
    hoods: ["west"],
    facts: [
      { label: "2026", value: "Schedule not posted yet; check before you go" },
      { label: "Last season", value: "Parade Fri–Sat 6 p.m., Nov 21–Dec 20, free" },
      { label: "Extras", value: "Rock Rink skate rentals from $18; Santa photo packages from $39.99; train rides $5" },
      { label: "Tip", value: "Last year's Santa Chalet had a sensory-friendly morning; watch for it again" },
    ],
  },
  {
    id: "springs-preserve",
    name: "Springs Preserve",
    url: HOLIDAY_URLS.springsPreserve,
    emoji: "🦋",
    blurb: "Daytime nature break between light shows. Toddler Time and weekend kid classes are included with admission.",
    ages: ["toddler", "kids"],
    price: "paid",
    hoods: ["central"],
    facts: [
      { label: "Toddler Time", value: "Ages 5 and under, Mon, Thu and Fri, 11 a.m.–noon" },
      { label: "Butterfly Habitat", value: "Open through Nov 23" },
      { label: "Price", value: "Nevada residents $9.95 adults, $4.95 ages 3–17, 2 and under free" },
      { label: "Closed", value: "Thanksgiving Day and Christmas Day" },
    ],
  },
  {
    id: "turkey-trot",
    name: "Las Vegas Turkey Trot (Boulder City)",
    url: HOLIDAY_URLS.turkeyTrot,
    emoji: "🦃",
    blurb: "Thanksgiving morning on the Historic Railroad Trail. The 1-mile stroll is the family distance.",
    ages: ["kids", "tweens"],
    price: "paid",
    hoods: ["henderson"],
    facts: [
      { label: "When", value: "Thu, Nov 26, 2026; 5K and 1 mile start 8:15 a.m." },
      { label: "Price", value: "1-mile stroll $50, 5K $65 at the current tier (confirm on the race site)" },
      { label: "Where", value: "Historic Railroad Trail lot, Lakeshore Rd, Boulder City" },
    ],
  },
  {
    id: "discovery-noon",
    name: "Noon Year's Eve at DISCOVERY Children's Museum",
    url: HOLIDAY_URLS.discoveryKids,
    emoji: "🎈",
    blurb: "New Year's countdown at noon, so everyone is home for nap. Balloon drop, DJ, crafts.",
    ages: ["toddler", "kids"],
    price: "paid",
    hoods: ["downtown"],
    featured: true,
    facts: [
      { label: "When", value: "Held Dec 31 last year, countdown to a noon balloon drop; 2026 not posted yet, check before you go" },
      { label: "Hours", value: "Tue–Sat 10 a.m.–5 p.m., Sun noon–5 p.m.; also open Mondays over winter break" },
      { label: "Closed", value: "Thanksgiving, Christmas Eve, Christmas, New Year's Day" },
    ],
  },
];

export const HOLIDAY_BOARD_ITEMS: GuideBoardItem[] = [
  { id: "kc-sunrise", label: "Sunrise Library Kids Cafe", url: GUIDE_URLS.sunriseLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["downtown"] },
  { id: "kc-whitney", label: "Whitney Library Kids Cafe", url: GUIDE_URLS.whitneyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["henderson"] },
  { id: "kc-enterprise", label: "Enterprise Library Kids Cafe", url: GUIDE_URLS.enterpriseLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-rainbow", label: "Rainbow Library Kids Cafe", url: GUIDE_URLS.rainbowLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-clark", label: "Clark County Library Kids Cafe", url: GUIDE_URLS.clarkCountyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["downtown"] },
  { id: "kc-spring-valley", label: "Spring Valley Library Kids Cafe", url: GUIDE_URLS.springValleyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-alexander", label: "Alexander Library Kids Cafe", url: GUIDE_URLS.alexanderLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["north"] },
  { id: "kc-aliante", label: "Aliante Library Kids Cafe", url: GUIDE_URLS.alianteLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["north"] },
  { id: "game-day", label: "Friday Game Day: Clark County Library", url: GUIDE_URLS.fridayGameDay, ages: ["tweens"], price: "free", hoods: ["downtown"] },
  { id: "teen-rainbow", label: "Teen Hangout / Teen Fridays: Rainbow Library", url: GUIDE_URLS.teenHangout, ages: ["tweens"], price: "free", hoods: ["west"] },
  { id: "teen-alexander", label: "Teen Hangout / Teen Fridays: Alexander Library", url: GUIDE_URLS.teenHangout, ages: ["tweens"], price: "free", hoods: ["north"] },
  { id: "pajama-rainbow", label: "Family Pajama Storytime: Rainbow Library", url: GUIDE_URLS.pajamaStorytime, ages: ["toddler", "kids"], price: "free", hoods: ["west"] },
  { id: "stem-alexander", label: "Create & Explore STEM: Alexander Library", url: GUIDE_URLS.vkStem, ages: ["kids"], price: "free", hoods: ["north"] },
  { id: "stem-aliante", label: "Create & Explore STEM: Aliante Library", url: GUIDE_URLS.vkStem, ages: ["kids"], price: "free", hoods: ["north"] },
];

export const HOLIDAY_NEIGHBORHOODS: GuideNeighborhood[] = [
  {
    id: "north",
    title: "North Las Vegas / Aliante / Craig Ranch",
    emoji: "🌵",
    venueIds: ["glittering-lights"],
    extraBullets: [
      { label: "Alexander Library", url: GUIDE_URLS.alexanderLibrary },
      { label: "Aliante Library", url: GUIDE_URLS.alianteLibrary },
    ],
  },
  {
    id: "west",
    title: "West / Summerlin / Centennial",
    emoji: "⛰️",
    venueIds: ["downtown-summerlin"],
    extraBullets: [
      { label: "Centennial Hills Library programs", url: GUIDE_URLS.centennialHillsLibrary },
      { label: "Rainbow Library pajama storytime", url: GUIDE_URLS.pajamaStorytime },
    ],
  },
  {
    id: "central",
    title: "Central / Oakey / Springs",
    emoji: "🌿",
    venueIds: ["magical-forest", "springs-preserve"],
    extraBullets: [],
  },
  {
    id: "henderson",
    title: "Henderson / Southeast",
    emoji: "🏡",
    venueIds: ["ethel-m", "winterfest", "turkey-trot"],
    extraBullets: [
      { label: "Whitney Library meal and game programs", url: GUIDE_URLS.whitneyLibrary },
    ],
  },
  {
    id: "downtown",
    title: "Downtown / Arts District",
    emoji: "🎭",
    venueIds: ["discovery-noon"],
    extraBullets: [
      { label: "Sunrise Library Kids Cafe", url: GUIDE_URLS.sunriseLibrary },
      { label: "Clark County Library Friday games", url: GUIDE_URLS.fridayGameDay },
    ],
  },
];

/** Same ids and labels as the fall guide's AGE_BANDS (the filter chips use those); holiday copy. */
export const HOLIDAY_AGE_BANDS: { id: GuideAge; label: string; emoji: string; intro: string; tips: string }[] = [
  {
    id: "toddler",
    label: "Babies & toddlers",
    emoji: "👶",
    intro:
      "Lights you can see from a car seat or a stroller, daytime events, and anything that lets you leave in five minutes.",
    tips:
      "Long Santa lines at peak hours, late-night parades, and New Year's at midnight. Noon is a perfectly good midnight.",
  },
  {
    id: "kids",
    label: "Kids (~4–10)",
    emoji: "🎨",
    intro: "Peak age for light walks, mini trains, Santa, and staying up a little late on purpose.",
    tips: "",
  },
  {
    id: "tweens",
    label: "Tweens (~11–14)",
    emoji: "🛹",
    intro: "Give them a job: navigator for the drive-through, photographer at the lights, judge of the parade.",
    tips: "",
  },
];

export const HOLIDAY_CHECKLIST = [
  { emoji: "🧥", text: "Real jackets. Desert nights in December get cold fast" },
  { emoji: "🚻", text: "A bathroom stop before any drive-through line" },
  { emoji: "💵", text: "Cash for the cheaper gate price at Glittering Lights" },
  { emoji: "🍪", text: "Car snacks that do not melt or crumble into the seat" },
  { emoji: "🛒", text: "Stroller or wagon for the walking light shows" },
  { emoji: "🔋", text: "Portable charger (light photos drain phones)" },
];

export const HOLIDAY_PLAN = [
  {
    emoji: "🦃",
    title: "Thanksgiving week",
    text: "Turkey Trot stroll in the morning or a quiet museum day. Many places close on Thanksgiving itself.",
  },
  {
    emoji: "🌙",
    title: "Weeknight, low effort",
    text: "Ethel M cactus garden: $3, close parking, home by bedtime.",
  },
  {
    emoji: "🎄",
    title: "One big night",
    text: "Pick one: Magical Forest or Glittering Lights. Book a weeknight if you can; weekends near Christmas are packed.",
  },
  {
    emoji: "🎈",
    title: "Winter break and New Year's",
    text: "Library programs and Springs Preserve by day. Noon Year's Eve for little kids, then early bedtime for everyone.",
  },
];

export function holidayVenueById(id: string): GuideVenue | undefined {
  return HOLIDAY_VENUES.find((v) => v.id === id);
}
