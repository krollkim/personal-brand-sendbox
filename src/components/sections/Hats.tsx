"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import World from "@/components/hats/World";
import { resolveHats } from "@/lib/content";
import { useLang } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hats() {
  const { lang, dir } = useLang();
  const hats = resolveHats(lang);
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panel1 = useRef<HTMLDivElement>(null);
  const panel2 = useRef<HTMLDivElement>(null);
  const panel3 = useRef<HTMLDivElement>(null);
  const panel4 = useRef<HTMLDivElement>(null);
  // Default to the flat (stacked) layout so SSR and mobile never spin up the
  // pinned timeline; only capable desktops upgrade to the choreography.
  const [flat, setFlat] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    if (!reduce && !small) setFlat(false);
  }, []);

  useGSAP(
    () => {
      if (flat) return;
      const q1 = gsap.utils.selector(panel1);
      const q2 = gsap.utils.selector(panel2);
      const vw = () => window.innerWidth;

      // --- hero -> hat1 : ONE-SHOT entrance reveal (plays once when the world
      // enters, NOT scrub-coupled — so it always finishes settling regardless of
      // scroll speed; the scroll can't "outrun" it). ---
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });
      reveal
        .from(q1("[data-layer='number']"), { yPercent: 22, autoAlpha: 0, duration: 0.9 }, 0)
        .from(q1("[data-layer='name']"), { y: 64, autoAlpha: 0, duration: 0.85, stagger: 0.08 }, 0.05)
        .from(q1("[data-layer='tagline']"), { y: 50, autoAlpha: 0, duration: 0.7 }, 0.2)
        .from(q1("[data-layer='body']"), { y: 40, autoAlpha: 0, duration: 0.7 }, 0.28)
        .from(q1("[data-layer='media']"), { x: 70, autoAlpha: 0, duration: 0.95 }, 0.12)
        .from(q1("[data-layer='shape-r']"), { x: 60, autoAlpha: 0, duration: 0.95 }, 0.12)
        .from(q1("[data-layer='shape-l']"), { x: -60, autoAlpha: 0, duration: 0.95 }, 0.12);

      // --- hat1 -> hat2 : PINNED. First a HOLD so hat1 is fully isolated, then
      // a horizontal slide (pan right) with depth. The hold is what gives each
      // world its own "you're fully here" moment before the next appears. ---
      const HOLD = 0.6; // fraction of the timeline spent dwelling on hat1 alone
      const SLIDE = 1; // slide duration (units)

      const tlSlide = gsap.timeline({
        scrollTrigger: {
          trigger: viewport.current,
          start: "top top",
          end: "+=640%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // the camera pans LEFT (RTL-forward): the track slides one viewport right,
      // revealing hat2 which sits to the LEFT of hat1.
      tlSlide.to(track.current, { x: () => vw(), duration: SLIDE, ease: "none" }, HOLD);
      // outgoing world: atmosphere lags, content leads -> parallax depth
      tlSlide.fromTo(q1("[data-layer='atmos']"), { x: 0 }, { x: () => -vw() * 0.1, duration: SLIDE, ease: "none" }, HOLD);
      tlSlide.fromTo(q1("[data-content]"), { x: 0 }, { x: () => vw() * 0.05, duration: SLIDE, ease: "none" }, HOLD);
      // incoming world (from the LEFT): atmosphere slower, content faster + reveal, shapes from sides
      tlSlide.fromTo(q2("[data-layer='atmos']"), { x: () => vw() * 0.1 }, { x: 0, duration: SLIDE, ease: "none" }, HOLD);
      tlSlide.fromTo(
        q2("[data-content]"),
        { x: () => -vw() * 0.12, autoAlpha: 0.4 },
        { x: 0, autoAlpha: 1, duration: SLIDE, ease: "none" },
        HOLD
      );
      tlSlide.fromTo(
        q2("[data-layer='shape-r']"),
        { x: () => -vw() * 0.22, autoAlpha: 0 },
        { x: 0, autoAlpha: 0.6, duration: SLIDE, ease: "none" },
        HOLD
      );
      tlSlide.fromTo(
        q2("[data-layer='shape-l']"),
        { x: () => vw() * 0.22, autoAlpha: 0 },
        { x: 0, autoAlpha: 0.6, duration: SLIDE, ease: "none" },
        HOLD
      );

      // --- hat2 -> hat3 : ZOOM-THROUGH. After a hold on hat2, the whole track
      // (showing hat2) scales up & fades — flying past the viewer — while hat3
      // emerges from the depth (scale-in from the centre). ---
      const HOLD2 = 0.5; // dwell on hat2 before the dive
      const ZOOM = 1.2;
      const zoomStart = HOLD + SLIDE + HOLD2;

      // origin at -25% so the (x:+100vw) track scales around the on-screen centre
      gsap.set(track.current, { transformOrigin: "-25% 50%" });
      // hat3 waits far back in REAL depth (perspective), fully opaque but hidden
      // behind hat2. It travels forward to us — so it feels like WE arrive at it,
      // not like it fades into our spot.
      gsap.set(panel3.current, { autoAlpha: 1, z: -3200 });

      // hat2 flies toward us: scales up big, stays opaque until it's huge, then
      // fades late as it "passes" through us (not a cross-fade).
      tlSlide.to(track.current, { scale: 5, duration: ZOOM, ease: "power2.in" }, zoomStart);
      tlSlide.to(
        track.current,
        { autoAlpha: 0, duration: ZOOM * 0.45, ease: "power2.in" },
        zoomStart + ZOOM * 0.55
      );
      // hat3 approaches from the depth to its natural size (no opacity fade).
      tlSlide.to(panel3.current, { z: 0, duration: ZOOM, ease: "power1.out" }, zoomStart);

      // --- hat3 : the pair WALKS the trail, SCROLL-DRIVEN. Placed on the master
      // timeline so it scrubs with the scroll (smooth + reversible, no self-loop)
      // and lands at the trail's end exactly as the drop begins. ---
      const HOLD3 = 0.9; // walk duration (units)
      const walkStart = zoomStart + ZOOM;
      const journeyPath = panel3.current?.querySelector<SVGPathElement>("[data-journey-path]");
      const journeyWalkers = panel3.current?.querySelector<SVGGElement>("[data-journey-walkers]");
      if (journeyPath && journeyWalkers) {
        const len = journeyPath.getTotalLength();
        const walk = { p: 0.08 };
        const placeWalkers = () => {
          const pt = journeyPath.getPointAtLength(walk.p * len);
          journeyWalkers.setAttribute("transform", `translate(${pt.x},${pt.y})`);
        };
        tlSlide.to(walk, { p: 0.92, duration: HOLD3, ease: "none", onUpdate: placeWalkers }, walkStart);
      }

      // --- hat3 -> hat4 : the DROP. Once the pair reaches the end of the trail
      // the camera falls straight DOWN — hat3 slides up & out while the wide-open
      // horizon world rises from below. A deliberate axis break after left+zoom. ---
      const VDROP = 1.3;
      const q4 = gsap.utils.selector(panel4);
      const dropStart = walkStart + HOLD3;
      // hat3 lifts straight UP and out of frame, revealing hat4 — which sits
      // static at inset-0 BEHIND it (earlier in DOM order) — so it feels like
      // descending into a new, wide-open world. Only hat3 moves, so the reveal
      // can never mis-position (a two-panel version proved fragile under scrub).
      tlSlide.fromTo(
        panel3.current,
        { yPercent: 0 },
        { yPercent: -100, duration: VDROP, ease: "power2.inOut", immediateRender: false },
        dropStart
      );
      // incoming world parallax: the sky lags, the text leads -> depth on the drop
      tlSlide.fromTo(
        q4("[data-layer='sky']"),
        { yPercent: 12 },
        { yPercent: 0, duration: VDROP, ease: "power2.out", immediateRender: false },
        dropStart
      );
      tlSlide.fromTo(
        q4("[data-content]"),
        { yPercent: 32, autoAlpha: 0.25 },
        { yPercent: 0, autoAlpha: 1, duration: VDROP, ease: "power2.out", immediateRender: false },
        dropStart
      );
      // dwell on hat4, fully settled, before the pin releases
      const HOLD4 = 0.7;
      tlSlide.to({}, { duration: HOLD4 }, dropStart + VDROP);

      ScrollTrigger.refresh();

      return () => {
        reveal.scrollTrigger?.kill();
        tlSlide.scrollTrigger?.kill();
        reveal.kill();
        tlSlide.kill();
      };
    },
    { scope: root, dependencies: [flat] }
  );

  // ---- Flat fallback: stacked worlds, no pin / no horizontal scroll ----
  if (flat) {
    return (
      <section id="hats" ref={root} className="relative bg-white">
        {hats.slice(0, 4).map((hat) => (
          <World key={hat.number} hat={hat} animate={false} />
        ))}
      </section>
    );
  }

  // ---- Full choreography ----
  // dir="ltr" on the horizontal track so the overflow anchor and translateX stay
  // predictable regardless of language; each World is re-wrapped in the page dir
  // so its text lays out correctly (he=rtl / en=ltr).
  return (
    <section id="hats" ref={root} className="relative bg-white">
      <div
        ref={viewport}
        dir="ltr"
        className="relative h-[100svh] w-full overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <div ref={track} className="relative z-10 h-full" style={{ width: "200vw" }}>
          <div ref={panel1} className="absolute left-0 top-0 h-full w-screen">
            <div dir={dir} className="h-full w-full">
              <World hat={hats[0]} />
            </div>
          </div>
          <div ref={panel2} className="absolute top-0 h-full w-screen" style={{ left: "-100vw" }}>
            <div dir={dir} className="h-full w-full">
              <World hat={hats[1]} />
            </div>
          </div>
        </div>

        {/* hat4 — sits STATIC behind hat3 (earlier in DOM so hat3 paints over it);
            revealed when hat3 lifts away in the drop */}
        <div ref={panel4} className="pointer-events-none absolute inset-0 z-0">
          <div dir={dir} className="h-full w-full">
            <World hat={hats[3]} />
          </div>
        </div>

        {/* hat3 — comes forward from depth (zoom), then lifts UP to reveal hat4 */}
        <div ref={panel3} className="pointer-events-none absolute inset-0 z-0">
          <div dir={dir} className="h-full w-full">
            <World hat={hats[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}
