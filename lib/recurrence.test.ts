import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { eventHasEnded, isListedEvent, recursOnDay } from "./recurrence";

describe("eventHasEnded", () => {
  it("keeps recurring series live even when the stored start is in the past", () => {
    assert.equal(eventHasEnded({ start: "2026-06-10T19:00:00.000Z", recurrence: "Weekly on Wednesdays" }, new Date("2026-08-12T12:00:00Z")), false);
  });

  it("marks a one-time event ended after its start", () => {
    assert.equal(eventHasEnded({ start: "2026-07-15T22:30:00.000Z" }, new Date("2026-08-12T12:00:00Z")), true);
    assert.equal(eventHasEnded({ start: "2026-08-20T22:30:00.000Z" }, new Date("2026-08-12T12:00:00Z")), false);
  });
});

describe("isListedEvent", () => {
  const now = new Date("2026-08-12T12:00:00Z");

  it("keeps recurring series on the listing regardless of stored start", () => {
    assert.equal(isListedEvent({ start: "2026-06-10T19:00:00.000Z", recurrence: "Weekly on Wednesdays" }, now), true);
  });

  it("keeps a one-time event on the listing for about a day after start", () => {
    assert.equal(isListedEvent({ start: "2026-08-12T02:00:00.000Z" }, now), true);
    assert.equal(isListedEvent({ start: "2026-08-10T12:00:00.000Z" }, now), false);
  });
});

describe("recursOnDay (Los Angeles civil weekday)", () => {
  it("treats Friday 6pm PT as Friday even when that instant is Saturday UTC", () => {
    // Friday 14 Aug 2026 18:00 PDT = 2026-08-15T01:00:00.000Z (Saturday UTC)
    const start = "2026-08-15T01:00:00.000Z";
    assert.equal(recursOnDay(start, "Weekly on Fridays", 2026, 7, 14), true);
    assert.equal(recursOnDay(start, "Weekly on Fridays", 2026, 7, 15), false);
  });
});

describe("series expiry (phantom recurring dates)", () => {
  const now = new Date("2026-10-10T07:00:00Z");

  it("expires a July 4th 'Weekly · Sun / Sat' series instead of showing it on Oct 10", () => {
    assert.equal(isListedEvent({ title: "4th of July Freebies and Deals", start: "2026-07-04T07:00:00.000Z", recurrence: "Weekly · Sun / Sat", scrapedAt: "2026-07-05T00:00:00.000Z" }, now), false);
  });

  it("expires holiday-named series even without a scrape timestamp", () => {
    assert.equal(isListedEvent({ title: "Red, White & Kaboom Fourth of July", start: "2026-07-03T18:00:00.000Z", recurrence: "Weekly · Fri / Sat" }, now), false);
  });

  it("keeps a holiday series live while it is in season", () => {
    assert.equal(isListedEvent({ title: "Halloween Storytime", start: "2026-10-07T18:00:00.000Z", recurrence: "Weekly · Wed / Thu", scrapedAt: "2026-10-09T00:00:00.000Z" }, now), true);
  });

  it("expires a series the scraper stopped seeing", () => {
    assert.equal(isListedEvent({ title: "Toddler Time", start: "2026-06-01T17:00:00.000Z", recurrence: "Weekly on Mondays", scrapedAt: "2026-06-01T00:00:00.000Z" }, now), false);
  });

  it("keeps a series the scraper still sees, even with an old start", () => {
    assert.equal(isListedEvent({ title: "Toddler Time", start: "2026-06-01T17:00:00.000Z", recurrence: "Weekly on Mondays", scrapedAt: "2026-10-09T00:00:00.000Z" }, now), true);
  });

  it("expires a series whose title year is over", () => {
    assert.equal(isListedEvent({ title: "Renaissance Festival 2025", start: "2026-10-09T17:00:00.000Z", recurrence: "Weekly · Sun / Fri / Sat" }, now), false);
  });

  it("keeps manual series with no scrape timestamp", () => {
    assert.equal(isListedEvent({ title: "Toddler Time", start: "2026-01-05T17:00:00.000Z", recurrence: "Weekly on Mondays" }, now), true);
  });

  it("keeps a multi-day one-time event listed until its end", () => {
    assert.equal(isListedEvent({ start: "2026-10-01T17:00:00.000Z", end: "2026-10-31T23:00:00.000Z" }, now), true);
    assert.equal(isListedEvent({ start: "2026-09-01T17:00:00.000Z", end: "2026-09-03T23:00:00.000Z" }, now), false);
  });
});
