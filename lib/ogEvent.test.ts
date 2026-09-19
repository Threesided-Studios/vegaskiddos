import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  eventOgImagePath,
  eventOgImageUrl,
  eventOgImageMeta,
  socialCardUrl,
  OG_IMAGE_SIZE,
} from "./ogEvent";

describe("ogEvent", () => {
  it("builds canonical English OG paths and URLs", () => {
    assert.equal(eventOgImagePath("recABC123"), "/event/recABC123/opengraph-image");
    assert.equal(eventOgImageUrl("recABC123"), "https://vegaskiddos.com/event/recABC123/opengraph-image");
  });

  it("builds Spanish OG paths", () => {
    assert.equal(eventOgImagePath("recABC123", "es"), "/es/event/recABC123/opengraph-image");
  });

  it("returns metadata with PNG dimensions", () => {
    const meta = eventOgImageMeta("recXYZ");
    assert.equal(meta.type, "image/png");
    assert.equal(meta.width, OG_IMAGE_SIZE.width);
    assert.equal(meta.height, OG_IMAGE_SIZE.height);
    assert.match(meta.url, /\/event\/recXYZ\/opengraph-image$/);
  });

  it("builds social card CDN URLs with cache-bust", () => {
    assert.match(socialCardUrl("recABC"), /img\.vegaskiddos\.com\/social\/recABC\/1200\.jpg\?v=/);
  });
});
