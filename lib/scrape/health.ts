/** Per-source row from a scrape run summary (cli / CI health gate). */
export interface SourceHealthRow {
  source: string;
  found: number;
  errors: string[];
}

// High-volume sources that should never legitimately return zero on a *successful*
// fetch. If one does (no adapter errors), something upstream broke — fail the run.
const CORE_SOURCES = new Set([
  "Family Fun Vegas",
  "Library",
  "Henderson Libraries",
]);

// WAF-blocked or intermittently flaky hosts: log errors, don't fail the nightly job.
// Communico library feeds and Tribe REST endpoints are common 403/HTML-challenge
// victims from GitHub Actions egress.
const SOFT_ERROR_SOURCES = new Set([
  "Vegas Family Guide",
  "Nevada Moms",
  "Library",
  "Henderson Libraries",
]);

export interface ScrapeHealthVerdict {
  deadCore: SourceHealthRow[];
  hardErrors: SourceHealthRow[];
  softErrors: SourceHealthRow[];
  shouldFail: boolean;
}

/** Decide whether a completed scrape should fail CI (live runs only). */
export function evaluateScrapeHealth(sources: SourceHealthRow[]): ScrapeHealthVerdict {
  const errored = sources.filter((x) => x.errors.length > 0);
  // Fetch failed (errors present) ≠ feed went dark — don't treat WAF/HTTP blips as zero.
  const deadCore = sources.filter(
    (x) => CORE_SOURCES.has(x.source) && x.found === 0 && x.errors.length === 0,
  );
  const softErrors = errored.filter((x) => SOFT_ERROR_SOURCES.has(x.source));
  const hardErrors = errored.filter((x) => !SOFT_ERROR_SOURCES.has(x.source));
  return {
    deadCore,
    hardErrors,
    softErrors,
    shouldFail: deadCore.length > 0 || hardErrors.length > 0,
  };
}
