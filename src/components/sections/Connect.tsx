"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CONNECT, INSTAGRAM_URL } from "@/lib/closing";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A few floating accent dots (left/top %, size, delay) for quiet life on the gradient.
const DOTS = [
  { l: "12%", t: "22%", s: 8, d: 0 },
  { l: "84%", t: "18%", s: 6, d: 0.6 },
  { l: "22%", t: "74%", s: 10, d: 1.1 },
  { l: "78%", t: "70%", s: 7, d: 0.3 },
  { l: "50%", t: "12%", s: 5, d: 0.9 },
  { l: "90%", t: "48%", s: 6, d: 1.4 },
];

/**
 * "יצירת קשר" - the closing peak. The ONE place the reserved pearl gradient takes
 * over full-bleed (the site is otherwise white), so it reads as resolution. The
 * warm, client-facing headline invites; the single CTA drives the site's one
 * conversion - following the journey on Instagram.
 */
export default function Connect() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // reveal the content on enter
        gsap.from(q("[data-reveal]"), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        // gentle float on the dots
        q("[data-dot]").forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -18 : 16,
            duration: 3 + (i % 3),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="connect"
      className="relative flex min-h-[92svh] w-full items-center justify-center overflow-hidden bg-pearl px-6 py-28 text-center text-white"
    >
      {/* floating dots */}
      {DOTS.map((dot, i) => (
        <span
          key={i}
          data-dot
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{ left: dot.l, top: dot.t, width: dot.s, height: dot.s }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-3xl">
        <span
          data-reveal
          className="mb-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-white/80"
        >
          <span className="h-px w-10 bg-white/60" />
          המסע ממשיך
          <span className="h-px w-10 bg-white/60" />
        </span>

        <h2
          data-reveal
          className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.04] tracking-tightest"
        >
          {CONNECT.headline_he}
        </h2>

        <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
          {CONNECT.subtext_he}
        </p>

        <div data-reveal className="mt-10 flex flex-col items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-lg font-bold text-purple-deep shadow-[0_18px_40px_-16px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5.4" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            עקוב אחרי המסע
          </a>
          <p className="text-sm text-white/75">
            כל מה שאני בונה, יוצר ומלווה - קורה שם. עונה לכל הודעה.
          </p>
        </div>
      </div>
    </section>
  );
}
