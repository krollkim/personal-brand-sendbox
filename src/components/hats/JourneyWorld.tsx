"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ResolvedHat } from "@/lib/content";
import Atmosphere from "./Atmosphere";
import HatMedia from "./HatMedia";

gsap.registerPlugin(useGSAP);

// The trail the pair walks along (viewBox 1200x700; slice-scaled to the section).
const PATH_D =
  "M1150,620 C 930,560 850,405 640,378 C 430,351 350,195 150,150";

/** A simple line "person": head, body, two arms (inner one reaches to the
 *  partner — hand in hand), two legs mid-stride. Drawn around (ox, 0). */
function Walker({
  ox,
  color,
  stride,
}: {
  ox: number;
  color: string;
  stride: 1 | -1;
}) {
  const inner = ox > 0 ? -1 : 1; // direction toward the partner (centre)
  return (
    <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
      <circle cx={ox} cy={-28} r={4} fill={color} stroke="none" />
      <line x1={ox} y1={-24} x2={ox} y2={-8} />
      {/* outer arm */}
      <line x1={ox} y1={-18} x2={ox - inner * 6} y2={-12} />
      {/* inner arm — reaches toward the partner */}
      <line x1={ox} y1={-18} x2={ox + inner * (Math.abs(ox) - 1)} y2={-11} />
      {/* legs (mid-stride) */}
      <line x1={ox} y1={-8} x2={ox + stride * 4} y2={4} />
      <line x1={ox} y1={-8} x2={ox - stride * 3} y2={4} />
    </g>
  );
}

/** The pair holding hands, with soft glow — reused at different scales. */
function WalkingPair({ linePurple, shapeAccent }: { linePurple: string; shapeAccent: string }) {
  return (
    <>
      <circle cx={-11} cy={-14} r={17} fill={linePurple} opacity="0.12" />
      <circle cx={11} cy={-14} r={17} fill={shapeAccent} opacity="0.12" />
      <Walker ox={-11} color={linePurple} stride={1} />
      <Walker ox={11} color={shapeAccent} stride={-1} />
    </>
  );
}

export default function JourneyWorld({
  hat,
  animate = true,
}: {
  hat: ResolvedHat;
  animate?: boolean;
}) {
  const { accent, base, variant, tone } = hat;
  const dark = tone === "dark";
  const linePurple = dark ? accent : "#6B3FA0";
  const shapeAccent = dark ? accent : "#E11D8B";
  const cName = dark ? "text-white" : "text-ink";
  const cTag = dark ? "text-white/85" : "text-purple";
  const cBody = dark ? "text-white/65" : "text-ink-muted";
  const cNum = dark ? "text-white/45" : "text-fuchsia-ink";

  const pathRef = useRef<SVGPathElement>(null);
  const walkersRef = useRef<SVGGElement>(null);

  // Initial placement only. On the desktop choreography the pair is walked along
  // the trail by the Hats timeline (scroll-driven, via the data-journey-* hooks).
  // On reduced-motion / the flat mobile fallback we just place them mid-trail.
  useGSAP(
    () => {
      const path = pathRef.current;
      const g = walkersRef.current;
      if (!path || !g) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const len = path.getTotalLength();
      const place = (frac: number) => {
        const pt = path.getPointAtLength(frac * len);
        g.setAttribute("transform", `translate(${pt.x},${pt.y})`);
      };
      g.setAttribute("opacity", "1");
      place(reduce || !animate ? 0.45 : 0.08);
    },
    { dependencies: [animate] }
  );

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-white">
      <div className="absolute -inset-[14%]">
        <Atmosphere accent={accent} base={base} variant={variant} animate={animate} />
      </div>

      {/* ===== MOBILE (portrait / flat fallback): centred vertical stack ===== */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center md:hidden">
        {/* ghost number — up top, not clipped */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] top-[3%] select-none font-extrabold leading-none tracking-tightest"
          style={{ fontSize: "clamp(6rem,26vw,10rem)", color: linePurple, opacity: 0.09 }}
        >
          {hat.number}
        </span>

        {/* destination card — centred & larger */}
        <div className="w-[min(280px,66vw)] rotate-[-3deg]">
          <HatMedia type={hat.media} accent={accent} tone={tone} />
        </div>

        {/* message */}
        <div className="flex flex-col items-center">
          <span className="mb-2 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
            <span className="h-px w-7" style={{ background: linePurple }} />
            <span className={cNum}>{hat.number}</span>
            <span className="h-px w-7" style={{ background: linePurple }} />
          </span>
          <h2 className={`text-[clamp(3rem,15vw,4.5rem)] font-extrabold leading-[0.95] tracking-tightest ${cName}`}>
            {hat.name}
            <span className="text-fuchsia">.</span>
          </h2>
          <p className={`mt-3 text-[clamp(1.1rem,4.6vw,1.5rem)] italic ${cTag}`}>{hat.tagline}</p>
          <p className={`mt-3 max-w-xs text-base leading-relaxed ${cBody}`}>{hat.body}</p>
        </div>

        {/* the walking pair — prominent, below the text */}
        <svg viewBox="0 0 360 150" className="w-full max-w-[330px]" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="journeyTrailM" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={shapeAccent} />
              <stop offset="1" stopColor={linePurple} />
            </linearGradient>
          </defs>
          <path
            d="M14,116 Q180,78 346,104"
            stroke="url(#journeyTrailM)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 12"
            opacity="0.6"
          />
          <g transform="translate(180,92) scale(2.35)">
            <WalkingPair linePurple={linePurple} shapeAccent={shapeAccent} />
          </g>
        </svg>
      </div>

      {/* ===== DESKTOP (landscape / pinned choreography): current composition ===== */}
      <div className="absolute inset-0 hidden md:block">
        {/* bold ghost number, low-left */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[7%] left-[2%] select-none font-extrabold leading-none tracking-tightest"
          style={{ fontSize: "clamp(10rem,30vw,26rem)", color: linePurple, opacity: 0.1 }}
        >
          {hat.number}
        </span>

        {/* trail + the walking pair (one SVG so they stay aligned when scaled) */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="journeyTrail" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={shapeAccent} />
              <stop offset="1" stopColor={linePurple} />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            data-journey-path
            d={PATH_D}
            stroke="url(#journeyTrail)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1 12"
            opacity="0.6"
          />
          <g ref={walkersRef} data-journey-walkers transform="translate(640,378)">
            <WalkingPair linePurple={linePurple} shapeAccent={shapeAccent} />
          </g>
        </svg>

        {/* the "destination" card the pair walks toward (upper-left, tilted) */}
        <div className="pointer-events-none absolute left-[7%] top-[13%] w-[min(340px,42vw)] rotate-[-4deg]">
          <HatMedia type={hat.media} accent={accent} tone={tone} />
        </div>

        {/* message — right, asymmetric */}
        <div className="absolute right-[6%] top-1/2 z-10 flex max-w-md -translate-y-1/2 flex-col items-start text-start sm:right-[8%]">
          <span className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
            <span className={cNum}>{hat.number}</span>
            <span className="h-px w-10" style={{ background: linePurple }} />
          </span>
          <h2 className={`text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-[0.95] tracking-tightest ${cName}`}>
            {hat.name}
            <span className="text-fuchsia">.</span>
          </h2>
          <p className={`mt-4 text-[clamp(1.2rem,3.2vw,1.9rem)] italic ${cTag}`}>{hat.tagline}</p>
          <p className={`mt-4 max-w-sm text-base leading-relaxed sm:text-lg ${cBody}`}>{hat.body}</p>
        </div>
      </div>
    </div>
  );
}
