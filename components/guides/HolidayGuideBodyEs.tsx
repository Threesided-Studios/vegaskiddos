import { Cloud, Star } from "@/components/Doodles";
import type { GuideAge, GuideVenue } from "@/lib/fall-guide-data";
import { HOLIDAY_URLS } from "@/lib/holiday-guide-data";
import {
  HOLIDAY_ES_AGE_BANDS,
  HOLIDAY_ES_CHECKLIST,
  HOLIDAY_ES_FILTER,
  HOLIDAY_ES_HERO_ALT,
  HOLIDAY_ES_MAP,
  HOLIDAY_ES_PLAN,
  holidayBoardEs,
  holidayNeighborhoodsEs,
  holidayVenueEsById,
  holidayVenuesEs,
} from "@/lib/holiday-guide-es";
import {
  FallGuideFilterBar,
  FallGuideFilterEmpty,
  FallGuideNeighborhoodMap,
} from "./FallGuideFilterProvider";
import { GuideLink, GuideSection, VenueCard, linkClass } from "./fall-guide-ui";

const VENUES = holidayVenuesEs();

function guideItemProps(venue: Pick<GuideVenue, "ages" | "price" | "hoods">) {
  return {
    "data-guide-item": true,
    "data-age": venue.ages.join(" "),
    "data-price": venue.price,
    "data-hood": venue.hoods.join(" "),
  };
}

function venueItemProps(id: string) {
  const venue = holidayVenueEsById(id);
  if (!venue) throw new Error(`Missing holiday venue ${id}`);
  return guideItemProps(venue);
}

