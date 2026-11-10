// Thanksgiving to New Year's 2026 guide: venue data, filter tags, and source URLs.
// Shares filter types, neighborhoods, and the client filter island with the fall guide.

import {
  GUIDE_URLS,
  type GuideAge,
  type GuideBoardItem,
  type GuideNeighborhood,
  type GuideVenue,
} from "./fall-guide-data";

/** External + VK URLs (rechecked 2026-11-09). */
export const HOLIDAY_URLS = {
  glitteringLights: "https://glitteringlightslasvegas.com/",
  glitteringLightsFactSheet: "https://glitteringlightslasvegas.com/fact-sheet/",
  magicalForest: "https://www.opportunityvillage.org/ovevents/magical-forest",
  ethelM: "https://www.ethelm.com/en-us/locations/henderson-flagship/cactus-garden/holiday-cactus-garden",
  winterfest: "https://www.cityofhenderson.com/residents/special-interest/winterfest/",
  downtownSummerlin: "https://summerlin.com/celebrate-the-holidays-at-downtown-summerlin/",
  springsPreserve: "https://www.springspreserve.org/events/",
  springsPreserveTickets: "https://www.springspreserve.org/visitor-information/tickets.html",
  springsPreserveVisit: "https://www.springspreserve.org/visitor-information/plan-your-visit.html",
  turkeyTrot: "https://bbscendurance.com/lasvegasturkeytrot/",
  discoveryKids: GUIDE_URLS.discoveryKids,
  discoveryHours: "https://discoverykidslv.org/hours-directions/",
  discoveryCalendar: "https://discoverykidslv.org/calendar/",
  elfWeekend: "https://discoverykidslv.org/event-calendar/elf-weekend-2026/",
  bellagio: "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html",
  nutcracker: "https://nevadaballet.org/performances/the-nutcracker/",
  vkHome: GUIDE_URLS.vkHome,
  vkStorytime: GUIDE_URLS.vkStorytime,
  vkHolidaySearch: "https://vegaskiddos.com/?q=holiday",
  vkSantaSearch: "https://vegaskiddos.com/?q=Santa",
} as const;

