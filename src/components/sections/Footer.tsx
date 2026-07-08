"use client";

import { useLang } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/closing";

/** Minimal footer. No email / no "hire me" (the site's single action is the
 *  Instagram follow above) — just the wordmark, the tagline, and quiet links. */
export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-black/[0.06] bg-white py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 text-start sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-2xl font-extrabold tracking-tight text-ink">
            {t.hero.wordmark}
            <span className="text-fuchsia">.</span>
          </span>
          <p className="mt-1 text-sm text-ink-muted">{t.footer.tagline}</p>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-ink-muted">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-purple"
          >
            {t.footer.links.instagram}
          </a>
          <a href="#story" className="transition-colors duration-200 hover:text-purple">
            {t.footer.links.story}
          </a>
          <a href="#work" className="transition-colors duration-200 hover:text-purple">
            {t.footer.links.work}
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 text-start text-xs text-ink-muted/70">
        {t.footer.copyright}
      </div>
    </footer>
  );
}
