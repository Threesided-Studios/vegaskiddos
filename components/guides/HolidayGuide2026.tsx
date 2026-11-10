import type { Lang } from "@/lib/i18n";
import { FallGuideFilterProvider } from "./FallGuideFilterProvider";
import { HolidayGuideBody } from "./HolidayGuideBody";

/** Server shell: full guide body SSR'd; filters hydrate via the shared client island. */
export function HolidayGuide2026({ lang = "en" }: { lang?: Lang }) {
  return (
    <FallGuideFilterProvider>
      <HolidayGuideBody lang={lang} />
    </FallGuideFilterProvider>
  );
}
