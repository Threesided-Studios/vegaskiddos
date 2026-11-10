import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HolidayGuide2026 } from "../components/guides/HolidayGuide2026";
import { HOLIDAY_VENUES } from "./holiday-guide-data";

function decode(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function sliceBetween(html: string, start: string, end: string): string {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from + start.length);
  assert.ok(from !== -1 && to !== -1, `missing slice ${start} -> ${end}`);
  return html.slice(from, to);
}

describe("holiday guide cards", () => {
  const html = renderToStaticMarkup(createElement(HolidayGuide2026));

  it("renders each event card once, under The events", () => {
    const events = sliceBetween(html, ">The events<", ">Free vs paid<");
    const titles = [...events.matchAll(/<h4\b[^>]*>([\s\S]*?)<\/h4>/g)].map((match) =>
      decode(match[1]),
    );
    assert.deepEqual(
      titles,
      HOLIDAY_VENUES.map((venue) => venue.name),
    );
    assert.equal(html.match(/<h4\b/g)?.length ?? 0, HOLIDAY_VENUES.length);
    assert.equal(html.match(/<article\b/g)?.length ?? 0, HOLIDAY_VENUES.length);
  });

  it("keeps age bands, price, neighborhood, and the board free of cards", () => {
    const bands = sliceBetween(html, ">Age bands<", ">The events<");
    const price = sliceBetween(html, ">Free vs paid<", ">By neighborhood<");
    const hoods = sliceBetween(html, ">By neighborhood<", ">On the board now<");
    const board = sliceBetween(html, ">On the board now<", ">The dates that move everything<");
    for (const block of [bands, price, hoods, board]) {
      assert.equal(block.includes("<article"), false);
      assert.equal(block.includes("<h4"), false);
    }
  });

  it("points every age-band name at the single card and does not repeat images", () => {
    for (const venue of HOLIDAY_VENUES) {
      assert.equal(html.split(`id="${venue.id}"`).length - 1, 1, venue.id);
      assert.ok(html.includes(`href="#${venue.id}"`), venue.id);
      if (!venue.image) continue;
      assert.equal(imgCount(html, venue.image.src), 1, venue.image.src);
    }
    assert.equal(imgCount(html, "/guides/holiday-2026/holiday-guide-2026-hero.webp"), 1);
  });
});

function imgCount(html: string, src: string): number {
  const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<img\\b[^>]*\\bsrc="${escaped}"`, "g"))?.length ?? 0;
}
