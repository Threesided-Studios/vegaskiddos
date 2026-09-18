"use client";

import type { GuideHood } from "@/lib/fall-guide-data";

const ZONES: {
  id: GuideHood;
  label: string;
  path: string;
  cx: number;
  cy: number;
}[] = [
  {
    id: "north",
    label: "North LV",
    path: "M 120 20 L 280 20 L 300 90 L 140 100 Z",
    cx: 200,
    cy: 55,
  },
  {
    id: "west",
    label: "West",
    path: "M 20 100 L 110 90 L 120 200 L 30 210 Z",
    cx: 70,
    cy: 150,
  },
  {
    id: "central",
    label: "Central",
    path: "M 130 95 L 270 85 L 280 175 L 140 185 Z",
    cx: 205,
    cy: 135,
  },
  {
    id: "henderson",
    label: "Henderson",
    path: "M 150 190 L 290 180 L 300 270 L 160 280 Z",
    cx: 225,
    cy: 235,
  },
  {
    id: "downtown",
    label: "Downtown",
    path: "M 40 215 L 130 205 L 140 275 L 50 285 Z",
    cx: 90,
    cy: 245,
  },
];

export function FallGuideValleyMap({
  activeHood,
  onSelectHood,
}: {
  activeHood: GuideHood | "all";
  onSelectHood: (hood: GuideHood | "all") => void;
}) {
  return (
    <div className="rounded-blob border border-ink/10 bg-white/80 p-4 shadow-card">
      <p className="mb-3 text-center text-sm font-700 text-ink/70">
        Tap a zone to filter by neighborhood
      </p>
      <svg
        viewBox="0 0 320 300"
        className="mx-auto w-full max-w-sm"
        role="img"
        aria-label="Las Vegas valley neighborhood map"
      >
        <defs>
          <linearGradient id="valley-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8EE" />
            <stop offset="100%" stopColor="#FDEFE0" />
          </linearGradient>
        </defs>
        <rect width="320" height="300" rx="24" fill="url(#valley-bg)" />
        {ZONES.map((z) => {
          const active = activeHood === z.id;
          return (
            <g key={z.id}>
              <path
                d={z.path}
                className={`cursor-pointer transition-all ${
                  active
                    ? "fill-sunny/70 stroke-coral-btn"
                    : "fill-teal/15 stroke-teal/40 hover:fill-teal/30"
                }`}
                strokeWidth={active ? 3 : 2}
                onClick={() => onSelectHood(active ? "all" : z.id)}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={`${z.label} neighborhood`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectHood(active ? "all" : z.id);
                  }
                }}
              />
              <text
                x={z.cx}
                y={z.cy}
                textAnchor="middle"
                className="pointer-events-none select-none fill-ink text-[11px] font-bold"
                style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif" }}
              >
                {z.label}
              </text>
            </g>
          );
        })}
      </svg>
      {activeHood !== "all" && (
        <button
          type="button"
          onClick={() => onSelectHood("all")}
          className="mt-3 w-full text-center text-sm font-700 text-teal-btn hover:underline"
        >
          Show all neighborhoods
        </button>
      )}
    </div>
  );
}
