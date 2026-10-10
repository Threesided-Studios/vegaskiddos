"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Thin progress bar at the top of the page while a tapped link loads, plus a
// dimmed "pending" look on the link itself. App Router navigations give no
// built-in feedback, so on a slow phone connection a tap looked like it did
// nothing. Starts on any same-origin link click (or a "vk-nav-start" event for
// router.push calls) and finishes when the pathname changes.
export function startNavProgress() {
  window.dispatchEvent(new Event("vk-nav-start"));
}

export function NavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const failsafe = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    document.querySelectorAll("a[data-pending]").forEach((a) => a.removeAttribute("data-pending"));
    setState((s) => (s === "loading" ? "done" : s));
    const t = setTimeout(() => setState((s) => (s === "done" ? "idle" : s)), 450);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const start = () => {
      setState("loading");
      clearTimeout(failsafe.current);
      // Never leave the bar hanging (offline, aborted navigation, etc.).
      failsafe.current = setTimeout(() => {
        document.querySelectorAll("a[data-pending]").forEach((a) => a.removeAttribute("data-pending"));
        setState("idle");
      }, 12000);
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      // Let the click's own handlers (e.g. the heart button inside a card) run
      // first; only start if the navigation wasn't cancelled.
      setTimeout(() => {
        if (e.defaultPrevented) return;
        a.setAttribute("data-pending", "");
        start();
      }, 0);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("vk-nav-start", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("vk-nav-start", start);
      clearTimeout(failsafe.current);
    };
  }, []);

  return <div className="nav-progress" data-state={state} role="progressbar" aria-hidden={state === "idle"} aria-label="Loading page" />;
}
