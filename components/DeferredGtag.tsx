"use client";

import { useEffect } from "react";

// gtag.js is ~176 KB and ~300 ms of main-thread work on a mid-range phone.
// The inline init in the layout queues consent + config into dataLayer right
// away; the library itself loads on the visitor's first interaction (tap,
// key, scroll) or 4 s after the page has loaded, whichever comes first, and
// then replays the queue — so the page view is still recorded.
const EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

export function DeferredGtag({ id }: { id: string }) {
  useEffect(() => {
    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
    };
    const cleanup = () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, load));
      window.removeEventListener("load", arm);
      if (timer) clearTimeout(timer);
    };
    const arm = () => { timer = setTimeout(load, 4000); };
    EVENTS.forEach((ev) => window.addEventListener(ev, load, { once: true, passive: true }));
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return cleanup;
  }, [id]);
  return null;
}