const HOLIDAY_IMG = "/guides/holiday-2026";

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
    image: {
      src: `${HOLIDAY_IMG}/glittering-lights.webp`,
      alt: "Illustrated family car driving through a tunnel of colorful holiday lights near a desert racetrack at dusk",
    },
    facts: [
      { label: "Dates", value: "Nov 6, 2026–Jan 3, 2027, nightly, holidays included (official fact sheet)" },
      { label: "Hours", value: "Sun–Thu 5–9 p.m.; Fri, Sat and holidays 5–10 p.m. (official fact sheet)" },
      { label: "Price", value: "Per car: $39 cash at the gate, $44 by card; Fast Pass $64; Santa Tram $25 a person on select nights. Season Pass $149 covers two vehicles and includes Fast Pass" },
      { label: "Where", value: "Las Vegas Motor Speedway, 7000 N. Las Vegas Blvd. Use I-15 exit 54 (Speedway Blvd); GPS can send you to a closed gate" },
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
    image: {
      src: `${HOLIDAY_IMG}/magical-forest.webp`,
      alt: "Illustrated night path through a glowing holiday forest with a small passenger train, a carousel, and a snowy slide",
    },
    facts: [
      { label: "Dates", value: "Nov 27–29, Dec 3–24 and Dec 26–Jan 1 (Opportunity Village)" },
      { label: "Hours", value: "5:30–9 p.m. Sun–Thu; 5:30–9:30 p.m. Fri–Sat" },
      { label: "Price", value: "Children 3 and under free. Date-specific tickets are on sale; confirm the current price on the Opportunity Village page when you buy" },
      { label: "Tickets", value: "Buy ahead so your night is not sold out. Box office closes 30 minutes before the park. Free parking in the College of Southern Nevada lot" },
      { label: "Address", value: "6300 W Oakey Blvd, Las Vegas, NV 89146" },
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
    image: {
      src: `${HOLIDAY_IMG}/ethel-m.webp`,
      alt: "Illustrated family walking a short desert path among cacti wrapped in colorful holiday lights",
    },
    facts: [
      { label: "Dates", value: "Nov 5, 2026–Jan 3, 2027, nightly; no reservations" },
      { label: "Hours", value: "5–10 p.m.; 5–8 p.m. Dec 24, Dec 31 and Jan 1; closed Dec 25" },
      { label: "Price", value: "$3 per person; under 2 and 65+ free" },
      { label: "Santa", value: "On site through Dec 23 (not after that date)" },
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
    image: {
      src: `${HOLIDAY_IMG}/winterfest.webp`,
      alt: "Illustrated city plaza with a glowing holiday tree, a light parade, and small colorful drones in the evening sky",
    },
    facts: [
      { label: "Dates", value: "Dec 3–4, 2026 (City of Henderson, via FOX5 Nov 6, 2026)" },
      { label: "Hours", value: "Thu Dec 3: tree lighting and drone show, 5–7:30 p.m. Fri Dec 4: Electric Light Parade, 6:30–8:30 p.m." },
      { label: "Price", value: "Free. No shuttle this year; parking is limited, so arrive early" },
      { label: "Where", value: "Water Street Plaza, 240 S. Water St., Henderson" },
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
    image: {
      src: `${HOLIDAY_IMG}/downtown-summerlin.webp`,
      alt: "Illustrated outdoor ice rink, a small holiday train, and gentle snowfall in a community plaza",
    },
    facts: [
      { label: "Parade", value: "Fri–Sat 6 p.m., Nov 20–Dec 19, 2026; no parade on Nov 27. Free (official 2026 announcement)" },
      { label: "Rock Rink", value: "Nov 13, 2026–Jan 18, 2027. Skate rentals $22, with special pricing on select dates" },
      { label: "Santa and train", value: "Santa Chalet daily Nov 13–Dec 24, photo packages from $39.99. Jupiter Express train $7 a person, beginning Nov 13" },
      { label: "Tip", value: "Sensory-friendly Santa photos: Sat Dec 5, 10 a.m.–noon. Hanukkah with Jewish Nevada: Sun Dec 6, 4–6 p.m." },
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
    image: {
      src: `${HOLIDAY_IMG}/springs-preserve.webp`,
      alt: "Illustrated daytime desert garden with a toddler gathering under a ramada, a playground, and a butterfly enclosure",
    },
    facts: [
      { label: "Hours", value: "Thu–Mon 9 a.m.–4 p.m.; last entry 3 p.m. Closed Tue and Wed, plus Thanksgiving Day and Christmas Day" },
      { label: "Toddler Time", value: "Ages 5 and under, Mon, Thu and Fri, 11 a.m.–noon, included with admission" },
      { label: "Butterfly Habitat", value: "Seasonal; open through Nov 23, 2026" },
      { label: "Price", value: "Nevada residents $9.95 adults, $4.95 ages 3–17, 2 and under free. Cashless venue" },
      { label: "Address", value: "333 S. Valley View Blvd, Las Vegas, NV 89107" },
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
    image: {
      src: `${HOLIDAY_IMG}/turkey-trot.webp`,
      alt: "Illustrated Thanksgiving morning walk on a desert railroad trail toward a historic tunnel, with a lake in the distance",
    },
    facts: [
      { label: "When", value: "Thu, Nov 26, 2026; 5K and 1 mile start 8:15 a.m." },
      { label: "Price", value: "1-mile stroll $50, 5K $65 at the current late-registration tier through race day (confirm on the race site)" },
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
      { label: "When", value: "Held Dec 31 last year, with a noon balloon drop. 2026 is not posted on the museum site yet; check the calendar before you go" },
      { label: "Also this season", value: "Elf Weekend is official: Nov 27–29, 10 a.m.–5 p.m." },
      { label: "Hours", value: "Tue–Sat 10 a.m.–5 p.m., Sun noon–5 p.m.; also open Mondays over winter break" },
      { label: "Closed", value: "Thanksgiving, Christmas Eve, Christmas, New Year's Day" },
      { label: "Address", value: "360 Promenade Place, Las Vegas, NV 89106" },
    ],
  },
  {
    id: "bellagio-conservatory",
    name: "Bellagio Conservatory holiday display",
    url: HOLIDAY_URLS.bellagio,
    emoji: "🌸",
    blurb: "Free indoor garden on the Strip, open around the clock. Easy to duck into between other plans; strollers are fine, and you can leave in a minute.",
    ages: ["toddler", "kids", "tweens"],
    price: "free",
    hoods: ["downtown"],
    featured: true,
    image: {
      src: `${HOLIDAY_IMG}/bellagio-conservatory.webp`,
      alt: "Illustrated glass-roofed conservatory with a glowing holiday tree and oversized flowers",
    },
    facts: [
      { label: "Dates", value: "Nov 14, 2026–Jan 2, 2027 (official Bellagio calendar). Closed Nov 8–13 for installation" },
      { label: "Hours", value: "Free, open around the clock" },
      { label: "Where", value: "Bellagio Conservatory, next to the hotel lobby on the Strip. This is on the Strip, not downtown" },
    ],
  },
  {
    id: "nutcracker",
    name: "Nevada Ballet Theatre's The Nutcracker",
    url: HOLIDAY_URLS.nutcracker,
    emoji: "🩰",
    blurb: "The valley's long-running Nutcracker at The Smith Center. Buy from the company or the box office, not a resale site.",
    ages: ["kids", "tweens"],
    price: "paid",
    hoods: ["downtown"],
    featured: true,
    image: {
      src: `${HOLIDAY_IMG}/nutcracker.webp`,
      alt: "Illustrated ballet on a snowy stage with a young dancer seen from behind and a toy nutcracker soldier",
    },
    facts: [
      { label: "Dates", value: "Dec 14–27, 2026, at Reynolds Hall, The Smith Center. Not every day; see the official calendar for showtimes" },
      { label: "Age", value: "No children under 3 are admitted" },
      { label: "Tickets", value: "Buy from Nevada Ballet Theatre or The Smith Center box office" },
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
    venueIds: ["discovery-noon", "nutcracker"],
    extraBullets: [
      { label: "Sunrise Library Kids Cafe", url: GUIDE_URLS.sunriseLibrary },
      { label: "Clark County Library Friday games", url: GUIDE_URLS.fridayGameDay },
      { label: "Bellagio Conservatory holiday display (on the Strip)", url: HOLIDAY_URLS.bellagio },
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
