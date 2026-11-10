// Spanish copy for /es/guides/holiday-guide-2026.
// Proper names stay in English. Dates, prices, and hours match the English guide.
// No em dashes or en dashes in this file.

import type {
  GuideAge,
  GuideBoardItem,
  GuideFact,
  GuideHood,
  GuideNeighborhood,
  GuideVenue,
} from "./fall-guide-data";
import { HOLIDAY_BOARD_ITEMS, HOLIDAY_NEIGHBORHOODS, HOLIDAY_VENUES } from "./holiday-guide-data";

export const HOLIDAY_ES_META = {
  title: "De Acción de Gracias a Año Nuevo con niños en Las Vegas",
  description:
    "Una guía sencilla para familias sobre la temporada de fiestas en el valle: luces, desfiles, Noon Year's Eve y las vacaciones de invierno, por edad, gratis o de pago, y vecindario.",
};

export const HOLIDAY_ES_BACK = "← Todos los eventos";

export const HOLIDAY_ES_FILTER = {
  aria: "Filtros de la guía",
  age: "Edad",
  allAges: "Todas las edades",
  ages: {
    toddler: "Bebés y niños pequeños",
    kids: "Niños (aprox. 4 a 10)",
    tweens: "Preadolescentes (aprox. 11 a 14)",
  } satisfies Record<GuideAge, string>,
  price: "Precio",
  all: "Todo",
  free: "🆓 Gratis o entrada gratis",
  paid: "💳 De pago",
  hood: "Vecindario",
  allValley: "Todo el valle",
  hoods: {
    north: "North Las Vegas",
    west: "Oeste",
    central: "Centro",
    henderson: "Henderson",
    downtown: "Downtown",
  } satisfies Record<GuideHood, string>,
  resetAll: "Quitar todos los filtros",
  empty: "Nada en esta combinación. Amplía un filtro.",
  reset: "Quitar filtros",
};

export const HOLIDAY_ES_MAP = {
  hint: "Toca una zona para filtrar por vecindario",
  mapLabel: "Mapa de vecindarios del valle de Las Vegas",
  zones: {
    north: "Norte",
    west: "Oeste",
    central: "Centro",
    henderson: "Henderson",
    downtown: "Downtown",
  } satisfies Record<GuideHood, string>,
  zoneAriaPrefix: "Vecindario ",
  zoneAriaSuffix: "",
  showAll: "Ver todos los vecindarios",
};

