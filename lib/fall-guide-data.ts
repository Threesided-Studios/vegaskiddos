// Fall/Halloween 2026 guide — venue data, filter tags, and verified URLs.

export type GuideAge = "toddler" | "kids" | "tweens";
export type GuidePrice = "free" | "paid";
export type GuideHood =
  | "north"
  | "west"
  | "central"
  | "henderson"
  | "downtown";

export type GuideFilters = {
  age: GuideAge | "all";
  price: GuidePrice | "all";
  hood: GuideHood | "all";
};

export const DEFAULT_FILTERS: GuideFilters = {
  age: "all",
  price: "all",
  hood: "all",
};

/** Verified external + VK URLs (checked 2026-09-18). */
export const GUIDE_URLS = {
  halloveen: "https://halloveen.org",
  viva: "https://vivatacofest.com/pumpkin-patch/",
  hauntedHarvest: "https://www.springspreserve.org/events/?id=2169",
  trickOrTreatFest: "https://trickortreatfestlv.com",
  discoveryKids: "https://www.discoverykidslv.org",
  vkHome: "https://vegaskiddos.com",
  vkStorytime: "https://vegaskiddos.com/storytime",
  vkStem: "https://vegaskiddos.com/stem",
  sunriseLibrary: "https://vegaskiddos.com/venue/sunrise-library",
  whitneyLibrary: "https://vegaskiddos.com/venue/whitney-library",
  enterpriseLibrary: "https://vegaskiddos.com/venue/enterprise-library",
  rainbowLibrary: "https://vegaskiddos.com/venue/rainbow-library",
  clarkCountyLibrary: "https://vegaskiddos.com/venue/clark-county-library",
  springValleyLibrary: "https://vegaskiddos.com/venue/spring-valley-library",
  alexanderLibrary: "https://vegaskiddos.com/venue/alexander-library",
  alianteLibrary: "https://vegaskiddos.com/venue/aliante-library",
  whitneyRec: "https://vegaskiddos.com/venue/whitney-recreation-center",
  gibsonLibrary: "https://vegaskiddos.com/venue/james-i-gibson-library",
  paseoVerdeLibrary: "https://vegaskiddos.com/venue/paseo-verde-library",
  greenValleyLibrary: "https://vegaskiddos.com/venue/green-valley-library",
  centennialHillsLibrary: "https://vegaskiddos.com/venue/centennial-hills-library",
  fridayGameDay: "https://vegaskiddos.com/?q=Friday+Game+Day",
  teenHangout: "https://vegaskiddos.com/?q=Teen+Hangout",
  kidsCafe: "https://vegaskiddos.com/?q=Kids+Cafe",
  pajamaStorytime: "https://vegaskiddos.com/?q=Pajama+Storytime",
  feelGoodFriday: "https://vegaskiddos.com/?q=Feel+Good+Friday",
  summerlinTrunkTreat: "https://vegaskiddos.com/?q=trunk+or+treat",
} as const;

export type GuideFact = { label: string; value: string };

export type GuideVenue = {
  id: string;
  name: string;
  url: string;
  emoji: string;
  blurb?: string;
  ages: GuideAge[];
  price: GuidePrice;
  hoods: GuideHood[];
  facts: GuideFact[];
  featured?: boolean;
};

export type GuideBoardItem = {
  id: string;
  label: string;
  url: string;
  ages: GuideAge[];
  price: GuidePrice;
  hoods: GuideHood[];
};

export type GuideNeighborhood = {
  id: GuideHood;
  title: string;
  emoji: string;
  venueIds: string[];
  extraBullets: { label: string; url: string }[];
};

