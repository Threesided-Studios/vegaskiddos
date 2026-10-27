import type { ComponentType } from "react";
import { FallHalloweenGuide2026 } from "@/components/guides/FallHalloweenGuide2026";
import { HolidayGuide2026 } from "@/components/guides/HolidayGuide2026";

// Map guide slugs to their body components. Add new guides here.
const GUIDE_CONTENT: Record<string, ComponentType> = {
  "fall-halloween-guide-2026": FallHalloweenGuide2026,
  "holiday-guide-2026": HolidayGuide2026,
};

export function getGuideContent(slug: string): ComponentType | undefined {
  return GUIDE_CONTENT[slug];
}
