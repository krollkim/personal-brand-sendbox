"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STORY_TITLE, STORY_BEATS } from "@/lib/story";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Presentational kickers per beat (the copy itself lives in the brand JSON).
const KICKERS = ["מאיפה התחלתי", "הקפיצה", "בתנועה", "מה שלא השתנה"];

/**
 * "המסע" — the journey. A calm, editorial vertical timeline (a deliberate rest
 * after the immersive hats): a purple→fuchsia "through-line" draws itself down
 * as you scroll, and each beat reveals in turn. The last beat is the payoff —
 * it turns from Kim's story back to the visitor ("...וזה מה שאני עושה גם בשבילך").
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the through-line draws top→bottom, coupled to scroll
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
        // each beat reveals as it enters
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
        <div className="mb-16 text-right sm:mb-24">
          <span className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia">
            <span className="h-px w-10 bg-purple" />
            הסיפור
          </span>
          <h2 className="text-[clamp(3rem,9vw,6rem)] font-extrabold leading-[0.95] tracking-tightest text-ink">
            {STORY_TITLE}
            <span className="text-fuchsia">.</span>
          </h2>
        </div>

        {/* timeline */}
        <div data-beats className="relative">
          {/* the through-line (right rail in RTL), drawn on scroll */}
          <div className="pointer-events-none absolute bottom-3 right-3 top-3 w-px">
            <div
              ref={line}
              className="h-full w-full origin-top"
              style={{ background: "linear-gradient(to bottom, #6B3FA0, #E11D8B)" }}
            />
          </div>

          <div className="flex flex-col gap-20 sm:gap-28">
            {STORY_BEATS.map((text, i) => {
              const last = i === STORY_BEATS.length - 1;
              return (
                <div key={i} data-beat className="relative pr-9 text-right sm:pr-12">
                  {/* node on the line */}
                  <span
                    className="absolute right-[6px] top-1.5 h-3.5 w-3.5 rounded-full border-2"
                    style={{ background: "#FFFFFF", borderColor: last ? "#E11D8B" : "#6B3FA0" }}
                  />
                  <span
                    className={`mb-2 block text-sm font-semibold uppercase tracking-[0.28em] ${
                      last ? "text-fuchsia" : "text-purple"
                    }`}
                  >
                    {KICKERS[i]}
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
