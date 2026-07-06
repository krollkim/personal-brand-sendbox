"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Hat } from "@/lib/hats";

gsap.registerPlugin(useGSAP);

/**
 * "map" world (נווד) — a nomad's route across the world. Location pins are wired
 * together by dotted flight-paths; a plane crosses the last leg and the current
 * spot pulses. Two pins carry the real places from Kim's story (תאילנד → אנגליה)
 * so the concept reads instantly: "I work from anywhere; the work moves with me."
 *
 * One SVG (viewBox 1200x700, slice-scaled) holds the whole map so pins, routes,
 * plane and labels always stay aligned. The text column sits to the right.
 */

// Pins in viewBox space (1200x700), kept to the left ~60% so the text stays clear.
const PINS: { x: number; y: number; label?: string; current?: boolean }[] = [
  { x: 360, y: 505, label: "תאילנד" },
  { x: 175, y: 545 },
  { x: 250, y: 375 },
  { x: 470, y: 400, label: "ישראל" },
  { x: 430, y: 245 },
  { x: 315, y: 160, label: "אנגליה", current: true },
];

// Dotted legs of the journey (indices into PINS), drawn as gently bowed curves.
const LEGS: [number, number][] = [
  [1, 0],
  [0, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];

// A bowed quadratic path between two points (perpendicular offset = "arc").
function leg(a: { x: number; y: number }, b: { x: number; y: number }, bow = 34) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
}

export default function MapWorld({
  hat,
  tone,
  animate = true,
}: {
  hat: Hat;
  tone: "dark" | "light";
  animate?: boolean;
}) {
  const dark = tone === "dark";
  const linePurple = dark ? hat.world.accent : "#6B3FA0";
  const shapeAccent = dark ? hat.world.accent : "#E11D8B";
  const cName = dark ? "text-white" : "text-ink";
  const cTag = dark ? "text-white/85" : "text-purple";
  const cBody = dark ? "text-white/65" : "text-ink-muted";
  const cNum = dark ? "text-white/45" : "text-fuchsia";

  const pulseRef = useRef<SVGCircleElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !animate) return;
      const tl = gsap.context(() => {
        if (pulseRef.current) {
          gsap.fromTo(
            pulseRef.current,
            { attr: { r: 7 }, opacity: 0.5 },
            { attr: { r: 24 }, opacity: 0, duration: 2.2, ease: "power1.out", repeat: -1 }
          );
        }
        if (planeRef.current) {
          gsap.to(planeRef.current, { y: -6, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true });
        }
      });
      return () => tl.revert();
    },
    { dependencies: [animate] }
  );

  const current = PINS.find((p) => p.current)!;
  // plane sits near the midpoint of the last leg
  const pmx = (PINS[4].x + PINS[5].x) / 2;
  const pmy = (PINS[4].y + PINS[5].y) / 2 - 34;

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-white">
      {/* faint coordinate-dot grid — hints "map" without stealing focus */}
      <div
        data-layer="sky"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(107,63,160,0.06) 1px, transparent 1.4px)",
          backgroundSize: "36px 36px",
        }}
      >
        {/* giant ghost number, low-left */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[7%] left-[2%] select-none font-extrabold leading-none tracking-tightest"
          style={{ fontSize: "clamp(10rem,30vw,26rem)", color: linePurple, opacity: 0.08 }}
        >
          {hat.number}
        </span>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="mapRoute" gradientUnits="userSpaceOnUse" x1="175" y1="545" x2="470" y2="165">
              <stop offset="0" stopColor={shapeAccent} />
              <stop offset="1" stopColor={linePurple} />
            </linearGradient>
          </defs>

          {/* dotted flight-paths */}
          {LEGS.map(([a, c], i) => (
            <path
              key={i}
              d={leg(PINS[a], PINS[c])}
              stroke="url(#mapRoute)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 11"
              opacity="0.65"
            />
          ))}

          {/* pins */}
          {PINS.map((p, i) => {
            const col = p.current ? shapeAccent : linePurple;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={p.current ? 6 : 4.5} fill={col} />
                <circle cx={p.x} cy={p.y} r={p.current ? 11 : 9} stroke={col} strokeWidth="1.4" opacity="0.4" />
              </g>
            );
          })}

          {/* pulsing "you are here" ring on the current pin */}
          <circle ref={pulseRef} cx={current.x} cy={current.y} r={7} stroke={shapeAccent} strokeWidth="1.6" opacity="0.5" />

          {/* plane in transit on the last leg */}
          <g ref={planeRef} transform={`translate(${pmx},${pmy}) rotate(-32)`}>
            <path
              d="M0,-7 L2,-1 L9,2 L2,3 L1,9 L-1,4 L-9,2 L-1,-1 Z"
              fill={shapeAccent}
              opacity="0.9"
            />
          </g>

          {/* place labels (SVG text keeps them pinned to the map) */}
          {PINS.filter((p) => p.label).map((p, i) => (
            <text
              key={i}
              x={p.x + 16}
              y={p.current ? p.y - 14 : p.y + 26}
              fill={dark ? "#FFFFFF" : "#6B6B72"}
              fontSize="19"
              fontWeight="600"
              direction="rtl"
              textAnchor="start"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>

      {/* text column — right, asymmetric (map owns the left/centre) */}
      <div
        data-content
        className="absolute right-[6%] top-1/2 z-10 flex max-w-sm -translate-y-1/2 flex-col items-start text-right sm:right-[9%]"
      >
        <span className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
          <span className={cNum}>{hat.number}</span>
          <span className="h-px w-10" style={{ background: linePurple }} />
        </span>
        <h2
          className={`text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-[0.95] tracking-tightest ${cName}`}
        >
          {hat.name_he}
          {!dark && <span className="text-fuchsia">.</span>}
        </h2>
        <p className={`mt-4 text-[clamp(1.2rem,3.2vw,1.9rem)] italic ${cTag}`}>{hat.tagline_he}</p>
        <p className={`mt-4 max-w-xs text-base leading-relaxed sm:text-lg ${cBody}`}>{hat.body_he}</p>
      </div>
    </div>
  );
}
