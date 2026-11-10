import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HolidayGuide2026 } from "../components/guides/HolidayGuide2026";
import { HOLIDAY_VENUES } from "./holiday-guide-data";
import { HOLIDAY_ES_META, holidayVenuesEs } from "./holiday-guide-es";
import { getGuideMeta } from "./guides";

function decode(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function headings(html: string, level: string): string[] {
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, "g"))].map(
    (match) => decode(match[1]),
  );
}

describe("Spanish holiday guide", () => {
  const html = renderToStaticMarkup(createElement(HolidayGuide2026, { lang: "es" }));
  const english = renderToStaticMarkup(createElement(HolidayGuide2026));

  it("translates the article headings and keeps each card once", () => {
    assert.deepEqual(headings(html, "2"), [
      "Cómo usar esta guía",
      "Edades",
      "Los eventos",
      "Gratis o de pago",
      "Por vecindario",
      "En el tablero ahora",
      "Las fechas que mueven todo",
      "Un plan sencillo para la temporada",
      "Lista para noches frías",
      "Lo que todavía no estamos listando",
    ]);
    assert.deepEqual(headings(html, "4"), holidayVenuesEs().map((venue) => venue.name));
    assert.equal(headings(html, "4").length, HOLIDAY_VENUES.length);
    assert.equal(new Set(headings(html, "4")).size, HOLIDAY_VENUES.length);
    assert.equal(html.match(/<article\b/g)?.length ?? 0, HOLIDAY_VENUES.length);
  });

  it("matches the English facts and uses Spanish alt text", () => {
    const required = [
      "Del 6 de noviembre de 2026 al 3 de enero de 2027",
      "de 5 a 9 p.m.",
      "de 5 a 10 p.m.",
      "$39",
      "$44",
      "$64",
      "$25",
      "$149",
      "Del 27 al 29 de noviembre",
      "Elf Weekend sí es oficial: del 27 al 29 de noviembre, de 10 a.m. a 5 p.m.",
      "$3 por persona",
      "3 y 4 de diciembre de 2026",
      "No hay desfile el 27 de noviembre",
      "$22",
      "$39.99",
      "$7 por persona",
      "$9.95",
      "$4.95",
      "23 de noviembre de 2026",
      "Jueves 26 de noviembre de 2026",
      "8:15 a.m.",
      "$50",
      "$65",
      "Del 14 de noviembre de 2026 al 2 de enero de 2027",
      "Cerrado del 8 al 13 de noviembre",
      "Del 14 al 27 de diciembre de 2026",
      "No entran menores de 3 años",
      "jueves 26 de noviembre",
      "viernes 4 de diciembre",
      "sábado 12 de diciembre",
      "viernes 25 de diciembre",
      "sábado 26 de diciembre",
      "viernes 1 de enero",
      "jueves 31 de diciembre",
    ];
    for (const fact of required) assert.ok(html.includes(fact), fact);

    for (const venue of holidayVenuesEs()) {
      if (!venue.image) continue;
      assert.ok(html.includes(`alt="${venue.image.alt}"`), venue.id);
      const englishVenue = HOLIDAY_VENUES.find((item) => item.id === venue.id);
      assert.notEqual(venue.image.alt, englishVenue?.image?.alt);
    }
    assert.equal(html.includes("—"), false);
    assert.equal(html.includes("–"), false);
  });

  it("leaves the English article and its meta in English", () => {
    assert.ok(english.includes(">The events<"));
    assert.ok(english.includes("How to use this"));
    assert.equal(english.includes(">Los eventos<"), false);
    assert.equal(english.includes("Cómo usar esta guía"), false);
    assert.equal(
      getGuideMeta("holiday-guide-2026")?.title,
      "Thanksgiving to New Year's with kids in Las Vegas",
    );
    assert.equal(getGuideMeta("holiday-guide-2026", "es")?.title, HOLIDAY_ES_META.title);
    assert.equal(getGuideMeta("holiday-guide-2026", "es")?.description, HOLIDAY_ES_META.description);
    assert.equal(
      getGuideMeta("fall-halloween-guide-2026", "es")?.title,
      "Fall and Halloween with kids in Las Vegas",
    );
  });
});