const VENUE_ES: Record<string, { name: string; blurb: string; alt?: string; facts: GuideFact[] }> = {
  "glittering-lights": {
    name: "Glittering Lights en Las Vegas Motor Speedway",
    blurb: "Luces en recorrido en carro. Se vale ir en pijama y con el asiento del bebé; nadie tiene que ponerse zapatos.",
    alt: "Ilustración de una familia en carro atravesando un túnel de luces de colores cerca de una pista en el desierto, al atardecer",
    facts: [
      { label: "Fechas", value: "Del 6 de noviembre de 2026 al 3 de enero de 2027, todas las noches, incluyendo los días festivos (hoja informativa oficial)" },
      { label: "Horario", value: "De domingo a jueves, de 5 a 9 p.m. Viernes, sábado y días festivos, de 5 a 10 p.m. (hoja informativa oficial)" },
      { label: "Precio", value: "Por carro: $39 en efectivo en la entrada, $44 con tarjeta. Fast Pass $64. Santa Tram $25 por persona en noches selectas. El Season Pass de $149 cubre dos vehículos e incluye Fast Pass" },
      { label: "Dónde", value: "Las Vegas Motor Speedway, 7000 N. Las Vegas Blvd. Usa la salida 54 de la I-15 (Speedway Blvd). El GPS puede llevarte a una puerta cerrada" },
    ],
  },
  "magical-forest": {
    name: "Magical Forest en Opportunity Village",
    blurb: "Camino de luces, juegos, minigolf, el tren Forest Express y la cabaña de Santa. El mismo campus que HallOVeen.",
    alt: "Ilustración de un sendero de noche en un bosque iluminado, con un tren de pasajeros, un carrusel y un resbaladero con nieve",
    facts: [
      { label: "Fechas", value: "Del 27 al 29 de noviembre, del 3 al 24 de diciembre y del 26 de diciembre al 1 de enero (Opportunity Village)" },
      { label: "Horario", value: "De 5:30 a 9 p.m. de domingo a jueves. De 5:30 a 9:30 p.m. viernes y sábado" },
      { label: "Precio", value: "Los menores de 3 años entran gratis. Hay boletos por fecha a la venta. Confirma el precio actual en la página de Opportunity Village al comprar" },
      { label: "Boletos", value: "Compra con anticipación para que no se agote tu noche. La taquilla cierra 30 minutos antes del parque. Estacionamiento gratis en el lote de College of Southern Nevada" },
      { label: "Dirección", value: "6300 W Oakey Blvd, Las Vegas, NV 89146" },
    ],
  },
  "ethel-m": {
    name: "Ethel M Holiday Cactus Garden",
    blurb: "Cactus envueltos en luces. Caminata corta, precio bajo y salida fácil.",
    alt: "Ilustración de una familia caminando un sendero corto en el desierto, entre cactus envueltos en luces de colores",
    facts: [
      { label: "Fechas", value: "Del 5 de noviembre de 2026 al 3 de enero de 2027, todas las noches. No necesitas reservación" },
      { label: "Horario", value: "De 5 a 10 p.m. De 5 a 8 p.m. el 24 de diciembre, el 31 de diciembre y el 1 de enero. Cerrado el 25 de diciembre" },
      { label: "Precio", value: "$3 por persona. Menores de 2 años y personas de 65 años o más entran gratis" },
      { label: "Santa", value: "Está hasta el 23 de diciembre (ya no después de esa fecha)" },
      { label: "Estacionamiento", value: "Los lotes de Ethel M o el de Smith's al otro lado de la calle. Los lotes de los negocios cercanos se llevan los carros" },
      { label: "Dirección", value: "2 Cactus Garden Drive, Henderson" },
    ],
  },
  winterfest: {
    name: "Henderson WinterFest, Water Street District",
    blurb: "Evento gratis de la ciudad: encendido del árbol una noche y desfile de luces la siguiente.",
    alt: "Ilustración de una plaza con un árbol navideño iluminado, un desfile de luces y drones de colores en el cielo de la tarde",
    facts: [
      { label: "Fechas", value: "3 y 4 de diciembre de 2026 (City of Henderson, vía FOX5 el 6 de noviembre de 2026)" },
      { label: "Horario", value: "Jueves 3 de diciembre: encendido del árbol y show de drones, de 5 a 7:30 p.m. Viernes 4 de diciembre: Electric Light Parade, de 6:30 a 8:30 p.m." },
      { label: "Precio", value: "Gratis. Este año no hay transporte de enlace. El estacionamiento es limitado, así que llega temprano" },
      { label: "Dónde", value: "Water Street Plaza, 240 S. Water St., Henderson" },
    ],
  },
  "downtown-summerlin": {
    name: "Temporada navideña de Downtown Summerlin",
    blurb: "Desfile gratis de fin de semana con nieve, más patinaje de pago, fotos con Santa y un minitren.",
    alt: "Ilustración de una pista de hielo al aire libre, un trenecito navideño y una nevada suave en una plaza",
    facts: [
      { label: "Desfile", value: "Viernes y sábado a las 6 p.m., del 20 de noviembre al 19 de diciembre de 2026. No hay desfile el 27 de noviembre. Gratis (anuncio oficial de 2026)" },
      { label: "Rock Rink", value: "Del 13 de noviembre de 2026 al 18 de enero de 2027. Renta de patines $22, con precios especiales en fechas selectas" },
      { label: "Santa y el tren", value: "Santa Chalet todos los días del 13 de noviembre al 24 de diciembre. Paquetes de fotos desde $39.99. Tren Jupiter Express, $7 por persona, desde el 13 de noviembre" },
      { label: "Consejo", value: "Fotos con Santa en un horario más tranquilo para los sentidos: sábado 5 de diciembre, de 10 a.m. a mediodía. Hanukkah con Jewish Nevada: domingo 6 de diciembre, de 4 a 6 p.m." },
    ],
  },
  "springs-preserve": {
    name: "Springs Preserve",
    blurb: "Un respiro de naturaleza de día, entre los shows de luces. Toddler Time y las clases de fin de semana para niños vienen incluidas en la entrada.",
    alt: "Ilustración de un jardín desértico de día, con un niño pequeño reunido bajo una ramada, juegos y un espacio de mariposas",
    facts: [
      { label: "Horario", value: "De jueves a lunes, de 9 a.m. a 4 p.m. Última entrada a las 3 p.m. Cerrado martes y miércoles, además de Acción de Gracias y Navidad" },
      { label: "Toddler Time", value: "De 5 años o menos, lunes, jueves y viernes, de 11 a.m. a mediodía, incluido con la entrada" },
      { label: "Butterfly Habitat", value: "De temporada. Abierto hasta el 23 de noviembre de 2026" },
      { label: "Precio", value: "Residentes de Nevada: $9.95 adultos, $4.95 de 3 a 17 años, menores de 2 años gratis. No aceptan efectivo" },
      { label: "Dirección", value: "333 S. Valley View Blvd, Las Vegas, NV 89107" },
    ],
  },
  "turkey-trot": {
    name: "Las Vegas Turkey Trot (Boulder City)",
    blurb: "La mañana de Acción de Gracias en el Historic Railroad Trail. El paseo de 1 milla es la distancia para ir en familia.",
    alt: "Ilustración de una caminata la mañana de Acción de Gracias por un sendero de ferrocarril en el desierto, hacia un túnel histórico, con un lago a lo lejos",
    facts: [
      { label: "Cuándo", value: "Jueves 26 de noviembre de 2026. El 5K y la distancia de 1 milla empiezan a las 8:15 a.m." },
      { label: "Precio", value: "Paseo de 1 milla $50, 5K $65 en el nivel actual de inscripción tardía, hasta el día de la carrera (confírmalo en el sitio de la carrera)" },
      { label: "Dónde", value: "Estacionamiento del Historic Railroad Trail, Lakeshore Rd, Boulder City" },
    ],
  },
  "discovery-noon": {
    name: "Noon Year's Eve en DISCOVERY Children's Museum",
    blurb: "Cuenta regresiva de Año Nuevo al mediodía, para llegar a casa a la hora de la siesta. Caída de globos, DJ y manualidades.",
    facts: [
      { label: "Cuándo", value: "El año pasado fue el 31 de diciembre, con una caída de globos al mediodía. El de 2026 todavía no está en el sitio del museo. Revisa el calendario antes de ir" },
      { label: "También esta temporada", value: "Elf Weekend sí es oficial: del 27 al 29 de noviembre, de 10 a.m. a 5 p.m." },
      { label: "Horario", value: "De martes a sábado, de 10 a.m. a 5 p.m. Domingo de mediodía a 5 p.m. También abre los lunes durante las vacaciones de invierno" },
      { label: "Cerrado", value: "Acción de Gracias, Nochebuena, Navidad y Año Nuevo" },
      { label: "Dirección", value: "360 Promenade Place, Las Vegas, NV 89106" },
    ],
  },
  "bellagio-conservatory": {
    name: "Exhibición navideña del Bellagio Conservatory",
    blurb: "Jardín gratis y bajo techo en el Strip, abierto a toda hora. Fácil de entrar entre otros planes. Las carriolas caben, y te puedes ir en un minuto.",
    alt: "Ilustración de un invernadero con techo de vidrio, un árbol navideño iluminado y flores enormes",
    facts: [
      { label: "Fechas", value: "Del 14 de noviembre de 2026 al 2 de enero de 2027 (calendario oficial de Bellagio). Cerrado del 8 al 13 de noviembre por la instalación" },
      { label: "Horario", value: "Gratis, abierto las 24 horas" },
      { label: "Dónde", value: "Bellagio Conservatory, junto al lobby del hotel en el Strip. Queda en el Strip, no en downtown" },
    ],
  },
  nutcracker: {
    name: "The Nutcracker de Nevada Ballet Theatre",
    blurb: "The Nutcracker de siempre en el valle, en The Smith Center. Compra con la compañía o en la taquilla, no en un sitio de reventa.",
    alt: "Ilustración de un ballet en un escenario con nieve, una niña vista de espaldas y un soldado cascanueces de juguete",
    facts: [
      { label: "Fechas", value: "Del 14 al 27 de diciembre de 2026, en Reynolds Hall, The Smith Center. No es todos los días. Revisa el calendario oficial para los horarios" },
      { label: "Edad", value: "No entran menores de 3 años" },
      { label: "Boletos", value: "Compra con Nevada Ballet Theatre o en la taquilla de The Smith Center" },
    ],
  },
};

