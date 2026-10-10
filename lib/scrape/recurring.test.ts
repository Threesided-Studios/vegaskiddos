import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { collapseRecurring, isMultiDayRun } from "./recurring";
import type { ScrapedEvent } from "./types";

const ev = (title: string, start: string, extra: Partial<ScrapedEvent> = {}): ScrapedEvent => ({
  externalId: `x:${title}:${start}`, title, description: "", venue: "Park", address: "",
  neighborhood: null, lat: null, lng: null, start, ageTiers: [], priceTier: null, source: "Test", ...extra,
});

describe("isMultiDayRun", () => {
  it("detects a back-to-back weekend when the feed covers the next week", () => {
    assert.equal(isMultiDayRun(["2026-07-04", "2026-07-05"], "2026-07-31"), true);
  });
  it("does not guess when the feed window ends right after the run", () => {
    assert.equal(isMultiDayRun(["2026-07-04", "2026-07-05"], "2026-07-08"), false);
  });
  it("leaves real weekly patterns alone", () => {
    assert.equal(isMultiDayRun(["2026-07-07", "2026-07-09"], "2026-07-31"), false);
    assert.equal(isMultiDayRun(["2026-07-04", "2026-07-11"], "2026-07-31"), false);
  });
});

describe("collapseRecurring", () => {
  it("turns a Sat+Sun holiday listing into one event with an end, not a weekly series", () => {
    const out = collapseRecurring([
      ev("4th of July Freebies", "2026-07-04T17:00:00.000Z", { end: "2026-07-05T05:00:00.000Z" }),
      ev("4th of July Freebies", "2026-07-05T17:00:00.000Z", { end: "2026-07-06T05:00:00.000Z" }),
      ev("Something later", "2026-07-30T17:00:00.000Z"),
    ]);
    const j = out.find((e) => e.title === "4th of July Freebies")!;
    assert.equal(j.recurrence, undefined);
    assert.equal(j.start, "2026-07-04T17:00:00.000Z");
    assert.equal(j.end, "2026-07-06T05:00:00.000Z");
    assert.ok(j.externalId.startsWith("series:"));
  });
  it("still builds weekly series", () => {
    const out = collapseRecurring([
      ev("Storytime", "2026-07-07T17:00:00.000Z"),
      ev("Storytime", "2026-07-14T17:00:00.000Z"),
      ev("Storytime", "2026-07-21T17:00:00.000Z"),
    ]);
    assert.equal(out[0].recurrence, "Weekly on Tuesdays");
  });
});
