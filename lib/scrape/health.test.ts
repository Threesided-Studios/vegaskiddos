import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateScrapeHealth } from "./health";

describe("evaluateScrapeHealth", () => {
  it("fails when a core source succeeds but returns zero events", () => {
    const v = evaluateScrapeHealth([
      { source: "Library", found: 0, errors: [] },
      { source: "Family Fun Vegas", found: 40, errors: [] },
    ]);
    assert.equal(v.shouldFail, true);
    assert.deepEqual(v.deadCore.map((x) => x.source), ["Library"]);
    assert.equal(v.hardErrors.length, 0);
  });

  it("does not fail when Library fetch errors (WAF/HTTP) with zero events", () => {
    const v = evaluateScrapeHealth([
      { source: "Library", found: 0, errors: ["HTTP 403"] },
      { source: "Family Fun Vegas", found: 40, errors: [] },
    ]);
    assert.equal(v.shouldFail, false);
    assert.equal(v.deadCore.length, 0);
    assert.deepEqual(v.softErrors.map((x) => x.source), ["Library"]);
  });

  it("does not fail on Vegas Family Guide errors", () => {
    const v = evaluateScrapeHealth([
      { source: "Vegas Family Guide", found: 0, errors: ["page 1: HTTP 403"] },
      { source: "Family Fun Vegas", found: 10, errors: [] },
    ]);
    assert.equal(v.shouldFail, false);
    assert.deepEqual(v.softErrors.map((x) => x.source), ["Vegas Family Guide"]);
  });

  it("fails on hard errors from non-soft sources", () => {
    const v = evaluateScrapeHealth([
      { source: "Family Fun Vegas", found: 0, errors: ["page 1: HTTP 500"] },
    ]);
    assert.equal(v.shouldFail, true);
    assert.deepEqual(v.hardErrors.map((x) => x.source), ["Family Fun Vegas"]);
  });

  it("treats Henderson Libraries Communico blips as soft", () => {
    const v = evaluateScrapeHealth([
      { source: "Henderson Libraries", found: 0, errors: ["HTTP 503"] },
      { source: "Family Fun Vegas", found: 5, errors: [] },
    ]);
    assert.equal(v.shouldFail, false);
    assert.deepEqual(v.softErrors.map((x) => x.source), ["Henderson Libraries"]);
  });
});
