import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PARTNERS, PARTNERS_COPY } from "./partners";

const EM_DASH = "\u2014";
const FORBIDDEN = ["#1", EM_DASH];

function walk(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(walk);
  if (value && typeof value === "object") return Object.values(value).flatMap(walk);
  return [];
}

describe("partners copy", () => {
  it("keeps the English listing and page copy verbatim", () => {
    const [first] = PARTNERS;
    assert.equal(first.name, "Las Vegas Kids' Directory");
    assert.equal(first.url, "https://lvkidsdirectory.com");
    assert.equal(
      first.blurb.en,
      "A parent-run, woman-owned resource guide for Southern Nevada families. Every issue features new local partners, so there's always something you haven't tried yet.",
    );
    assert.equal(first.cta.en, "Visit the directory");
    const c = PARTNERS_COPY.en;
    assert.equal(c.metaTitle, "Partners | Vegas Kiddos");
    assert.equal(
      c.metaDesc,
      "Local Las Vegas family resources we team up with, starting with the Las Vegas Kids' Directory, a parent-run guide for Southern Nevada families.",
    );
    assert.equal(c.ogTitle, "Vegas Kiddos Partners");
    assert.equal(c.h1, "Our partners");
    assert.equal(
      c.intro,
      "Good family stuff in Vegas is scattered all over town. These are the local folks we team up with. They send parents our way, and we send parents theirs.",
    );
    assert.equal(
      `${c.closerPre}${c.closerLink}${c.closerPost}`,
      "Run a Las Vegas family resource and want to swap links? Reach out through our contact page.",
    );
  });

  it("does not use a #1 claim or em dashes", () => {
    for (const text of walk({ PARTNERS, PARTNERS_COPY })) {
      for (const bad of FORBIDDEN) {
        assert.equal(text.includes(bad), false, `found ${JSON.stringify(bad)} in ${text}`);
      }
    }
  });

  it("gives every partner a name, url, and bilingual blurb and CTA", () => {
    assert.ok(PARTNERS.length >= 1);
    for (const p of PARTNERS) {
      assert.ok(p.id);
      assert.ok(p.name);
      assert.match(p.url, /^https:\/\//);
      assert.ok(p.blurb.en && p.blurb.es);
      assert.ok(p.cta.en && p.cta.es);
    }
  });
});