export const FLAGSHIP_VENUES: GuideVenue[] = [
  {
    id: "halloveen",
    name: "HallOVeen at the Magical Forest (Opportunity Village)",
    url: GUIDE_URLS.halloveen,
    emoji: "🎃",
    blurb: "Family Halloween park energy.",
    ages: ["kids", "tweens"],
    price: "paid",
    hoods: ["central"],
    featured: true,
    facts: [
      { label: "Dates", value: "Oct 2–4 and Oct 9–31, 2026" },
      { label: "Hours", value: "5:30–9 p.m. Sun–Thu; 5:30–9:30 p.m. Fri–Sat (OV press, Aug 2026)" },
      { label: "Price", value: "$24; children 3 and under free" },
      { label: "Tickets", value: "Date-specific at HallOVeen.org" },
      { label: "Address", value: "6300 W Oakey Blvd" },
    ],
  },
  {
    id: "viva-patch",
    name: "VIVA Pumpkin Patch at Craig Ranch Regional Park",
    url: GUIDE_URLS.viva,
    emoji: "🎟️",
    blurb: "Free RSVP entry; rides, food, and vendors cost extra.",
    ages: ["toddler", "kids"],
    price: "free",
    hoods: ["north"],
    featured: true,
    facts: [
      { label: "Dates", value: "Oct 9–30, 2026 (official page)" },
      { label: "Entry", value: "Free $0 RSVP, 1 registration per group (TicketSpice)" },
      { label: "Includes", value: "Pumpkins, photo stations, hay maze, bounce houses, kids activities" },
      { label: "Not free", value: "Carnival rides, food, vendors on site" },
      { label: "Hours", value: "Wed–Fri 5–9 p.m.; Sat–Sun noon–9 p.m. (third-party listing; confirm week-of)" },
      { label: "Address", value: "628 W Craig Road, North Las Vegas" },
    ],
  },
  {
    id: "viva-trunk",
    name: "VIVA Trunk or Treat",
    url: GUIDE_URLS.viva,
    emoji: "🚗",
    blurb: "Free registration trunk-or-treat at Craig Ranch.",
    ages: ["toddler", "kids"],
    price: "free",
    hoods: ["north"],
    facts: [
      { label: "When", value: "Oct 30, 2 p.m., free registration" },
      { label: "Where", value: "Craig Ranch Regional Park, North Las Vegas" },
    ],
  },
  {
    id: "haunted-harvest",
    name: "Haunted Harvest at Springs Preserve",
    url: GUIDE_URLS.hauntedHarvest,
    emoji: "🏛️",
    blurb: "Trick-or-treat stations, crafts, food trucks; outdoor.",
    ages: ["kids", "tweens"],
    price: "paid",
    hoods: ["central"],
    featured: true,
    facts: [
      { label: "Dates", value: "Oct 22–25, 2026, 6–8:30 p.m.; members early entry 4 p.m." },
      {
        label: "Price",
        value:
          "Non-members $14 ages 3+; Value members $8; Gold/Platinum Donor free up to 8 guests; ages 2 and under free",
      },
      { label: "Tickets", value: "Advance online only, date/time specific; expected to sell out" },
      { label: "Address", value: "Springs Preserve (near Meadows; overflow parking called out by venue)" },
    ],
  },
  {
    id: "trick-or-treat-fest",
    name: "Trick or Treat Fest LV at Clark County Museum",
    url: GUIDE_URLS.trickOrTreatFest,
    emoji: "🍬",
    blurb: "Historic homes, vendors, all-ages trick-or-treat; festive not scary.",
    ages: ["kids", "tweens"],
    price: "paid",
    hoods: ["henderson"],
    featured: true,
    facts: [
      { label: "Dates", value: "Oct 16–17, 2026 (fest site)" },
      { label: "Tickets", value: "TBA on trickortreatfestlv.com; county listing ~$15, confirm on fest site" },
      { label: "Tip", value: "Earlier entry is better for little kids" },
      { label: "Address", value: "1830 S Boulder Highway, Henderson" },
    ],
  },
  {
    id: "discovery-kids",
    name: "Discovery Children's Museum",
    url: GUIDE_URLS.discoveryKids,
    emoji: "🔬",
    blurb: "Touch-tank style programs for a cool indoor hour. Check fall hours on the venue site before you go.",
    ages: ["toddler", "kids", "tweens"],
    price: "paid",
    hoods: ["downtown"],
    facts: [],
  },
];

