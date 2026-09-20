import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  eventOgImagePath,
  eventOgImageUrl,
  eventOgImageMeta,
  socialCardUrl,
  eventArtCdnUrl,
  typeArtCdnUrl,
  ogFallbackArtUrls,
  isValidOgImageBody,
  OG_IMAGE_SIZE,
  MIN_OG_BYTES,
} from "./ogEvent";
import type { KidEvent } from "./types";

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

  it("builds event and type art CDN URLs", () => {
    assert.equal(eventArtCdnUrl("recXYZ", 1600), "https://img.vegaskiddos.com/event/recXYZ/1600.webp");
    assert.equal(eventArtCdnUrl("recXYZ", 1600, "jpg"), "https://img.vegaskiddos.com/event/recXYZ/1600.jpg");
    assert.match(typeArtCdnUrl("storytime", 1600), /type\/storytime\/1600\.webp/);
  });

  it("orders fallback art URLs jpeg-first, event before type", () => {
    const event = {
      id: "recTest12345",
      title: "Storytime at the Library",
      description: "",
      venue: "Centennial Hills",
      address: "",
      neighborhood: "north-lv",
      lat: 0,
      lng: 0,
      start: "2026-01-01T10:00:00",
      ageTiers: ["kids"],
      priceTier: "free",
      source: "Library",
    } satisfies KidEvent;
    const urls = ogFallbackArtUrls(event);
    assert.equal(urls[0], eventArtCdnUrl(event.id, 1600, "jpg"));
    assert.equal(urls[1], eventArtCdnUrl(event.id, 1600, "webp"));
    assert.match(urls[4], /type\/storytime\/1600\.jpg/);
    assert.match(urls[5], /type\/storytime\/1600\.webp/);
  });

  it("validates OG image bodies", () => {
    assert.equal(isValidOgImageBody("image/webp", MIN_OG_BYTES).valueOf(), true);
    assert.equal(isValidOgImageBody("image/png", 50000).valueOf(), true);
    assert.equal(isValidOgImageBody("image/png", 17).valueOf(), false);
    assert.equal(isValidOgImageBody("text/plain", 5000).valueOf(), false);
  });

});
