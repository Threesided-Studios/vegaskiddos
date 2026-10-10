import { captureException, sentryReady } from './lib/sentryClient';

// Lazy Sentry: listen for uncaught errors / rejections ourselves and pull in
// the SDK only when one happens (see lib/sentryClient.ts). Cross-origin
// "Script error." events carry no error object and are skipped, as the SDK
// would drop them anyway.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.error && !sentryReady()) captureException(e.error);
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (!sentryReady()) captureException(e.reason);
  });
}