export const BOARD_ITEMS: GuideBoardItem[] = [
  { id: "kc-sunrise", label: "Sunrise Library Kids Cafe", url: GUIDE_URLS.sunriseLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["downtown"] },
  { id: "kc-whitney", label: "Whitney Library Kids Cafe", url: GUIDE_URLS.whitneyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["henderson"] },
  { id: "kc-enterprise", label: "Enterprise Library Kids Cafe", url: GUIDE_URLS.enterpriseLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-rainbow", label: "Rainbow Library Kids Cafe", url: GUIDE_URLS.rainbowLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-clark", label: "Clark County Library Kids Cafe", url: GUIDE_URLS.clarkCountyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["downtown"] },
  { id: "kc-spring-valley", label: "Spring Valley Library Kids Cafe", url: GUIDE_URLS.springValleyLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["west"] },
  { id: "kc-alexander", label: "Alexander Library Kids Cafe", url: GUIDE_URLS.alexanderLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["north"] },
  { id: "kc-aliante", label: "Aliante Library Kids Cafe", url: GUIDE_URLS.alianteLibrary, ages: ["toddler", "kids", "tweens"], price: "free", hoods: ["north"] },
  { id: "game-day", label: "Friday Game Day — Clark County Library", url: GUIDE_URLS.fridayGameDay, ages: ["tweens"], price: "free", hoods: ["downtown"] },
  { id: "teen-rainbow", label: "Teen Hangout / Teen Fridays — Rainbow Library", url: GUIDE_URLS.teenHangout, ages: ["tweens"], price: "free", hoods: ["west"] },
  { id: "teen-alexander", label: "Teen Hangout / Teen Fridays — Alexander Library", url: GUIDE_URLS.teenHangout, ages: ["tweens"], price: "free", hoods: ["north"] },
  { id: "feel-good", label: "Feel Good Friday — Whitney Rec", url: GUIDE_URLS.feelGoodFriday, ages: ["kids", "tweens"], price: "free", hoods: ["henderson"] },
  { id: "pajama-rainbow", label: "Family Pajama Storytime — Rainbow Library", url: GUIDE_URLS.pajamaStorytime, ages: ["toddler", "kids"], price: "free", hoods: ["west"] },
  { id: "stem-alexander", label: "Create & Explore STEM — Alexander Library", url: GUIDE_URLS.vkStem, ages: ["kids"], price: "free", hoods: ["north"] },
  { id: "stem-aliante", label: "Create & Explore STEM — Aliante Library", url: GUIDE_URLS.vkStem, ages: ["kids"], price: "free", hoods: ["north"] },
  { id: "halloween-gibson", label: "Halloween Little Makers / Storytime — Gibson Library", url: GUIDE_URLS.vkStorytime, ages: ["toddler", "kids"], price: "free", hoods: ["henderson"] },
  { id: "halloween-paseo", label: "Halloween Little Makers / Storytime — Paseo Verde Library", url: GUIDE_URLS.vkStorytime, ages: ["toddler", "kids"], price: "free", hoods: ["henderson"] },
  { id: "halloween-green-valley", label: "Halloween Little Makers / Storytime — Green Valley Library", url: GUIDE_URLS.vkStorytime, ages: ["toddler", "kids"], price: "free", hoods: ["henderson"] },
];

export const NEIGHBORHOODS: GuideNeighborhood[] = [
  {
    id: "north",
    title: "North Las Vegas / Aliante / Craig Ranch",
    emoji: "🌵",
    venueIds: ["viva-patch", "viva-trunk"],
    extraBullets: [
      { label: "Alexander Library", url: GUIDE_URLS.alexanderLibrary },
      { label: "Aliante Library", url: GUIDE_URLS.alianteLibrary },
    ],
  },
  {
    id: "west",
    title: "West / Summerlin / Centennial",
    emoji: "⛰️",
    venueIds: [],
    extraBullets: [
      { label: "Centennial Hills Library programs", url: GUIDE_URLS.centennialHillsLibrary },
      { label: "Summerlin HOA and rec trunk-or-treats", url: GUIDE_URLS.summerlinTrunkTreat },
    ],
  },
  {
    id: "central",
    title: "Central / Oakey / Springs",
    emoji: "🌿",
    venueIds: ["halloveen", "haunted-harvest"],
    extraBullets: [],
  },
  {
    id: "henderson",
    title: "Henderson / Southeast",
    emoji: "🏡",
    venueIds: ["trick-or-treat-fest"],
    extraBullets: [
      { label: "Whitney Library meal and game programs", url: GUIDE_URLS.whitneyLibrary },
    ],
  },
  {
    id: "downtown",
    title: "Downtown / Arts District",
    emoji: "🎭",
    venueIds: ["discovery-kids"],
    extraBullets: [
      { label: "Sunrise Library Kids Cafe", url: GUIDE_URLS.sunriseLibrary },
      { label: "Clark County Library Friday games", url: GUIDE_URLS.fridayGameDay },
    ],
  },
];

