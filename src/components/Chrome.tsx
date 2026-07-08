"use client";

import { useLang } from "@/lib/i18n";

/** Fixed top-of-page chrome: the skip-to-content link and the he/en toggle.
 *  Both live in one client component so they can read the current language. */
export default function Chrome() {
  const { t, lang, toggle } = useLang();
  return (
    <>
      <a href="#main-content" className="skip-link">
        {t.ui.skip}
      </a>

      <button
        type="button"
        onClick={toggle}
        aria-label={lang === "he" ? "Switch to English" : "עבור לעברית"}
        className="fixed left-4 top-4 z-[60] inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-full border border-black/10 bg-white/70 px-3 text-sm font-bold text-ink backdrop-blur-md transition-colors duration-200 hover:border-purple hover:text-purple sm:left-6 sm:top-6"
      >
        {t.ui.toLang}
      </button>
    </>
  );
}
