"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AGE_BANDS,
  DEFAULT_FILTERS,
  NEIGHBORHOODS,
  filtersToSearch,
  parseFiltersFromSearch,
  type GuideFilters,
  type GuideHood,
} from "@/lib/fall-guide-data";
import { applyGuideFilters } from "@/lib/fall-guide-filter-dom";
import { FallGuideValleyMap } from "./FallGuideValleyMap";

type FilterCtx = {
  filters: GuideFilters;
  setFilter: <K extends keyof GuideFilters>(key: K, value: GuideFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
};

const FilterContext = createContext<FilterCtx | null>(null);

export function useFallGuideFilters(): FilterCtx {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFallGuideFilters must be used within FallGuideFilterProvider");
  return ctx;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-sm font-700 transition ${
        active
          ? "select-hop halo-coral bg-coral-btn text-white shadow-pop"
          : "bg-white/80 text-ink/70 hover:bg-coral/10"
      }`}
    >
      {children}
    </button>
  );
}

export function FallGuideFilterBar() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useFallGuideFilters();

  return (
    <div
      className="sticky top-2 z-20 mt-6 space-y-4 rounded-blob border border-ink/10 bg-white/95 p-4 shadow-card backdrop-blur-sm"
      aria-label="Guide filters"
    >
      <div>
        <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Age band</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.age === "all"} onClick={() => setFilter("age", "all")}>
            All ages
          </FilterChip>
          {AGE_BANDS.map((b) => (
            <FilterChip
              key={b.id}
              active={filters.age === b.id}
              onClick={() => setFilter("age", b.id)}
            >
              {b.emoji} {b.label}
            </FilterChip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Price</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.price === "all"} onClick={() => setFilter("price", "all")}>
            All
          </FilterChip>
          <FilterChip active={filters.price === "free"} onClick={() => setFilter("price", "free")}>
            🆓 Free / free entry
          </FilterChip>
          <FilterChip active={filters.price === "paid"} onClick={() => setFilter("price", "paid")}>
            💳 Paid
          </FilterChip>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-800 uppercase tracking-wide text-ink/50">Neighborhood</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.hood === "all"} onClick={() => setFilter("hood", "all")}>
            All valley
          </FilterChip>
          {NEIGHBORHOODS.map((n) => (
            <FilterChip
              key={n.id}
              active={filters.hood === n.id}
              onClick={() => setFilter("hood", n.id)}
            >
              {n.emoji} {n.title.split(" / ")[0]}
            </FilterChip>
          ))}
        </div>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-700 text-teal-btn hover:underline"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
}

export function FallGuideFilterEmpty() {
  const { resetFilters } = useFallGuideFilters();
  return (
    <div
      data-guide-empty
      className="hidden rounded-blob border border-dashed border-ink/20 bg-white px-5 py-8 text-center text-ink/70"
      aria-live="polite"
    >
      <p className="font-700">Nothing in this combo — widen a filter.</p>
      <button
        type="button"
        onClick={resetFilters}
        className="mt-3 rounded-full bg-coral-btn px-4 py-2 text-sm font-800 text-white shadow-pop"
      >
        Reset filters
      </button>
    </div>
  );
}

export function FallGuideNeighborhoodMap() {
  const { filters, setFilter } = useFallGuideFilters();
  return (
    <FallGuideValleyMap
      activeHood={filters.hood}
      onSelectHood={(hood: GuideHood | "all") => setFilter("hood", hood)}
    />
  );
}

export function FallGuideFilterProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GuideFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setFilters(parseFiltersFromSearch(new URLSearchParams(window.location.search)));
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    applyGuideFilters(rootRef.current, filters);
    const url = filtersToSearch(filters);
    window.history.replaceState(null, "", `${window.location.pathname}${url}`);
  }, [filters]);

  const setFilter = useCallback(<K extends keyof GuideFilters>(key: K, value: GuideFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActiveFilters =
    filters.age !== "all" || filters.price !== "all" || filters.hood !== "all";

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, hasActiveFilters }}>
      <div ref={rootRef}>{children}</div>
    </FilterContext.Provider>
  );
}
