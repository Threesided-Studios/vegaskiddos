import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// R2-backed incremental cache: ISR/SSR responses persist across deploys in the
// vegaskiddos-cache bucket (bound as NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc).
// Critical for cost/CPU: without it, every request is a full SSR re-render,
// which spiked CPU and triggered error 1102 during cutover attempt #1.
//
// Queue: Next 16 no longer regenerates stale ISR pages by itself in minimal
// mode; it hands them to OpenNext's revalidation queue. With the default
// "dummy" queue every page stayed STALE forever (verified on a Next 16 preview
// version: Next 15 flipped STALE -> HIT, Next 16 never did). The memory queue
// re-requests the stale route through the WORKER_SELF_REFERENCE service
// binding (wrangler.jsonc), de-duped per isolate.
export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache, queue: memoryQueue });
