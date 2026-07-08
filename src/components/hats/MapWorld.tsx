"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ResolvedHat } from "@/lib/content";
import { useLang } from "@/lib/i18n";

gsap.registerPlugin(useGSAP);

type MapLabels = { thailand: string; israel: string; england: string };
type PinKey = keyof MapLabels;

// Pins in map space (1200x700). The route runs bottom→top so it frames well in portrait.
const PINS: { x: number; y: number; labelKey?: PinKey; current?: boolean }[] = [
  { x: 360, y: 505, labelKey: "thailand" },
  { x: 175, y: 545 },
  { x: 250, y: 375 },
  { x: 470, y: 400, labelKey: "israel" },
  { x: 430, y: 245 },
  { x: 315, y: 160, labelKey: "england", current: true },
];

const LEGS: [number, number][] = [
  [1, 0],
  [0, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];

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

function MapGraphics({
  linePurple,
  shapeAccent,
  dark,
  gradId,
  labels,
  dir,
  pulseRef,
  planeRef,
}: {
  linePurple: string;
  shapeAccent: string;
  dark: boolean;
  gradId: string;
  labels: MapLabels;
  dir: "rtl" | "ltr";
  pulseRef?: React.Ref<SVGCircleElement>;
  planeRef?: React.Ref<SVGGElement>;
}) {
  const current = PINS.find((p) => p.current)!;
  const pmx = (PINS[4].x + PINS[5].x) / 2;
  const pmy = (PINS[4].y + PINS[5].y) / 2 - 34;
  return (
    <>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="175" y1="545" x2="470" y2="165">
          <stop offset="0" stopColor={shapeAccent} />
          <stop offset="1" stopColor={linePurple} />
        </linearGradient>
      </defs>

      {LEGS.map(([a, c], i) => (
        <path
          key={i}
          d={leg(PINS[a], PINS[c])}
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 11"
          opacity="0.65"
        />
      ))}

      {PINS.map((p, i) => {
        const col = p.current ? shapeAccent : linePurple;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.current ? 6 : 4.5} fill={col} />
            <circle cx={p.x} cy={p.y} r={p.current ? 11 : 9} stroke={col} strokeWidth="1.4" opacity="0.4" />
          </g>
        );
      })}

      <circle ref={pulseRef} cx={current.x} cy={current.y} r={7} stroke={shapeAccent} strokeWidth="1.6" opacity="0.5" />

      <g ref={planeRef} transform={`translate(${pmx},${pmy}) rotate(-32)`}>
        <path d="M0,-7 L2,-1 L9,2 L2,3 L1,9 L-1,4 L-9,2 L-1,-1 Z" fill={shapeAccent} opacity="0.9" />
      </g>

      {PINS.filter((p) => p.labelKey).map((p, i) => (
        <text
          key={i}
          x={p.x + 16}
          y={p.current ? p.y - 14 : p.y + 26}
          fill={dark ? "#FFFFFF" : "#6B6B72"}
          fontSize="19"
          fontWeight="600"
          direction={dir}
          textAnchor="start"
        >
          {labels[p.labelKey!]}
        </text>
      ))}
    </>
  );
}

export default function MapWorld({ hat, animate = true }: { hat: ResolvedHat; animate?: boolean }) {
  const { t, dir } = useLang();
  const labels = t.map;
  const { accent, tone } = hat;
  const dark = tone === "dark";
  const linePurple = dark ? accent : "#6B3FA0";
  const shapeAccent = dark ? accent : "#E11D8B";
  const cName = dark ? "text-white" : "text-ink";
  const cTag = dark ? "text-white/85" : "text-purple";
  const cBody = dark ? "text-white/65" : "text-ink-muted";
  const cNum = dark ? "text-white/45" : "text-fuchsia-ink";

  const pulseRef = useRef<SVGCircleElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !animate) return;
      const ctx = gsap.context(() => {
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
      return () => ctx.revert();
    },
    { dependencies: [animate] }
  );

  const grid = {
    backgroundImage: "radial-gradient(circle, rgba(107,63,160,0.06) 1px, transparent 1.4px)",
    backgroundSize: "36px 36px",
  } as const;

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-white">
      {/* ===== MOBILE (portrait / flat fallback): text on top, whole map centred ===== */}
      <div className="absolute inset-0 md:hidden" style={grid} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center md:hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[6%] top-[3%] select-none font-extrabold leading-none tracking-tightest"
          style={{ fontSize: "clamp(6rem,26vw,10rem)", color: linePurple, opacity: 0.08 }}
        >
          {hat.number}
        </span>

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

        <svg
          aria-hidden="true"
          className="w-full max-w-[300px]"
          viewBox="120 120 460 470"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          <MapGraphics linePurple={linePurple} shapeAccent={shapeAccent} dark={dark} gradId="mapRouteM" labels={labels} dir={dir} />
        </svg>
      </div>

      {/* ===== DESKTOP (landscape / pinned choreography): map fills, text at end ===== */}
      <div data-layer="sky" className="absolute inset-0 hidden md:block" style={grid}>
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
          <MapGraphics
            linePurple={linePurple}
            shapeAccent={shapeAccent}
            dark={dark}
            gradId="mapRoute"
            labels={labels}
            dir={dir}
            pulseRef={pulseRef}
            planeRef={planeRef}
          />
        </svg>
      </div>

      {/* text column — end side (desktop only; mobile has its own centred text) */}
      <div
        data-content
        className="absolute right-[6%] top-1/2 z-10 hidden max-w-sm -translate-y-1/2 flex-col items-start text-start sm:right-[9%] md:flex"
      >
        <span className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
          <span className={cNum}>{hat.number}</span>
          <span className="h-px w-10" style={{ background: linePurple }} />
        </span>
        <h2 className={`text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-[0.95] tracking-tightest ${cName}`}>
          {hat.name}
          <span className="text-fuchsia">.</span>
        </h2>
        <p className={`mt-4 text-[clamp(1.2rem,3.2vw,1.9rem)] italic ${cTag}`}>{hat.tagline}</p>
        <p className={`mt-4 max-w-xs text-base leading-relaxed sm:text-lg ${cBody}`}>{hat.body}</p>
      </div>
    </div>
  );
}
