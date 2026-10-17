// Event illustration types. One template image per type is stored on R2 at
// img.vegaskiddos.com/type/<id>/<width>.webp and reused across events, so a
// Kids Cafe never inherits video-game art just because the blurb mentioned teens.

export const ART_TEMPLATES_VERSION = "1";

export type ArtTypeId =
  | "yoga"
  | "food"
  | "market"
  | "ice-cream"
  | "storytime"
  | "swim"
  | "art"
  | "stem"
  | "dino"
  | "animals"
  | "music"
  | "dance"
  | "theater"
  | "gaming"
  | "scavenger"
  | "boardgame"
  | "baby"
  | "nature"
  | "festival"
  | "celebration"
  | "halloween"
  | "harvest"
  | "holiday"
  | "muertos"
  | "run"
  | "renaissance";

export type ArtType = {
  id: ArtTypeId;
  subject: string;
  emoji: string;
  gradient: string;
};

export const ART_TYPES: Record<ArtTypeId, ArtType> = {
  yoga: {
    id: "yoga",
    subject: "a parent and a small child on yoga mats stretching toward a calm smiling sun, with a water bottle and a tiny plant",
    emoji: "🧘",
    gradient: "from-teal to-sunny",
  },
  food: {
    id: "food",
    subject: "cookies, cupcakes, a sandwich on a lunch tray, and a carton of milk",
    emoji: "🍪",
    gradient: "from-sunny to-coral",
  },
  market: {
    id: "market",
    subject: "a farmers market with fruit and veggie stands",
    emoji: "🧺",
    gradient: "from-sunny to-teal",
  },
  "ice-cream": {
    id: "ice-cream",
    subject: "colorful ice cream cones, scoops, and a sundae topped with sprinkles and a cherry",
    emoji: "🍦",
    gradient: "from-coral to-sunny",
  },
  storytime: {
    id: "storytime",
    subject: "an open storybook with friendly characters drifting out",
    emoji: "📚",
    gradient: "from-teal to-grape",
  },
  swim: {
    id: "swim",
    subject: "a cheerful splashing pool scene",
    emoji: "🏊",
    gradient: "from-teal to-grape",
  },
  art: {
    id: "art",
    subject: "paint pots, brushes and craft supplies",
    emoji: "🎨",
    gradient: "from-coral to-sunny",
  },
  stem: {
    id: "stem",
    subject: "playful little robots and bubbling science beakers",
    emoji: "🔬",
    gradient: "from-teal to-sunny",
  },
  dino: {
    id: "dino",
    subject: "a cute friendly cartoon dinosaur",
    emoji: "🦕",
    gradient: "from-teal to-grape",
  },
  animals: {
    id: "animals",
    subject: "friendly cartoon animals",
    emoji: "🦁",
    gradient: "from-sunny to-coral",
  },
  music: {
    id: "music",
    subject: "colorful musical instruments and floating music notes",
    emoji: "🎵",
    gradient: "from-grape to-coral",
  },
  dance: {
    id: "dance",
    subject: "joyful dancing figures and ribbons",
    emoji: "💃",
    gradient: "from-coral to-grape",
  },
  theater: {
    id: "theater",
    subject: "a little puppet-theater stage with curtains",
    emoji: "🎭",
    gradient: "from-grape to-coral",
  },
  gaming: {
    id: "gaming",
    subject: "game controllers and playful arcade shapes",
    emoji: "🎮",
    gradient: "from-grape to-teal",
  },
  scavenger: {
    id: "scavenger",
    subject: "a treasure map and a magnifying glass",
    emoji: "🔍",
    gradient: "from-teal to-sunny",
  },
  boardgame: {
    id: "boardgame",
    subject: "oversized board-game pieces and puzzle shapes",
    emoji: "♟️",
    gradient: "from-grape to-teal",
  },
  baby: {
    id: "baby",
    subject: "soft toys and stacking blocks for little ones",
    emoji: "🧸",
    gradient: "from-sunny to-coral",
  },
  nature: {
    id: "nature",
    subject: "a sunny garden with plants and butterflies",
    emoji: "🌳",
    gradient: "from-teal to-sunny",
  },
  festival: {
    id: "festival",
    subject: "a festive carnival scene with balloons and bunting",
    emoji: "🎉",
    gradient: "from-coral to-sunny",
  },
  celebration: {
    id: "celebration",
    subject: "balloons, confetti and a cheerful celebration",
    emoji: "🎈",
    gradient: "from-coral to-sunny",
  },
  // Seasonal/theme templates added 2026-10 (art sweep). Generated in the same
  // round-scene-on-cream style with the existing art as reference.
  halloween: {
    id: "halloween",
    subject: "friendly jack-o'-lanterns, a cute ghost, a candy bucket, bats and kids in costumes",
    emoji: "🎃",
    gradient: "from-coral to-grape",
  },
  harvest: {
    id: "harvest",
    subject: "a pumpkin patch with hay bales, apples, a friendly scarecrow and kids with a wagon",
    emoji: "🍂",
    gradient: "from-sunny to-coral",
  },
  holiday: {
    id: "holiday",
    subject: "a winter holiday scene with string lights, a decorated tree, gifts and kids with cocoa",
    emoji: "✨",
    gradient: "from-teal to-coral",
  },
  muertos: {
    id: "muertos",
    subject: "a kid-friendly Día de los Muertos table with papel picado, marigolds and a sugar-skull",
    emoji: "🌼",
    gradient: "from-coral to-sunny",
  },
  run: {
    id: "run",
    subject: "a family fun run with kids crossing a finish ribbon, medals and balloons",
    emoji: "🏃",
    gradient: "from-teal to-sunny",
  },
  renaissance: {
    id: "renaissance",
    subject: "a Renaissance-fair scene with a striped tent, a kid knight, a princess and a little dragon",
    emoji: "🏰",
    gradient: "from-grape to-sunny",
  },
};

