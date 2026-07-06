import { FOOTER, INSTAGRAM_URL } from "@/lib/closing";

/**
 * Minimal footer. No email / no "hire me" (the site's single action is the
 * Instagram follow above) — just the wordmark, the through-line tagline, and a
 * couple of quiet links back into the page.
 */
export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 text-right sm:flex-row-reverse sm:items-center sm:justify-between">
        <div>
          <span className="text-2xl font-extrabold tracking-tight text-ink">
            קים קרול<span className="text-fuchsia">.</span>
          </span>
          <p className="mt-1 text-sm text-ink-muted">{FOOTER.tagline_he}</p>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-ink-muted">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-purple"
          >
            אינסטגרם
          </a>
          <a href="#story" className="transition-colors duration-200 hover:text-purple">
            המסע
          </a>
          <a href="#work" className="transition-colors duration-200 hover:text-purple">
            עבודות
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 text-right text-xs text-ink-muted/70">
        © 2026 קים קרול · נבנה בתנועה.
      </div>
    </footer>
  );
}
