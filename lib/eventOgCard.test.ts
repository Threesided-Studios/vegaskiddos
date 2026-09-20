import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { eventOgImageResponse } from "./eventOgCard";
import { MIN_OG_BYTES } from "./ogEvent";
import { ogStaticFallbackBytes, staticOgFallbackResponse } from "./ogStaticFallback";
import type { KidEvent } from "./types";

const sampleEvent = {
  id: "recTest12345",
  title: "Storytime at the Library",
  description: "Books and songs for kids",
  venue: "Centennial Hills Library",
  address: "",
  neighborhood: "north-lv",
  lat: 0,
  lng: 0,
  start: "2026-01-01T10:00:00",
  ageTiers: ["kids"],
  priceTier: "free",
  source: "Library",
} satisfies KidEvent;

describe("eventOgCard", () => {
  it("static fallback PNG is large enough for OG validators", () => {
    assert.ok(ogStaticFallbackBytes().byteLength >= MIN_OG_BYTES);
  });

  it("staticOgFallbackResponse always returns image/png", () => {
    const res = staticOgFallbackResponse();
    assert.equal(res.headers.get("Content-Type"), "image/png");
    assert.ok(res.headers.get("Cache-Control")?.includes("immutable"));
  });

  it("eventOgImageResponse materializes bytes (no pipe-time 500)", async () => {
    const res = await eventOgImageResponse(sampleEvent);
    assert.equal(res.headers.get("Content-Type"), "image/png");
    const buf = await res.arrayBuffer();
    assert.ok(buf.byteLength >= MIN_OG_BYTES);
  });

  it("eventOgImageResponse handles null event", async () => {
    const res = await eventOgImageResponse(null);
    const buf = await res.arrayBuffer();
    assert.ok(buf.byteLength >= MIN_OG_BYTES);
  });
});
