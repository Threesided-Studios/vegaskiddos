import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePriceTier, priceTier } from "./constants";
import { eventRequiresRegistration } from "./registration";

test("parsePriceTier never treats a missing value as free", () => {
  assert.equal(parsePriceTier(undefined), "unknown");
  assert.equal(parsePriceTier(null), "unknown");
  assert.equal(parsePriceTier(""), "unknown");
  assert.equal(parsePriceTier("   "), "unknown");
  assert.equal(parsePriceTier("other"), "unknown");
});

test("parsePriceTier keeps known Airtable values", () => {
  assert.equal(parsePriceTier("free"), "free");
  assert.equal(parsePriceTier("under10"), "under10");
  assert.equal(parsePriceTier("mid"), "mid");
  assert.equal(parsePriceTier("premium"), "premium");
});

test("priceTier has a safe fallback for unknown", () => {
  assert.equal(priceTier("unknown").id, "unknown");
  assert.equal(priceTier("unknown").label, "See venue");
  assert.equal(priceTier("free").id, "free");
});

test("eventRequiresRegistration catches common signup language", () => {
  assert.equal(eventRequiresRegistration({ title: "Storytime", description: "Registration required. Check in at the desk.", priceText: "Free" }), true);
  assert.equal(eventRequiresRegistration({ title: "Clay", description: "This is a ticketed event.", priceText: "Free" }), true);
  assert.equal(eventRequiresRegistration({ title: "Parade", description: "Admission: FREE!", priceText: "Free" }), false);
});