const BOARD_LABEL_ES: Record<string, string> = {
  "game-day": "Friday Game Day en Clark County Library",
  "teen-rainbow": "Teen Hangout y Teen Fridays: Rainbow Library",
  "teen-alexander": "Teen Hangout y Teen Fridays: Alexander Library",
  "pajama-rainbow": "Family Pajama Storytime (en pijama): Rainbow Library",
  "stem-alexander": "Create & Explore STEM: Alexander Library",
  "stem-aliante": "Create & Explore STEM: Aliante Library",
};

const HOOD_ES: Record<string, { title: string; bullets: Record<string, string> }> = {
  north: {
    title: "North Las Vegas / Aliante / Craig Ranch",
    bullets: {},
  },
  west: {
    title: "Oeste / Summerlin / Centennial",
    bullets: {
      "Centennial Hills Library programs": "Programas de Centennial Hills Library",
      "Rainbow Library pajama storytime": "Hora del cuento en pijama de Rainbow Library",
    },
  },
  central: {
    title: "Centro / Oakey / Springs",
    bullets: {},
  },
  henderson: {
    title: "Henderson / Sureste",
    bullets: {
      "Whitney Library meal and game programs": "Comidas y juegos en Whitney Library",
    },
  },
  downtown: {
    title: "Downtown / Arts District",
    bullets: {
      "Sunrise Library Kids Cafe": "Kids Cafe de Sunrise Library",
      "Clark County Library Friday games": "Juegos de los viernes en Clark County Library",
      "Bellagio Conservatory holiday display (on the Strip)": "Exhibición navideña del Bellagio Conservatory (en el Strip)",
    },
  },
};

