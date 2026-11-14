import type { KidEvent } from "./types";

const REGISTRATION_RE =
  /registration required|registration is required|se requiere inscripci[oó]n|this is a ticketed event|reservations required|reservation required|must register|please rsvp|all guests must rsvp/i;

/** True when the listing text says families need to sign up, reserve, or get a ticket. */
export function eventRequiresRegistration(
  event: Pick<KidEvent, "title" | "description" | "priceText">,
): boolean {
  return REGISTRATION_RE.test(
    `${event.title || ""} ${event.priceText || ""} ${event.description || ""}`,
  );
}