export const ART_TYPE_IDS = Object.keys(ART_TYPES) as ArtTypeId[];

// Seasonal / theme rules. A 5K or walk is a run whatever the costume; a Day
// of the Dead or Halloween event gets its own art even when it's also a
// storytime, craft or concert (that's what the card should signal).
const RUN = /\b\d+k\b|fun run|glow run|color run|marathon|walk-?a-?thon|\bwalk\s+(for|to|against)\b|(?<!(art|story|nature|history|museum|night|ghost|boo)\s)\bwalk\s*$/;
const MUERTOS = /muert|day of the dead|ofrenda|calavera/;
const HALLOWEEN = /hallo|hollyween|-o-?ween|spook|trick.or.treat|trunk.or.treat|\bboo(\b|-|gie|levard)|haunt|zombie|monster mash|\bghosts?\b|creepy|mischief/;
const HARVEST = /pumpkin|harvest|hay\s*ride|corn maze|orchard|\bfall fest|autumn|apple picking|thanksgiving|turkey/;
const HOLIDAY = /christmas|holiday|santa|winter wonder|(holiday|christmas|festive|winter|magical)\s+lights|light (show|display)|festival of lights|hanukkah|menorah|kwanzaa|gingerbread|tree lighting|nutcracker|winter fest/;
const RENAISSANCE = /renaissance|medieval|chivalry|\bknights?\b|castle|jousting|\bfaire\b/;

