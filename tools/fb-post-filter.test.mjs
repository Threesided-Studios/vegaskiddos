import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  postableTitle,
  seasonallyRelevant,
  isFbPostRelevant,
  eventIsPast,
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
    assert.equal(seasonallyRelevant("Social CirKISH Summer Showcase 2026", "", midSep), false);
    assert.equal(seasonallyRelevant("Labor Day Weekend Family Fun", "", new Date("2026-10-05T12:00:00-07:00")), false);
  });

  it("allows the same titles in their season months", () => {
    assert.equal(seasonallyRelevant("Red, White & Kaboom", "", earlyJul), true);
    assert.equal(seasonallyRelevant("Summer Tutoring at the Library", "", new Date("2026-06-15T12:00:00-07:00")), true);
  });

  it("rejects summer showcase in September; allows May–August", () => {
    const title = "Social CirKISH Summer Showcase 2026";
    assert.equal(seasonallyRelevant(title, "", midSep), false);
    assert.equal(seasonallyRelevant(title, "", new Date("2026-05-15T12:00:00-07:00")), true);
    assert.equal(seasonallyRelevant(title, "", new Date("2026-06-15T12:00:00-07:00")), true);
    assert.equal(seasonallyRelevant(title, "", new Date("2026-08-20T12:00:00-07:00")), true);
  });

  it("does not treat Summerlin neighborhood names as summer seasonal content", () => {
    assert.equal(seasonallyRelevant("Storytime at Summerlin Library", "Weekly on Wednesdays", midSep), true);
    assert.equal(seasonallyRelevant("Downtown Summerlin Kids' Market Morning", "", midSep), true);
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

  it("daily mode: skips summer showcase with a future Start but September post date", () => {
    assert.equal(
      isFbPostRelevant(
        {
          Title: "Social CirKISH Summer Showcase 2026",
          Start: "2026-10-01T18:00:00.000Z",
          Recurrence: "Weekly on Saturdays",
        },
        midSep,
        { mode: "daily" },
      ),
      false,
    );
  });
});

describe("past-event guard (America/Los_Angeles)", () => {
  // Regression: 2026-10-17 the daily post promoted "Trick or Treat Fest"
  // (Fri 10/16 6:00 PM PT = 2026-10-17T01:00Z) on Sat 10/17 — the old 24h grace
  // after Start, plus a UTC calendar date of 10/17, made it look current.
  const trickOrTreat = { Title: "Trick or Treat Fest", Start: "2026-10-17T01:00:00.000Z" };

  it("yesterday-evening PT event is past today even though its UTC date is today", () => {
    const satMorning = new Date("2026-10-17T11:00:00-07:00"); // cron slot
    const satEvening = new Date("2026-10-17T17:40:00-07:00"); // the actual re-run
    const satEarly = new Date("2026-10-17T00:30:00-07:00"); // 07:30Z — same UTC date as the event
    for (const at of [satEarly, satMorning, satEvening]) {
      assert.equal(eventIsPast(trickOrTreat, at), true);
      assert.equal(isFbPostRelevant(trickOrTreat, at, { mode: "daily" }), false);
      assert.equal(isFbPostRelevant(trickOrTreat, at, { mode: "roundup" }), false);
    }
  });

  it("an event that started earlier today is still eligible (people can join)", () => {
    const at = new Date("2026-10-18T11:00:00-07:00");
    const f = { Title: "Pumpkin Storytime", Start: "2026-10-18T10:00:00-07:00", End: "2026-10-18T12:00:00-07:00" };
    assert.equal(eventIsPast(f, at), false);
    assert.equal(isFbPostRelevant(f, at, { mode: "daily" }), true);
    // …through 11:59 PM PT on its date.
    assert.equal(isFbPostRelevant(f, new Date("2026-10-18T23:59:00-07:00"), { mode: "daily" }), true);
  });

  it("yesterday 6 PM event is past at 12:01 AM PT today", () => {
    const f = { Title: "Movie Night", Start: "2026-10-17T18:00:00-07:00" };
    assert.equal(isFbPostRelevant(f, new Date("2026-10-17T23:59:00-07:00"), { mode: "daily" }), true);
    assert.equal(eventIsPast(f, new Date("2026-10-18T00:01:00-07:00")), true);
    assert.equal(isFbPostRelevant(f, new Date("2026-10-18T00:01:00-07:00"), { mode: "daily" }), false);
  });

  it("a future event (later today or later this month) is eligible", () => {
    const at = new Date("2026-10-18T11:00:00-07:00");
    assert.equal(isFbPostRelevant({ Title: "Pumpkin Patch Night", Start: "2026-10-18T18:00:00-07:00" }, at, { mode: "daily" }), true);
    assert.equal(isFbPostRelevant({ Title: "Fall Festival", Start: "2026-10-25T10:00:00-07:00" }, at, { mode: "daily" }), true);
  });

  it("future events beyond 60 days stay out of daily", () => {
    const at = new Date("2026-10-18T11:00:00-07:00");
    assert.equal(isFbPostRelevant({ Title: "Spring Fair", Start: "2027-03-01T10:00:00-08:00" }, at, { mode: "daily" }), false);
  });

  it("a multi-day event is eligible through the end of its End date (PT)", () => {
    const f = { Title: "Fall Harvest Festival", Start: "2026-10-16T10:00:00-07:00", End: "2026-10-19T18:00:00-07:00" };
    assert.equal(isFbPostRelevant(f, new Date("2026-10-18T11:00:00-07:00"), { mode: "daily" }), true);
    assert.equal(isFbPostRelevant(f, new Date("2026-10-19T23:30:00-07:00"), { mode: "daily" }), true); // end date, after End time
    assert.equal(isFbPostRelevant(f, new Date("2026-10-20T00:01:00-07:00"), { mode: "daily" }), false);
    const allDay = { Title: "Pumpkin Patch", Start: "2026-10-10", End: "2026-10-31" };
    assert.equal(isFbPostRelevant(allDay, new Date("2026-10-31T21:00:00-07:00"), { mode: "daily" }), true);
    assert.equal(isFbPostRelevant(allDay, new Date("2026-11-01T08:00:00-07:00"), { mode: "daily" }), false);
  });

  it("date-only events are all-day on their PT date (not UTC midnight)", () => {
    const f = { Title: "Fall Book Sale", Start: "2026-10-18" };
    // 4 PM and 11 PM PT on 10/17 — UTC midnight of 10/18 has passed by 11 PM PT.
    assert.equal(isFbPostRelevant(f, new Date("2026-10-17T23:00:00-07:00"), { mode: "daily" }), true);
    assert.equal(isFbPostRelevant(f, new Date("2026-10-18T20:00:00-07:00"), { mode: "daily" }), true);
    assert.equal(isFbPostRelevant(f, new Date("2026-10-19T00:30:00-07:00"), { mode: "daily" }), false);
  });
});

describe("ptMonth", () => {
  it("uses America/Los_Angeles", () => {
    assert.equal(ptMonth(new Date("2026-09-15T17:00:00-07:00")), 9);
    assert.equal(ptMonth(new Date("2026-07-01T12:00:00-07:00")), 7);
  });
});
