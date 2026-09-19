import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  postableTitle,
  seasonallyRelevant,
  isFbPostRelevant,
  ptMonth,
} from "./fb-post-filter.mjs";

const midSep = new Date("2026-09-15T17:00:00-07:00");
const earlyJul = new Date("2026-07-01T12:00:00-07:00");

describe("postableTitle", () => {
  it("skips adult-only and closure titles", () => {
    assert.equal(postableTitle("Adult Perler Bead Night"), false);
    assert.equal(postableTitle("CLOSED FOR THANKSGIVING"), false);
    assert.equal(postableTitle("Young Adult Game Night"), true);
  });
});

describe("seasonallyRelevant", () => {
  it("rejects July 4 / Kaboom titles in mid-September", () => {
    assert.equal(seasonallyRelevant("4th of July Freebies and Deals", "", midSep), false);
    assert.equal(seasonallyRelevant("Red, White & Kaboom", "", midSep), false);
    assert.equal(seasonallyRelevant("Summer Tutoring at the Library", "", midSep), false);
    assert.equal(seasonallyRelevant("Labor Day Weekend Family Fun", "", new Date("2026-10-05T12:00:00-07:00")), false);
  });

  it("allows the same titles in their season months", () => {
    assert.equal(seasonallyRelevant("Red, White & Kaboom", "", earlyJul), true);
    assert.equal(seasonallyRelevant("Summer Tutoring at the Library", "", new Date("2026-06-15T12:00:00-07:00")), true);
  });

  it("allows year-round storytime without seasonal keywords", () => {
    assert.equal(seasonallyRelevant("Weekly Preschool Storytime", "Weekly on Tuesdays", midSep), true);
  });

  it("checks recurrence text as well as title", () => {
    assert.equal(seasonallyRelevant("Library Special Event", "Independence Day celebration", midSep), false);
  });
});

describe("isFbPostRelevant", () => {
  it("schedule mode: recurring bypasses start date but not season gate", () => {
    const fields = {
      Title: "Red, White & Kaboom",
      Start: "2026-07-04T02:00:00.000Z",
      Recurrence: "Annual",
    };
    assert.equal(isFbPostRelevant(fields, midSep, { mode: "schedule" }), false);
    assert.equal(isFbPostRelevant(fields, earlyJul, { mode: "schedule" }), true);
  });

  it("schedule mode: one-time must be after the slot", () => {
    const slot = new Date("2026-09-20T16:00:00-07:00");
    assert.equal(
      isFbPostRelevant({ Title: "Pumpkin Patch Opening", Start: "2026-10-01T18:00:00.000Z" }, slot, { mode: "schedule" }),
      true,
    );
    assert.equal(
      isFbPostRelevant({ Title: "Pumpkin Patch Opening", Start: "2026-09-10T18:00:00.000Z" }, slot, { mode: "schedule" }),
      false,
    );
  });

  it("daily mode: skips far-past one-time starts", () => {
    assert.equal(
      isFbPostRelevant(
        { Title: "Neighborhood Block Party", Start: "2026-06-01T18:00:00.000Z" },
        midSep,
        { mode: "daily" },
      ),
      false,
    );
  });
});

describe("ptMonth", () => {
  it("uses America/Los_Angeles", () => {
    assert.equal(ptMonth(new Date("2026-09-15T17:00:00-07:00")), 9);
    assert.equal(ptMonth(new Date("2026-07-01T12:00:00-07:00")), 7);
  });
});
