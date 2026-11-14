import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyPrice } from "./classify";

test("plain free text is free", () => {
  assert.equal(classifyPrice(null, "Free admission and open to the public"), "free");
  assert.equal(classifyPrice("Free", "Library storytime"), "free");
});

test("a missing cost with no free language stays unknown", () => {
  assert.equal(classifyPrice(null, "Join us at the park for family fun"), null);
  assert.equal(classifyPrice("", "A concert at the lawn"), null);
});

test("paid admission wins even when part of the audience is free", () => {
  assert.equal(
    classifyPrice(null, "Admission: $3 per person; FREE for children under 2 and seniors 65+"),
    "under10",
  );
  assert.equal(
    classifyPrice(null, "Admission: $18 Monday-Thursday | $22 Friday-Sunday"),
    "mid",
  );
  assert.equal(
    classifyPrice(null, "Photo Packages: Starting at $39.99. Reservations required."),
    "premium",
  );
  assert.equal(classifyPrice(null, "NERF MANIA (AGES 5+) | $5 PER PERSON"), "under10");
});

test("dollar amounts without an admission cue still classify from the amount", () => {
  assert.equal(classifyPrice("$17 per dancer", "Nutcracker Tea Party"), "mid");
});
