"use client";

import { useEffect, useState } from "react";

// Renders its children only once the window `load` event has fired. Used for
// below-the-fold card art so those image downloads don't compete with the
// first paint / LCP on slow phones (Chrome's lazy-load distance is ~1250 px,
// so plain loading="lazy" still fetched the "this week" strip up front).
export function AfterLoad({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.readyState === "complete") { setReady(true); return; }
    const on = () => setReady(true);
    window.addEventListener("load", on, { once: true });
    return () => window.removeEventListener("load", on);
  }, []);
  return ready ? <>{children}</> : null;
}
