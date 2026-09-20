import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  eventOgImageUrl,
  eventPageUrl,
  isDedicatedOgUrl,
  scrapedOgImage,
  validateOgBody,
  MIN_OG_BYTES,
} from "./og-image.mjs";

describe("og-image helpers", () => {
  it("builds event page and OG URLs", () => {
    assert.equal(eventPageUrl("recTest123"), "https://vegaskiddos.com/event/recTest123");
    assert.equal(eventOgImageUrl("recTest123"), "https://vegaskiddos.com/event/recTest123/opengraph-image");
  });

  it("recognizes dedicated OG URLs", () => {
    assert.equal(isDedicatedOgUrl("https://vegaskiddos.com/event/recABC/opengraph-image"), true);
    assert.equal(isDedicatedOgUrl("https://img.vegaskiddos.com/type/storytime/1024.webp?v=1"), true);
    assert.equal(isDedicatedOgUrl("https://img.vegaskiddos.com/social/recABC/1200.jpg?v=1"), true);
    assert.equal(isDedicatedOgUrl("https://vegaskiddos.com/opengraph-image"), false);
  });

  it("extracts scraped OG image from Graph API shape", () => {
    const data = { image: [{ url: "https://vegaskiddos.com/event/recX/opengraph-image" }] };
    assert.equal(scrapedOgImage(data), "https://vegaskiddos.com/event/recX/opengraph-image");
  });

  it("rejects tiny or non-image OG bodies", () => {
    assert.equal(validateOgBody("image/png", 50000).ok, true);
    assert.equal(validateOgBody("image/jpeg", MIN_OG_BYTES).ok, true);
    assert.equal(validateOgBody("image/png", 17).ok, false);
    assert.equal(validateOgBody("text/plain", 5000).ok, false);
  });
});
