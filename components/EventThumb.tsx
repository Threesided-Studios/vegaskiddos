import Image from "next/image";
import type { KidEvent } from "@/lib/types";
import { artTypeFor } from "@/lib/eventArt";
import { AfterLoad } from "./AfterLoad";

export function EventThumb({ event, priority = false }: { event: KidEvent; priority?: boolean }) {
  if (event.image) {
    const img = (
        <Image
          src={event.image}
          alt={event.venue ? `${event.title} — ${event.venue}` : event.title}
          fill
          // The thumb is a 120px-tall strip in a 1–3 column grid; "100vw" pulled
          // 1024–1600px files onto phones for a ~350px slot.
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
          className="object-cover transition group-hover:scale-105"
          // The first card on a collection/venue page can be the LCP element;
          // priority preloads it instead of lazy-loading the thing on screen.
          priority={priority}
          unoptimized={false}
        />
    );
    return (
      <div className="relative h-[120px] w-full overflow-hidden bg-sand">
        {/* Priority thumbs (possible LCP) render immediately; the rest wait
            for window load so they never delay the first screen. */}
        {priority ? img : <AfterLoad>{img}</AfterLoad>}
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