function VenueNameList({ age }: { age: GuideAge }) {
  const venues = VENUES.filter((venue) => venue.ages.includes(age));
  return (
    <ul className="mt-2 list-disc space-y-1 pl-6 text-ink/80">
      {venues.map((venue) => (
        <li key={venue.id} {...guideItemProps(venue)}>
          <a href={`#${venue.id}`} className={linkClass}>
            {venue.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Spanish article body. English stays in HolidayGuideBody. */
export function HolidayGuideBodyEs() {
  const board = holidayBoardEs();
  return (
    <>
      <figure className="overflow-hidden rounded-blob shadow-card">
        <img
          src="/guides/holiday-2026/holiday-guide-2026-hero.webp"
          alt={HOLIDAY_ES_HERO_ALT}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-video h-auto w-full max-w-full object-cover"
        />
      </figure>

      <div className="relative overflow-hidden rounded-blob bg-gradient-to-br from-teal/20 via-sunny/20 to-coral/20 p-6 shadow-card">
        <Star className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 rotate-12 text-sunny/30" />
        <Cloud className="pointer-events-none absolute bottom-2 left-4 h-12 w-16 text-teal/20" />
        <p className="relative text-lg leading-relaxed text-ink/80">
          Seis semanas, cuatro fiestas, unas vacaciones de invierno. El valle se ilumina y el
          calendario se llena solo.
        </p>
        <p className="relative mt-3 text-ink/80">
          Una guía sencilla para mamás y papás, de Acción de Gracias a Año Nuevo en el valle,
          ordenada por edad, gratis o de pago, y vecindario. Las fechas de abajo están cotejadas
          con cada lugar o con un listado que tiene nombre, y decimos cuál. Algunos detalles de
          2026 todavía están saliendo, incluido el listado oficial de Noon Year&apos;s Eve del
          museo, así que revisa otra vez la semana que vayas.
        </p>
      </div>

      <GuideSection id="how-to" title="Cómo usar esta guía" wash="white">
        <p className="text-ink/80">
          Usa los filtros de abajo para acotar por edad, presupuesto y vecindario, o toca una zona
          del mapa. Empieza amplio y luego afina cuando veas qué cabe en tu semana.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-6 text-ink/80">
          <li>
            Elige una ficha de <span className="font-700">edad</span>.
          </li>
          <li>
            Elige <span className="font-700">gratis</span> o <span className="font-700">de pago</span>.
          </li>
          <li>
            Elige un <span className="font-700">vecindario</span> (o toca el mapa). El tráfico de
            diciembre cerca del Strip ya es una tradición de las fiestas.
          </li>
        </ol>
        <p className="mt-3 text-sm text-ink/70">
          Siempre revisa la página del lugar la semana que vayas. Los horarios cambian alrededor de
          Acción de Gracias, Navidad y Año Nuevo.
        </p>
        <FallGuideFilterBar copy={HOLIDAY_ES_FILTER} />
      </GuideSection>

      <FallGuideFilterEmpty
        message={HOLIDAY_ES_FILTER.empty}
        resetLabel={HOLIDAY_ES_FILTER.reset}
      />

      <GuideSection title="Edades" wash="coral" matchRequired>
        {HOLIDAY_ES_AGE_BANDS.map((band) => (
          <div key={band.id} data-guide-age-band={band.id} className="mb-8 last:mb-0">
            <h3 className="font-display text-xl font-600 text-ink">
              {band.emoji} {band.label}
              {band.id === "toddler" ? " (menores de unos 3 años)" : ""}
            </h3>
            <p className="mt-2 text-ink/80">{band.intro}</p>

            {band.id === "toddler" && (
              <>
                <p className="mt-3 font-700 text-ink/80">Buenas opciones (confirma antes de ir):</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-ink/80">
                  <li {...venueItemProps("glittering-lights")}>
                    <a href="#glittering-lights" className={linkClass}>
                      Glittering Lights
                    </a>{" "}
                    desde el asiento del carro, en pijama
                  </li>
                  <li {...venueItemProps("ethel-m")}>
                    <a href="#ethel-m" className={linkClass}>
                      Jardín de cactus de Ethel M
                    </a>{" "}
                    (menores de 2 años gratis, recorrido corto)
                  </li>
                  <li {...venueItemProps("discovery-noon")}>
                    <a href="#discovery-noon" className={linkClass}>
                      Noon Year&apos;s Eve
                    </a>{" "}
                    en DISCOVERY Children&apos;s Museum
                  </li>
                  <li {...venueItemProps("bellagio-conservatory")}>
                    <a href="#bellagio-conservatory" className={linkClass}>
                      Bellagio Conservatory
                    </a>{" "}
                    exhibición navideña (gratis, adentro, te vas cuando necesites)
                  </li>
                  <li>
                    Horas del cuento y noches de pijama en la biblioteca (revisa tu sucursal en{" "}
                    <GuideLink href={HOLIDAY_URLS.vkStorytime}>Vegas Kiddos</GuideLink>)
                  </li>
                </ul>
                <p className="mt-3 text-ink/80">
                  <span className="font-700">Mejor saltar o acortar:</span> {band.tips}
                </p>
              </>
            )}

            {band.id === "kids" && (
              <>
                <p className="mt-3 font-700 text-ink/80">Buenas opciones:</p>
                <VenueNameList age="kids" />
              </>
            )}

            {band.id === "tweens" && (
              <>
                <p className="mt-3 font-700 text-ink/80">Buenas opciones:</p>
                <VenueNameList age="tweens" />
                <p
                  {...guideItemProps({
                    ages: ["tweens"],
                    price: "free",
                    hoods: ["west", "north", "downtown", "henderson"],
                  })}
                  className="mt-3 text-ink/80"
                >
                  Reuniones y noches de juegos para adolescentes en la biblioteca durante las
                  vacaciones de invierno (gratis; se repiten en{" "}
                  <GuideLink href={HOLIDAY_URLS.vkHome}>vegaskiddos.com</GuideLink>)
                </p>
              </>
            )}
          </div>
        ))}
      </GuideSection>

      <GuideSection id="the-events" title="Los eventos" wash="white" matchRequired>
        <p className="text-ink/80">
          Cada evento está escrito una sola vez. Los nombres en las edades saltan a esa tarjeta.
        </p>
        <div className="mt-4 space-y-4">
          {VENUES.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </GuideSection>

      <GuideSection title="Gratis o de pago" wash="teal" matchRequired>
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            data-guide-price-col="free"
            className="rounded-blob border border-teal/20 bg-white/80 p-4"
          >
            <h3 className="font-display text-lg font-600 text-ink">🆓 Gratis (o entrada gratis)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                <GuideLink href={HOLIDAY_URLS.winterfest}>Henderson WinterFest</GuideLink> 3 y 4 de
                diciembre: encendido del árbol y desfile de luces
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.downtownSummerlin}>Downtown Summerlin</GuideLink>{" "}
                desfile de fin de semana con nieve, viernes y sábado a las 6 p.m., del 20 de
                noviembre al 19 de diciembre (no hay desfile el 27 de noviembre)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.bellagio}>Bellagio Conservatory</GuideLink> exhibición
                navideña en el Strip: gratis, abierto las 24 horas, del 14 de noviembre de 2026 al
                2 de enero de 2027
              </li>
              <li>
                Programas de biblioteca, comidas de Kids Cafe y reuniones de adolescentes:{" "}
                <GuideLink href={HOLIDAY_URLS.vkHome}>vegaskiddos.com</GuideLink>
              </li>
              <li>
                Calles de luces del vecindario: maneja despacio, estaciónate en un lugar permitido y
                quédate en la banqueta
              </li>
            </ul>
          </div>
          <div
            data-guide-price-col="paid"
            className="rounded-blob border border-coral/20 bg-white/80 p-4"
          >
            <h3 className="font-display text-lg font-600 text-ink">💳 De pago</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              <li>
                <GuideLink href={HOLIDAY_URLS.ethelM}>Ethel M Holiday Cactus Garden</GuideLink> ($3
                por persona; menores de 2 años y personas de 65 años o más entran gratis)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.glitteringLights}>Glittering Lights</GuideLink> (por
                carro, $39 en efectivo o $44 con tarjeta)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.magicalForest}>Magical Forest</GuideLink> (menores de
                3 años gratis; hay boletos por fecha a la venta, confirma el precio al comprar)
              </li>
              <li>
                <GuideLink href={HOLIDAY_URLS.springsPreserve}>Springs Preserve</GuideLink> (niños
                residentes de Nevada $4.95)
              </li>
              <li>
                <span className="italic">The Nutcracker</span> de Nevada Ballet Theatre en The
                Smith Center, del 14 al 27 de diciembre (no es todos los días). Compra con la
                compañía o en la taquilla. No entran menores de 3 años
              </li>
              <li>Patinaje, fotos con Santa y paseos en tren en Downtown Summerlin</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/80">
          Consejo: la noche más barata sigue siendo un termo de chocolate y un paseo lento frente
          al vecino que se pasó. En cada calle hay uno.
        </p>
      </GuideSection>

      <GuideSection title="Por vecindario" wash="sunny" matchRequired>
        <FallGuideNeighborhoodMap labels={HOLIDAY_ES_MAP} />
        <div className="mt-6 space-y-6">
          {holidayNeighborhoodsEs().map((hood) => {
            const hoodVenues = hood.venueIds
              .map((id) => holidayVenueEsById(id))
              .filter((venue): venue is GuideVenue => Boolean(venue));
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
                  {hoodVenues.map((venue) => (
                    <li key={venue.id}>
                      <GuideLink href={venue.url}>{venue.name}</GuideLink>
                    </li>
                  ))}
                  {hood.extraBullets.map((bullet) => (
                    <li key={bullet.label}>
                      <GuideLink href={bullet.url}>{bullet.label}</GuideLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </GuideSection>

      <GuideSection title="En el tablero ahora" wash="grape" matchRequired>
        <p className="text-ink/80">
          Un recorte gratis y local del tablero de Vegas Kiddos. Siguen durante las vacaciones de
          invierno, cuando los niños están en casa y un almuerzo gratis importa.
        </p>
        <p className="mt-3 text-ink/80">
          <span className="font-700">
            Comidas gratis que se repiten (Three Square Kids Cafe / Meet Up to Eat Up):
          </span>{" "}
          Edades de unos 2 a 18 años. Por orden de llegada, mientras haya comida. Sucursales con
          listado en Vegas Kiddos:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {board.filter((item) => item.id.startsWith("kc-")).map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                data-guide-item
                data-age={item.ages.join(" ")}
                data-price={item.price}
                data-hood={item.hoods.join(" ")}
                className="inline-block rounded-full bg-white/80 px-3 py-1 text-sm font-700 text-teal-btn shadow-sm hover:bg-white"
              >
                {item.label.replace(" Kids Cafe", "")}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          {board.filter((item) => !item.id.startsWith("kc-")).map((item) => (
            <p
              key={item.id}
              data-guide-item
              data-age={item.ages.join(" ")}
              data-price={item.price}
              data-hood={item.hoods.join(" ")}
              className="text-ink/80"
            >
              <GuideLink href={item.url}>{item.label}</GuideLink>
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink/70">
          Las horas del cuento de las fiestas, los encendidos de menorá, los programas de Kwanzaa y
          las visitas de Santa aparecen en el tablero cuando los lugares los publican. Busca{" "}
          <GuideLink href={HOLIDAY_URLS.vkHolidaySearch}>holiday</GuideLink> o{" "}
          <GuideLink href={HOLIDAY_URLS.vkSantaSearch}>Santa</GuideLink> en Vegas Kiddos la semana
          que vayas.
        </p>
      </GuideSection>

      <GuideSection title="Las fechas que mueven todo" wash="cream">
        <ul className="list-disc space-y-1 pl-6 text-ink/80">
          <li>
            <span className="font-700">Acción de Gracias:</span> jueves 26 de noviembre. Los museos
            y Springs Preserve cierran ese día.
          </li>
          <li>
            <span className="font-700">Hanukkah:</span> empieza la noche del viernes 4 de diciembre
            y sigue hasta el sábado 12 de diciembre.
          </li>
          <li>
            <span className="font-700">Navidad:</span> viernes 25 de diciembre. La mayoría de las
            atracciones cierran o abren menos horas el 24 y el 25.
          </li>
          <li>
            <span className="font-700">Kwanzaa:</span> del sábado 26 de diciembre al viernes 1 de
            enero.
          </li>
          <li>
            <span className="font-700">Nochevieja:</span> jueves 31 de diciembre. Varios lugares
            cierran temprano. Es común que también cierren el día de Año Nuevo.
          </li>
        </ul>
      </GuideSection>

      <GuideSection title="Un plan sencillo para la temporada" wash="cream">
        <div className="grid gap-3 sm:grid-cols-2">
          {HOLIDAY_ES_PLAN.map((item) => (
            <div key={item.title} className="rounded-blob border border-ink/10 bg-white p-4 shadow-sm">
              <p className="text-2xl" aria-hidden>
                {item.emoji}
              </p>
              <p className="mt-1 font-700 text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink/80">{item.text}</p>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="Lista para noches frías" wash="cream">
        <div className="grid gap-3 sm:grid-cols-2">
          {HOLIDAY_ES_CHECKLIST.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-blob border border-ink/10 bg-white p-3 shadow-sm"
            >
              <span className="text-xl" aria-hidden>
                {item.emoji}
              </span>
              <p className="text-sm text-ink/80">{item.text}</p>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="Lo que todavía no estamos listando" wash="white">
        <p className="text-ink/80">
          Fotos con Santa que aparecen de un día para otro, exhibiciones de luces no oficiales, y
          cualquier cosa sin fecha o dirección pública. Cuando DISCOVERY publique su listado de
          Noon Year&apos;s Eve 2026, y cuando Opportunity Village publique un precio base claro del
          boleto, actualizamos esas líneas.
        </p>
      </GuideSection>

      <p className="mt-6 text-lg italic text-ink/70">
        No tienes que hacerlo todo. Una noche de luces y una mañana lenta ya es una buena
        temporada.
      </p>
    </>
  );
}
