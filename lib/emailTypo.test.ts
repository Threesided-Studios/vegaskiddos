import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { suggestEmail, hasBadTld, editDistance } from "./emailTypo";

describe("suggestEmail", () => {
  it("fixes one-edit-off gmail typos", () => {
    assert.equal(suggestEmail("test@gmaail.com"), "test@gmail.com");
    assert.equal(suggestEmail("test@gmial.com"), "test@gmail.com");
    assert.equal(suggestEmail("test@gmai.com"), "test@gmail.com");
    assert.equal(suggestEmail("test@gmail.co"), "test@gmail.com");
    assert.equal(suggestEmail("Test@Gmaill.com "), "test@gmail.com");
  });
  it("fixes other providers", () => {
    assert.equal(suggestEmail("a@yaho.com"), "a@yahoo.com");
    assert.equal(suggestEmail("a@hotmial.com"), "a@hotmail.com");
    assert.equal(suggestEmail("a@icloud.cm"), "a@icloud.com");
    assert.equal(suggestEmail("a@cox.ne"), "a@cox.net");
  });
  it("fixes impossible TLDs on any domain", () => {
    assert.equal(suggestEmail("a@gmail.con"), "a@gmail.com");
    assert.equal(suggestEmail("a@gmaail.con"), "a@gmail.com");
    assert.equal(suggestEmail("a@mybiz.cmo"), "a@mybiz.com");
  });
  it("leaves valid and unknown addresses alone", () => {
    for (const ok of ["a@gmail.com", "a@mail.com", "a@gmx.com", "a@teamues.com", "a@seanskottey.com", "a@unlv.edu", "a@me.com"]) {
      assert.equal(suggestEmail(ok), null, ok);
    }
    assert.equal(suggestEmail("not-an-email"), null);
  });
});

describe("hasBadTld", () => {
  it("flags .con/.cmo only", () => {
    assert.equal(hasBadTld("a@gmail.con"), true);
    assert.equal(hasBadTld("a@x.cmo"), true);
    assert.equal(hasBadTld("a@gmail.com"), false);
    assert.equal(hasBadTld("a@x.co"), false);
  });
});

describe("editDistance", () => {
  it("counts transpositions as one edit", () => {
    assert.equal(editDistance("gmial.com", "gmail.com"), 1);
  });
});
