import { FallGuideFilterProvider } from "./FallGuideFilterProvider";
import { FallHalloweenGuideBody } from "./FallHalloweenGuideBody";

/** Server shell: full guide body SSR'd; filters hydrate via client island. */
export function FallHalloweenGuide2026() {
  return (
    <FallGuideFilterProvider>
      <FallHalloweenGuideBody />
    </FallGuideFilterProvider>
  );
}
