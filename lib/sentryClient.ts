import { sentryOptions } from "../sentry.shared";

// The browser Sentry SDK is ~60 KB of JS that used to load, parse and run on
// every page before anything was interactive. It's only needed once something
// actually goes wrong, so it is imported on the first error instead
// (instrumentation-client.ts buffers anything thrown before then).
type SentryModule = typeof import("@sentry/nextjs");
let loading: Promise<SentryModule> | null = null;
let ready = false;

// Once init() has run, the SDK's own global handlers report uncaught errors.
export function sentryReady(): boolean {
  return ready;
}

export function loadSentry(): Promise<SentryModule> {
  if (!loading) {
    loading = import("@sentry/nextjs").then((S) => {
      S.init(sentryOptions);
      ready = true;
      return S;
    });
    loading.catch(() => { loading = null; });
  }
  return loading;
}

export function captureException(err: unknown): void {
  loadSentry().then((S) => S.captureException(err)).catch(() => {});
}
