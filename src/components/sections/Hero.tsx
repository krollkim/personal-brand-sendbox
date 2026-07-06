"use client";

import { useRef } from "react";
import HeroOrb from "@/components/hero/HeroOrb";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // The ONLY animation on this section: the portrait gently floats up & down.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const el = q("[data-float]")[0] as HTMLElement | undefined;
        if (!el) return;
        gsap.to(el, {
          y: -16,
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] w-full overflow-hidden bg-canvas"
    >
      {/* minimal top wordmark */}
      <div className="absolute right-6 top-6 z-20 text-sm font-bold tracking-tight text-ink sm:right-10 sm:top-8">
        קים קרול<span className="text-fuchsia">.</span>
      </div>

      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-14 md:py-16">
        {/* text block (right in RTL) */}
        <div className="order-2 text-right md:order-1">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-purple sm:text-sm">
            בונה · יוצר · מלווה · נווד
          </p>

          <h1 className="text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[1.04] tracking-tightest text-ink">
            <span className="block">אני לא נכנס</span>
            <span className="block">
              לקופסה <span className="text-purple">אחת</span>
              <span className="text-fuchsia">.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            קים קרול - בונה, יוצר, ומלווה. לוקח את מה שיש לך בראש, ומוציא אותו
            אל העולם.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="https://www.instagram.com/kroll_k/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-purple px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(107,63,160,0.7)] transition-colors duration-300 hover:bg-purple-deep"
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5.4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
              עקוב אחרי המסע
            </a>
            <a
              href="#hats"
              className="group inline-flex items-center gap-2 text-base font-medium text-ink transition-colors duration-300 hover:text-purple"
            >
              מה אני עושה
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            </a>
          </div>
        </div>

        {/* portrait (left in RTL) - dissolves into a grey→white radial (matched
            to the photo's own grey bg) so it reads cut-out on the white section,
            with scattered accent dots. Only the portrait floats (up/down). */}
        <div className="relative order-1 flex justify-center md:order-2 md:justify-end">
          <div className="relative aspect-square w-[min(460px,86vw)]">
            {/* accent dots - scattered asymmetrically, varied distance & size */}
            <span aria-hidden="true" className="absolute left-[61%] top-[4%] z-10 h-1.5 w-1.5 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[9%] top-[23%] z-10 h-2.5 w-2.5 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[-9%] top-[45%] z-10 h-2 w-2 rounded-full bg-purple" />
            <span aria-hidden="true" className="absolute left-[29%] top-[-6%] z-10 h-2 w-2 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[3%] top-[73%] z-10 h-1.5 w-1.5 rounded-full bg-purple" />
            <span aria-hidden="true" className="absolute left-[49%] top-[104%] z-10 h-2.5 w-2.5 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[91%] top-[61%] z-10 h-1.5 w-1.5 rounded-full bg-fuchsia/70" />
            <span aria-hidden="true" className="absolute left-[82%] top-[15%] z-10 h-1 w-1 rounded-full bg-purple" />
            {/* extra scatter, top-right (was sparse there) */}
            <span aria-hidden="true" className="absolute left-[97%] top-[9%] z-10 h-2 w-2 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[76%] top-[24%] z-10 h-1.5 w-1.5 rounded-full bg-fuchsia/70" />
            <span aria-hidden="true" className="absolute left-[87%] top-[-4%] z-10 h-2 w-2 rounded-full bg-purple" />
            {/* right-centre fill */}
            <span aria-hidden="true" className="absolute left-[99%] top-[47%] z-10 h-2 w-2 rounded-full bg-fuchsia" />
            <span aria-hidden="true" className="absolute left-[92%] top-[39%] z-10 h-1.5 w-1.5 rounded-full bg-purple" />
            {/* floating animated orb (replaces the portrait image) */}
            <div data-float className="gpu absolute inset-0">
              <HeroOrb />
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue (static) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-muted">
        <span className="text-[11px] tracking-[0.2em]">גלול</span>
        <span className="block h-8 w-px bg-gradient-to-b from-ink-muted to-transparent" />
      </div>
    </section>
  );
}
