import Image from "next/image";
import type { KidEvent } from "@/lib/types";
import { artTypeFor } from "@/lib/eventArt";
import { artFrame } from "@/lib/artFrame";

export function EventThumb({ event, priority = false }: { event: KidEvent; priority?: boolean }) {
  if (event.image) {
    // Several art templates are a round vignette on a flat canvas; zoom those
    // so the artwork spans the full card width (see lib/artFrame.ts).
    const { zoom, cx, cy } = artFrame(event.image);
    const r = (n: number) => Math.round(n);
    const img = (
        <Image
          src={event.image}
          alt={event.venue ? `${event.title} — ${event.venue}` : event.title}
          fill
          // The thumb is a 120px-tall strip in a 1–3 column grid; "100vw" pulled
          // 1024–1600px files onto phones for a ~350px slot. Zoomed art is
          // drawn wider than the card, so ask for proportionally more pixels.
          sizes={`(max-width: 640px) ${r(92 * zoom)}vw, (max-width: 1024px) ${r(46 * zoom)}vw, ${r(360 * zoom)}px`}
          className="object-cover transition group-hover:scale-105"
          // The first card on a collection/venue page can be the LCP element;
          // priority preloads it (eager + fetchpriority=high). Every other card
          // uses native lazy loading, so on-screen art starts downloading as
          // soon as the HTML is parsed instead of after window load.
          priority={priority}
          unoptimized={false}
        />
    );
    const art =
      zoom === 1 ? (
        img
      ) : (
        // A 3:2 box (the file's own ratio) zoomed past the card width and
        // centred on the illustration; the card clips the overflow.
        <div
          className="absolute aspect-[3/2]"
          style={{
            width: `${zoom * 100}%`,
            left: `${(0.5 - cx * zoom) * 100}%`,
            top: "50%",
            transform: `translateY(${-cy * 100}%)`,
          }}
        >
          {img}
        </div>
      );
    return (
      <div className="relative h-[120px] w-full overflow-hidden bg-sand">
        {/* Card art is server-rendered with native lazy loading. It used to sit
            behind a client-only "wait for window load" gate, which left every
            card as an empty sand box until all scripts, fonts and analytics had
            finished (5 to 11 s on a throttled phone), so images looked missing. */}
        {art}
      </div>
    );
  }
  const v = artTypeFor(event.title, event.description);
  return (
    <div
      className={`flex h-[120px] w-full items-center justify-center bg-gradient-to-br ${v.gradient}`}
      aria-hidden
    >
      <span className="text-5xl drop-shadow-sm transition group-hover:scale-110">{v.emoji}</span>
    </div>
  );
}
