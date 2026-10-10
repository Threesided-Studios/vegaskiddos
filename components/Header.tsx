import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";

// Shared pill style for header links: ≥44px tall tap targets.
const NAV_LINK =
  "inline-flex min-h-[44px] items-center rounded-full px-3 text-ink/70 transition hover:bg-white hover:text-ink";

// Phones: the old single row (logo + six controls) needed ~516px, so on a
// 360–414px screen it pushed the page wider than the viewport (sideways
// scrolling). Now the sticky bar keeps only the logo, My List and "Add", and
// the secondary links get their own wrapping row underneath that scrolls away.
export function Header({ lang = "en" }: { lang?: Lang }) {
  return (
    <>
      <header className="sticky top-0 z-[1000] border-b-2 border-ink/10 bg-white/85 shadow-[0_4px_20px_-8px_rgba(45,42,50,0.25)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:py-3.5">
          <Link href="/" className="flex min-h-[44px] min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="animate-wiggle text-2xl sm:text-4xl">🌵</span>
            <span className="whitespace-nowrap font-display text-[1.55rem] font-700 leading-none sm:text-4xl">
              <span className="text-coral-dark">Vegas</span>{" "}
              <span className="text-teal-btn">Kiddos</span>
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-1 text-sm font-700 sm:gap-2">
            <Link href="/" className={`${NAV_LINK} hidden sm:inline-flex`}>
              {t(lang, "nav_events")}
            </Link>
            <Link href="/features" className={`${NAV_LINK} hidden sm:inline-flex`}>
              {t(lang, "nav_ideas")}
            </Link>
            <Link href="/about" className={`${NAV_LINK} hidden sm:inline-flex`}>
              {t(lang, "nav_about")}
            </Link>
            <Link href="/my-list" aria-label="My saved list" className={`${NAV_LINK} min-w-[44px] justify-center px-2`}>
              ❤️
            </Link>
            <div className="hidden sm:block">
              <LangToggle lang={lang} />
            </div>
            <Link
              href="/donate"
              aria-label={t(lang, "nav_donate")}
              className="hover-pop hidden min-h-[44px] items-center whitespace-nowrap rounded-full bg-sunny px-4 text-ink shadow-pop ring-1 ring-coral/30 transition hover:bg-sunny-dark sm:inline-flex"
            >
              <span className="font-800">🧃 {t(lang, "nav_donate")}</span>
            </Link>
            <Link
              href="/submit"
              className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-coral-btn px-4 text-white shadow-pop transition hover:bg-coral-btnHover"
            >
              <span className="sm:hidden">{t(lang, "nav_add_short")}</span>
              <span className="hidden sm:inline">{t(lang, "nav_add")}</span>
            </Link>
          </nav>
        </div>
      </header>
      <nav
        aria-label="Site"
        className="border-b border-ink/10 bg-white/60 text-sm font-700 sm:hidden"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-1 gap-y-1 px-3 py-1.5">
          <Link href="/" className={NAV_LINK}>{t(lang, "nav_events")}</Link>
          <Link href="/features" className={NAV_LINK}>{t(lang, "nav_ideas")}</Link>
          <Link href="/about" className={NAV_LINK}>{t(lang, "nav_about")}</Link>
          <LangToggle lang={lang} />
          <Link
            href="/donate"
            aria-label={t(lang, "nav_donate")}
            className="ml-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-sunny px-3 text-ink shadow-pop ring-1 ring-coral/30"
          >
            🧃
          </Link>
        </div>
      </nav>
    </>
  );
}
