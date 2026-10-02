// Local + CI runner: `node lib/scrape/cli.ts --dry` (preview) or
// `node lib/scrape/cli.ts` (live insert). In CI this is `npm run scrape`.
import { runScrape } from "./run";
import { evaluateScrapeHealth } from "./health";

const dryRun = process.argv.includes("--dry");

runScrape({ dryRun })
  .then((s) => {
    console.log(JSON.stringify(s, null, 2));

    // Per-source health line, easy to scan in CI logs.
    console.log("\nSource health:");
    for (const src of s.sources) {
      const flag = src.errors.length ? "ERROR" : src.found === 0 ? "ZERO " : "ok   ";
      console.log(`  [${flag}] ${src.source}: ${src.found}${src.errors.length ? ` — ${src.errors.join("; ")}` : ""}`);
    }

    const { deadCore, hardErrors, softErrors, shouldFail } = evaluateScrapeHealth(s.sources);

    if (softErrors.length) {
      console.warn(
        `\n⚠️  SOFT SOURCE ERRORS (nightly continues): ${softErrors.map((x) => x.source).join(", ")}`,
      );
    }
    if (deadCore.length) {
      console.error(`\n❌ CORE SOURCE RETURNED ZERO: ${deadCore.map((x) => x.source).join(", ")}`);
    }
    if (hardErrors.length) {
      console.error(`❌ SOURCE ERRORS: ${hardErrors.map((x) => x.source).join(", ")}`);
    }

    if (shouldFail && !dryRun) process.exit(1);
    process.exit(0);
  })
  .catch((err) => {
    console.error("SCRAPE FAILED:", err);
    process.exit(1);
  });
