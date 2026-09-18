import { matchesFilters, type GuideFilters } from "./fall-guide-data";

function tokenSet(value: string | null): string[] {
  return value?.split(/\s+/).filter(Boolean) ?? [];
}

function itemMatches(el: Element, filters: GuideFilters): boolean {
  const ages = tokenSet(el.getAttribute("data-age"));
  const price = el.getAttribute("data-price");
  const hoods = tokenSet(el.getAttribute("data-hood"));
  if (!ages.length || (price !== "free" && price !== "paid") || !hoods.length) return true;
  return matchesFilters(
    { ages: ages as ("toddler" | "kids" | "tweens")[], price, hoods: hoods as ("north" | "west" | "central" | "henderson" | "downtown")[] },
    filters,
  );
}

function hasActiveFilters(filters: GuideFilters): boolean {
  return filters.age !== "all" || filters.price !== "all" || filters.hood !== "all";
}

/** Client-only: toggle visibility of pre-rendered guide nodes from filter state. */
export function applyGuideFilters(root: HTMLElement, filters: GuideFilters): void {
  const active = hasActiveFilters(filters);

  root.querySelectorAll<HTMLElement>("[data-guide-item]").forEach((el) => {
    const show = !active || itemMatches(el, filters);
    el.classList.toggle("hidden", !show);
    el.setAttribute("aria-hidden", show ? "false" : "true");
  });

  root.querySelectorAll<HTMLElement>("[data-guide-age-band]").forEach((el) => {
    const band = el.getAttribute("data-guide-age-band");
    let show = true;
    if (filters.age !== "all" && band !== filters.age) show = false;
    if (band === "toddler" && filters.price === "paid") show = false;
    if (show && active && (band === "kids" || band === "tweens")) {
      const anyVisible = Array.from(el.querySelectorAll<HTMLElement>("[data-guide-item]")).some(
        (child) => !child.classList.contains("hidden"),
      );
      if (!anyVisible) show = false;
    }
    el.classList.toggle("hidden", !show);
  });

  root.querySelectorAll<HTMLElement>("[data-guide-hood-block]").forEach((el) => {
    const hood = el.getAttribute("data-guide-hood-block");
    const show = filters.hood === "all" || hood === filters.hood;
    el.classList.toggle("hidden", !show);
  });

  root.querySelectorAll<HTMLElement>("[data-guide-price-col]").forEach((el) => {
    const col = el.getAttribute("data-guide-price-col");
    const show = filters.price === "all" || col === filters.price;
    el.classList.toggle("hidden", !show);
  });

  root.querySelectorAll<HTMLElement>("[data-guide-match-required]").forEach((el) => {
    if (!active) {
      el.classList.remove("hidden");
      return;
    }
    const anyVisible = Array.from(el.querySelectorAll<HTMLElement>("[data-guide-item]")).some(
      (child) => !child.classList.contains("hidden"),
    );
    el.classList.toggle("hidden", !anyVisible);
  });

  const emptyEl = root.querySelector<HTMLElement>("[data-guide-empty]");
  if (emptyEl) {
    const anyVisible = Array.from(root.querySelectorAll<HTMLElement>("[data-guide-item]")).some(
      (child) => !child.classList.contains("hidden"),
    );
    emptyEl.classList.toggle("hidden", !active || anyVisible);
  }
}