export const HOLIDAY_ES_AGE_BANDS: { id: GuideAge; label: string; emoji: string; intro: string; tips: string }[] = [
  {
    id: "toddler",
    label: "Bebés y niños pequeños",
    emoji: "👶",
    intro: "Luces que se ven desde el asiento del carro o la carriola, planes de día, y cualquier cosa de la que te puedas ir en cinco minutos.",
    tips: "Filas largas de Santa en hora pico, desfiles tarde en la noche, y Año Nuevo a medianoche. El mediodía es una medianoche perfectamente buena.",
  },
  {
    id: "kids",
    label: "Niños (aprox. 4 a 10)",
    emoji: "🎨",
    intro: "La edad ideal para caminar entre luces, minitrenes, Santa, y desvelarse un poquito a propósito.",
    tips: "",
  },
  {
    id: "tweens",
    label: "Preadolescentes (aprox. 11 a 14)",
    emoji: "🛹",
    intro: "Dales un trabajo: navegante en el recorrido en carro, fotógrafo de las luces, juez del desfile.",
    tips: "",
  },
];

export const HOLIDAY_ES_CHECKLIST = [
  { emoji: "🧥", text: "Abrigos de verdad. Las noches de diciembre en el desierto se enfrían rápido" },
  { emoji: "🚻", text: "Una parada al baño antes de cualquier fila de recorrido en carro" },
  { emoji: "💵", text: "Efectivo para el precio más barato en la entrada de Glittering Lights" },
  { emoji: "🍪", text: "Botanas para el carro que no se derritan ni se deshagan en el asiento" },
  { emoji: "🛒", text: "Carriola o vagón para los recorridos de luces a pie" },
  { emoji: "🔋", text: "Batería portátil (las fotos de las luces gastan el teléfono)" },
];

export const HOLIDAY_ES_PLAN = [
  {
    emoji: "🦃",
    title: "Semana de Acción de Gracias",
    text: "Paseo del Turkey Trot por la mañana, o un día tranquilo de museo. Muchos lugares cierran el mismo día de Acción de Gracias.",
  },
  {
    emoji: "🌙",
    title: "Entre semana, sin complicarte",
    text: "Jardín de cactus de Ethel M: $3, estacionamiento cerca, y en casa a la hora de dormir.",
  },
  {
    emoji: "🎄",
    title: "Una noche grande",
    text: "Elige uno: Magical Forest o Glittering Lights. Aparta un día entre semana si puedes. Los fines de semana cerca de Navidad están llenos.",
  },
  {
    emoji: "🎈",
    title: "Vacaciones de invierno y Año Nuevo",
    text: "Programas de biblioteca y Springs Preserve de día. Noon Year's Eve para los pequeños, y a dormir temprano todos.",
  },
];

export const HOLIDAY_ES_HERO_ALT =
  "Ilustración del valle de Las Vegas al atardecer, con un árbol navideño iluminado, un cactus envuelto en luces, un trenecito, una pista de hielo y un carro entrando a un túnel de luces";

export function holidayVenuesEs(): GuideVenue[] {
  return HOLIDAY_VENUES.map((venue) => {
    const es = VENUE_ES[venue.id];
    if (!es) throw new Error(`Missing Spanish holiday venue ${venue.id}`);
    if (es.facts.length !== venue.facts.length) {
      throw new Error(`Spanish facts for ${venue.id} do not match English`);
    }
    return {
      ...venue,
      name: es.name,
      blurb: es.blurb,
      facts: es.facts,
      image: venue.image ? { ...venue.image, alt: es.alt ?? venue.image.alt } : undefined,
    };
  });
}

export function holidayVenueEsById(id: string): GuideVenue | undefined {
  return holidayVenuesEs().find((venue) => venue.id === id);
}

export function holidayBoardEs(): GuideBoardItem[] {
  return HOLIDAY_BOARD_ITEMS.map((item) => ({
    ...item,
    label: BOARD_LABEL_ES[item.id] ?? item.label,
  }));
}

export function holidayNeighborhoodsEs(): GuideNeighborhood[] {
  return HOLIDAY_NEIGHBORHOODS.map((hood) => {
    const es = HOOD_ES[hood.id];
    if (!es) throw new Error(`Missing Spanish neighborhood ${hood.id}`);
    return {
      ...hood,
      title: es.title,
      extraBullets: hood.extraBullets.map((bullet) => ({
        ...bullet,
        label: es.bullets[bullet.label] ?? bullet.label,
      })),
    };
  });
}