export const AGE_BANDS: { id: GuideAge; label: string; emoji: string; intro: string; tips: string }[] = [
  {
    id: "toddler",
    label: "Babies & toddlers",
    emoji: "👶",
    intro:
      "Look for stroller-friendly paths, shade or indoor backup, and events that say children 3 and under are free.",
    tips:
      "Skip or shorten: long ticketed haunt mazes, loud trunk-or-treats at peak, anything with face-covering mascots if your kid is in a stranger-danger phase.",
  },
  {
    id: "kids",
    label: "Kids (~4–10)",
    emoji: "🎨",
    intro:
      "Sweet spot for patches, mild \"spooky\" decor, carnival rides, and trick-or-treat stations.",
    tips: "",
  },
  {
    id: "tweens",
    label: "Tweens (~11–14)",
    emoji: "🛹",
    intro: "They want friends, snacks, and not to feel like they are in a toddler maze.",
    tips: "",
  },
];

export const CHECKLIST = [
  { emoji: "✨", text: "Lighted shoes or a clip-on glow stick" },
  { emoji: "👟", text: "Closed-toe shoes (gravel patches are real)" },
  { emoji: "🧥", text: "A backup plain hoodie if the costume itches" },
  { emoji: "🔋", text: "Portable charger" },
  { emoji: "🎧", text: "Ear defenders for noise-sensitive kids" },
  { emoji: "🛒", text: "Stroller or wagon even if you think you are past it" },
];

export const OCTOBER_PLAN = [
  {
    emoji: "🌙",
    title: "Weeknight, low effort",
    text: "Library program + grocery-store candy. Home by bedtime.",
  },
  {
    emoji: "☀️",
    title: "Weekend daytime",
    text: "Pumpkin patch. Go early. Bring water. Take the photo before the toddler melts.",
  },
  {
    emoji: "🎃",
    title: "Weekend evening",
    text: "One ticketed event (HallOVeen or Haunted Harvest). Costumes that fit over a hoodie. Layers beat glitter.",
  },
  {
    emoji: "🍬",
    title: "Halloween night",
    text: "Neighborhood trick-or-treat if your street participates; otherwise a posted trunk-or-treat with lights and a bathroom.",
  },
];

export function matchesFilters(
  item: { ages: GuideAge[]; price: GuidePrice; hoods: GuideHood[] },
  filters: GuideFilters,
): boolean {
  if (filters.age !== "all" && !item.ages.includes(filters.age)) return false;
  if (filters.price !== "all" && item.price !== filters.price) return false;
  if (filters.hood !== "all" && !item.hoods.includes(filters.hood)) return false;
  return true;
}

export function venueById(id: string): GuideVenue | undefined {
  return FLAGSHIP_VENUES.find((v) => v.id === id);
}

export function parseFiltersFromSearch(params: URLSearchParams): GuideFilters {
  const age = params.get("age");
  const price = params.get("price");
  const hood = params.get("hood");
  return {
    age: age === "toddler" || age === "kids" || age === "tweens" ? age : "all",
    price: price === "free" || price === "paid" ? price : "all",
    hood:
      hood === "north" ||
      hood === "west" ||
      hood === "central" ||
      hood === "henderson" ||
      hood === "downtown"
        ? hood
        : "all",
  };
}

export function filtersToSearch(filters: GuideFilters): string {
  const p = new URLSearchParams();
  if (filters.age !== "all") p.set("age", filters.age);
  if (filters.price !== "all") p.set("price", filters.price);
  if (filters.hood !== "all") p.set("hood", filters.hood);
  const s = p.toString();
  return s ? `?${s}` : "";
}