// Title is matched first (specific activity beats a word in the blurb).
const TITLE_RULES: [RegExp, ArtTypeId][] = [
  [RUN, "run"],
  [MUERTOS, "muertos"],
  [HALLOWEEN, "halloween"],
  [RENAISSANCE, "renaissance"],
  [HOLIDAY, "holiday"],
  // Book festivals / clubs are reading events, not carnivals.
  [/\bbook\s*(club|fest|fair)|bookapalooza|\bbooks?\b.*\bfestival\b|library after.?hours/, "storytime"],
  // Tabletop RPGs are board games, not video games or dragons.
  [/dungeons|tabletop|\brpg\b/, "boardgame"],
  [/\bsteam\b|3d print|scientist|\bslime\b/, "stem"],
  [/potion bottles|sand art|jewelry|charms/, "art"],
  [/\b(crafts?|gift)\b[^.]{0,20}\b(market|bazaar)\b/, "market"],
  [/\bbig play\b|stage show|live show/, "theater"],
  [/\bpets?\b|\bdogs?\b|pupp(y|ies)|kittens?/, "animals"],
  [HARVEST, "harvest"],
  [/\byoga\b/, "yoga"],
  [/kids?\s*cafe|\bcafe\b/, "food"],
  [/farmer['’]?s?\s*market/, "market"],
  [/ice\s*cream|gelato|\bsundae\b|snow\s*cone|popsicle|frozen yogurt|\bfroyo\b/, "ice-cream"],
  [/story\s*time|storytime|story\s*walk/, "storytime"],
  [/swim|splash|\bpool\b|water play|splash\s*pads?/, "swim"],
  [/\bart\b|paint|crafts?|\bdraw\b/, "art"],
  [/science|\bstem\b|lego|robot|coding|maker|experiment/, "stem"],
  [/dino|jurassic|fossil/, "dino"],
  [/animal|\bzoo\b|reptile|petting|touch tank|aquarium|shark|\bbugs?\b/, "animals"],
  [/\bmusic\b|concert|sing-along|\bband\b|drum|ukulele|filharmonic/, "music"],
  [/dance|ballet|zumbini|ballroom/, "dance"],
  [/puppet|theat|magic|circus|\bstage\b|drama|\bmusicals?\b/, "theater"],
  [/video\s*games?|game\s*day|gaming|esports?|\banime\b/, "gaming"],
  [/board\s*games?/, "boardgame"],
  [/scavenger|\bhunt\b/, "scavenger"],
  [/\bchess\b|\bpuzzle\b/, "boardgame"],
  [/lapsit|toddler\s*time|baby\s*time|mommy\s*and\s*me|infant/, "baby"],
  [/farmer['’]?s?\s*market|\bvendors?\b/, "market"],
  [/\bmarkets?\b/, "market"],
  [/nature|garden|hike|trail|butterfly|preserve|\bfarm\b/, "nature"],
  [/festival|parade|\bfair\b|carnival|fiesta/, "festival"],
  [/cook|baking|\bfood\b|\beat\b|snack|\bmeals?\b|lunch|dinner|breakfast/, "food"],
];

// Description is a fallback. Tightened so "teens", "ready", "outdoor", and
// "games" in a kids-program blurb don't steal the type.
const DESC_RULES: [RegExp, ArtTypeId][] = [
  [/\byoga\b/, "yoga"],
  [/kids?\s*cafe|\bcafe\b|three square|\bmeals?\b/, "food"],
  [/farmer['’]?s?\s*market/, "market"],
  [/ice\s*cream|gelato|\bsundae\b|snow\s*cone|popsicle|frozen yogurt|\bfroyo\b/, "ice-cream"],
  [/story\s*time|storytime|story\s*walk|\bread\b\s+books?/, "storytime"],
  [/swim|splash|\bpool\b|water play|splash\s*pads?/, "swim"],
  [/\bart\b|paint|crafts?|\bdraw\b/, "art"],
  [/science|\bstem\b|lego|robot|coding|maker|experiment/, "stem"],
  [/dino|jurassic|fossil/, "dino"],
  [/animal|\bzoo\b|reptile|petting|touch tank|aquarium|shark|\bbugs?\b/, "animals"],
  [/\bmusic\b|concert|sing-along|\bband\b|drum|ukulele|filharmonic/, "music"],
  [/dance|ballet|zumbini|ballroom/, "dance"],
  [/puppet|theat|magic|circus|\bstage\b|drama|\bmusicals?\b/, "theater"],
  [/video\s*games?|game\s*day|gaming|esports?|\banime\b/, "gaming"],
  [/board\s*games?/, "boardgame"],
  [/scavenger|\bhunt\b/, "scavenger"],
  [/\bchess\b|\bpuzzle\b/, "boardgame"],
  [/cook|baking|\bfood\b|snack/, "food"],
  [/\bmarkets?\b/, "market"],
  [/lapsit|toddler\s*time|infant/, "baby"],
  [/nature|garden|hike|trail|butterfly|preserve/, "nature"],
  [MUERTOS, "muertos"],
  [HALLOWEEN, "halloween"],
  [HARVEST, "harvest"],
  [/festival|parade|\bfair\b|carnival|fiesta/, "festival"],
];

function firstMatch(text: string, rules: [RegExp, ArtTypeId][]): ArtTypeId | null {
  for (const [re, id] of rules) if (re.test(text)) return id;
  return null;
}

export function artTypeFor(title: string, description = ""): ArtType {
  const id =
    firstMatch(title.toLowerCase(), TITLE_RULES) ||
    firstMatch(description.toLowerCase(), DESC_RULES) ||
    "celebration";
  return ART_TYPES[id];
}

export function subjectFor(title: string, description = ""): string {
  return artTypeFor(title, description).subject;
}

export function artTemplateSrc(typeId: ArtTypeId): string {
  return `/type/${typeId}/1024.webp?v=${ART_TEMPLATES_VERSION}`;
}

// Hand-picked per-event art, e.g. a fresh GPT illustration made for a
// community submission. The file lives in the event's Airtable ArtImage and is
// pushed to R2 by tools/sync-images.mjs (img.vegaskiddos.com/event/<id>/<w>.webp).
// The value is the ArtImage attachment id, used as the ?v= cache-bust key, so a
// regenerated file gets a fresh URL. Every other event uses its type template.
export const EVENT_ART_OVERRIDES: Record<string, string> = {
  recuRIY1VF7NOn8ig: "att3U30ddqqcMUmaE", // Mommy, Me & Tea (Thelu Tea Room), community submission
};

/** Path (relative to the image CDN) of an event's card art. */
export function eventArtSrc(eventId: string, typeId: ArtTypeId): string {
  const v = EVENT_ART_OVERRIDES[eventId];
  return v ? `/event/${eventId}/1024.webp?v=${v}` : artTemplateSrc(typeId);
}
