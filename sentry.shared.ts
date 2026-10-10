import type { ErrorEvent, EventHint } from '@sentry/nextjs';
import { isTransientNetworkError, isTransientNetworkErrorMessage } from './lib/networkError';

// `wrangler dev` / `opennextjs-cloudflare preview` run a production build, so
// local testing used to file real issues (VEGASKIDDOS-G, -H came from
// .wrangler/tmp workers on localhost). Drop anything served from a local host.
const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?\//i;

function isLocalEvent(event: ErrorEvent): boolean {
  const url = event.request?.url || "";
  if (LOCAL_HOST.test(url)) return true;
  const frames = event.exception?.values?.[0]?.stacktrace?.frames || [];
  return frames.some((f) => (f.filename || "").includes("/.wrangler/tmp/"));
}

function dropTransientNetworkError(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  if (isLocalEvent(event)) return null;
  if (isTransientNetworkError(hint.originalException)) return null;
  const value = event.exception?.values?.[0]?.value;
  if (isTransientNetworkErrorMessage(value)) return null;
  return event;
}

export const sentryOptions = {
  dsn: 'https://4daa12de854e0c82e6a803bf46355f97@o4511498051715072.ingest.us.sentry.io/4511840204554240',
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  sendDefaultPii: false,
  dataCollection: { userInfo: false, httpBodies: [] },
  tracesSampleRate: 0,
  // Navigating away cancels Next.js's in-flight RSC prefetches, and the aborted
  // body read surfaces as an AbortError thrown inside the framework runtime
  // (Sentry VEGASKIDDOS-3). It is a cancelled request, not a fault. Matched on
  // the browser wording only, so a server-side AbortSignal.timeout in the
  // scrapers ("This operation was aborted") still reports.
  ignoreErrors: [
    'BodyStreamBuffer was aborted',
    'The user aborted a request',
    // Flaky/offline client fetch — Next.js RSC navigation on mobile (VEGASKIDDOS-A).
    'network error',
    'Failed to fetch',
    'Load failed',
    'NetworkError when attempting to fetch resource',
    'Network request failed',
  ],
  beforeSend: dropTransientNetworkError,
};
