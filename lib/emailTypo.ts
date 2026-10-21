// Catches common email-domain typos at signup (e.g. "gmaail.com", "gmial.com",
// "gmail.con") so a mistyped address doesn't silently bounce every week.
// Pure + dependency-free so it runs in the browser (suggestion) and on the
// server (rejecting impossible TLDs like .con / .cmo).

// Domains we suggest toward, in priority order (ties go to the earlier one).
const COMMON = [
  "gmail.com", "yahoo.com", "icloud.com", "hotmail.com", "outlook.com",
  "aol.com", "cox.net", "live.com", "msn.com", "me.com", "comcast.net",
  "att.net", "sbcglobal.net", "ymail.com", "protonmail.com", "proton.me",
];

// Real domains that sit one edit away from a COMMON one; never "correct" these.
const KNOWN_OK = new Set([
  ...COMMON, "mail.com", "gmx.com", "gmx.net", "email.com", "aim.com", "mac.com",
  "live.net", "yahoo.co.uk", "hotmail.co.uk", "googlemail.com", "rocketmail.com",
]);

// TLD typos that are never real: always meant ".com".
const BAD_TLDS: Record<string, string> = {
  con: "com", cmo: "com", cpm: "com", xom: "com", vom: "com", comm: "com", ocm: "com", cim: "com",
};

/** Optimal-string-alignment distance (Levenshtein + adjacent transpositions). */
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** True when the address ends in a TLD that cannot exist (".con", ".cmo", …). */
export function hasBadTld(email: string): boolean {
  const tld = email.trim().toLowerCase().split(".").pop() || "";
  return email.includes("@") && tld in BAD_TLDS;
}

/**
 * Returns a corrected address when the domain looks like a typo of a common
 * provider or ends in an impossible TLD; otherwise null.
 */
export function suggestEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const local = email.slice(0, at);
  let domain = email.slice(at + 1);
  if (KNOWN_OK.has(domain)) return null;

  // 1) Fix an impossible TLD first (gmaail.con -> gmaail.com).
  const dot = domain.lastIndexOf(".");
  if (dot > 0) {
    const tld = domain.slice(dot + 1);
    if (tld in BAD_TLDS) domain = `${domain.slice(0, dot)}.${BAD_TLDS[tld]}`;
  }
  // 2) Snap to a common provider that is one edit away (gmaail/gmial/gmai.com…).
  if (!KNOWN_OK.has(domain)) {
    let best: string | null = null;
    for (const c of COMMON) {
      if (editDistance(domain, c) === 1) { best = c; break; }
    }
    if (!best && !domain.includes(".")) {
      // "gmail" / "gmailcom" with no dot at all.
      best = COMMON.find((c) => c.replace(".", "") === domain || c.split(".")[0] === domain) || null;
    }
    if (best) domain = best;
  }
  const fixed = `${local}@${domain}`;
  return fixed === email ? null : fixed;
}
