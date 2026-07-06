import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System — קים קרול",
};

function Swatch({
  name,
  role,
  hex,
  className,
  ring,
}: {
  name: string;
  role: string;
  hex: string;
  className: string;
  ring?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-24 w-full rounded-2xl ${className} ${
          ring ? "ring-1 ring-inset ring-ink/10" : ""
        }`}
      />
      <div>
        <div className="text-sm font-semibold text-ink">{name}</div>
        <div className="text-xs text-ink-muted">{role}</div>
        <div className="mt-0.5 font-mono text-xs text-ink-muted">{hex}</div>
      </div>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-16 sm:px-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-purple">
          Design System
        </p>
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[1.02] tracking-tightest text-ink">
          לבן. סגול. <span className="text-fuchsia">נגיעה</span> של פוקסיה.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          האתר לבן לגמרי. סגול הוא הצבע המשני, ופוקסיה היא נגיעת ה-accent —
          מופיעה רק בנקודות ספציפיות, לעולם לא ממלאת.
        </p>

        {/* palette */}
        <section className="mt-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
            פלטה
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <Swatch name="Canvas" role="Primary · רקע" hex="#FFFFFF" className="bg-canvas" ring />
            <Swatch name="Surface" role="משטח עדין" hex="#F7F5FA" className="bg-surface" ring />
            <Swatch name="Ink" role="טקסט" hex="#0A0A0A" className="bg-ink" />
            <Swatch name="Ink muted" role="טקסט משני" hex="#6B6B72" className="bg-ink-muted" />
            <Swatch name="Purple" role="Secondary" hex="#6B3FA0" className="bg-purple" />
            <Swatch name="Purple deep" role="Secondary · עומק" hex="#4E2C77" className="bg-purple-deep" />
            <Swatch name="Purple soft" role="Secondary · רך" hex="#8A5FBE" className="bg-purple-soft" />
            <Swatch name="Fuchsia" role="Accent · נגיעות" hex="#E11D8B" className="bg-fuchsia" />
          </div>

          {/* pearlescent */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="h-20 w-full rounded-2xl bg-pearl" />
            <div className="text-sm font-semibold text-ink">
              Pearlescent <span className="font-normal text-ink-muted">— גרדיאנט סגול→פוקסיה, לרגעים נדירים בלבד</span>
            </div>
          </div>
        </section>

        {/* typography */}
        <section className="mt-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
            טיפוגרפיה · Heebo
          </h2>
          <div className="space-y-4 border-t border-ink/10 pt-6">
            <p className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tightest text-ink">
              כותרת ראשית
            </p>
            <p className="text-3xl font-bold text-ink">כותרת משנה</p>
            <p className="text-xl font-medium text-ink">כותרת קטנה</p>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
              גוף טקסט — נקי, אוורירי, עם line-height נדיב. כל מה שצריך מודגש נעשה
              עם <span className="font-semibold text-purple">סגול</span> או נגיעת{" "}
              <span className="font-semibold text-fuchsia">פוקסיה</span>.
            </p>
            <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
              Eyebrow / Label
            </p>
          </div>
        </section>

        {/* elements */}
        <section className="mt-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
            אלמנטים
          </h2>
          <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
            {/* primary purple button */}
            <button className="rounded-full bg-purple px-7 py-3 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(107,63,160,0.6)] transition-colors hover:bg-purple-deep">
              כפתור ראשי
            </button>
            {/* secondary outline */}
            <button className="rounded-full border border-ink/15 px-7 py-3 text-base font-semibold text-ink transition-colors hover:border-purple hover:text-purple">
              כפתור משני
            </button>
            {/* fuchsia splash link */}
            <a className="group inline-flex items-center gap-2 text-base font-medium text-ink">
              <span className="h-2 w-2 rounded-full bg-fuchsia" />
              קישור עם נגיעת פוקסיה
            </a>
          </div>

          {/* card on surface + accent underline */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-surface p-7">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-purple">
                כרטיס
              </span>
              <h3 className="mt-3 text-2xl font-bold text-ink">
                כותרת
                <span className="relative mr-2 inline-block">
                  מודגשת
                  <span className="absolute -bottom-1 right-0 h-[3px] w-full rounded bg-fuchsia" />
                </span>
              </h3>
              <p className="mt-3 leading-relaxed text-ink-muted">
                משטח עדין על רקע לבן, עם קו תחתון בפוקסיה כנקודת accent.
              </p>
            </div>

            <div className="flex items-center justify-center rounded-3xl border border-ink/10 p-7">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-pearl text-white">
                  ✦
                </div>
                <p className="text-sm text-ink-muted">
                  אלמנט pearlescent — נדיר, ל-wow נקודתי
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
