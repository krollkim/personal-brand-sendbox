"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "המסע" — the journey. A calm, editorial vertical timeline (a deliberate rest
 * after the immersive hats): a purple→fuchsia "through-line" draws itself down
 * as you scroll, and each beat reveals in turn. The last beat is the payoff —
 * it turns from Kim's story back to the visitor.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const beats = t.story.beats;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (line.current) {
          gsap.fromTo(
            line.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: q("[data-beats]")[0],
                start: "top 72%",
                end: "bottom 78%",
                scrub: 0.5,
              },
            }
          );
        }
        q("[data-beat]").forEach((el) => {
          gsap.from(el, {
            y: 46,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="story" className="relative bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6">
        {/* header */}
        <div className="mb-16 text-start sm:mb-24">
          <span className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-ink">
            <span className="h-px w-10 bg-purple" />
            {t.story.kicker}
          </span>
          <h2 className="text-[clamp(3rem,9vw,6rem)] font-extrabold leading-[0.95] tracking-tightest text-ink">
            {t.story.title}
            <span className="text-fuchsia">.</span>
          </h2>
        </div>

        {/* timeline */}
        <div data-beats className="relative">
          {/* the through-line on the reading-start rail, drawn on scroll */}
          <div className="pointer-events-none absolute bottom-3 start-3 top-3 w-px">
            <div
              ref={line}
              className="h-full w-full origin-top"
              style={{ background: "linear-gradient(to bottom, #6B3FA0, #E11D8B)" }}
            />
          </div>

          <div className="flex flex-col gap-20 sm:gap-28">
            {beats.map((text, i) => {
              const last = i === beats.length - 1;
              return (
                <div key={i} data-beat className="relative ps-9 text-start sm:ps-12">
                  <span
                    className="absolute start-[6px] top-1.5 h-3.5 w-3.5 rounded-full border-2"
                    style={{ background: "#FFFFFF", borderColor: last ? "#E11D8B" : "#6B3FA0" }}
                  />
                  <span
                    className={`mb-2 block text-sm font-semibold uppercase tracking-[0.28em] ${
                      last ? "text-fuchsia-ink" : "text-purple"
                    }`}
                  >
                    {t.story.kickers[i]}
                  </span>
                  <p
                    className={
                      last
                        ? "text-[clamp(1.5rem,4vw,2.4rem)] font-bold leading-snug text-ink"
                        : "text-[clamp(1.15rem,2.6vw,1.5rem)] leading-relaxed text-ink-muted"
                    }
                  >
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
