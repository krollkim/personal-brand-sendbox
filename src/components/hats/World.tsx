"use client";

import type { Hat } from "@/lib/hats";
import Atmosphere, { type AtmosphereVariant } from "./Atmosphere";
import HatMedia from "./HatMedia";
import JourneyWorld from "./JourneyWorld";
import MapWorld from "./MapWorld";

export type Tone = "dark" | "light";
export type WorldLayout = "split" | "showcase" | "manifesto" | "journey" | "map";

/**
 * One full-screen "world" for a hat. Each hat gets a DIFFERENT composition
 * (`layout`) so the site changes world section-to-section instead of repeating:
 *  - "split":    text right / media left, structured shapes (e.g. בונה)
 *  - "showcase": media right (tilted) / text left-low, organic shapes (e.g. יוצר)
 *
 * Every moving piece keeps its data-layer so the choreography (Hats.tsx) can
 * parallax it — bg slow, text fast, shapes from the sides.
 */
export default function World({
  hat,
  base,
  variant,
  tone,
  layout = "split",
  animate = true,
  numberColor,
}: {
  hat: Hat;
  base: string;
  variant: AtmosphereVariant;
  tone: Tone;
  layout?: WorldLayout;
  animate?: boolean;
  numberColor?: string;
}) {
  const accent = hat.world.accent;
  const dark = tone === "dark";
  const showcase = layout === "showcase";
  const manifesto = layout === "manifesto";

  // Design-system colours for the (new) light/white worlds.
  const linePurple = dark ? accent : "#6B3FA0";
  const shapeAccent = dark ? accent : "#E11D8B";

  const c = {
    name: dark ? "text-white" : "text-ink",
    tagline: dark ? "text-white/85" : "text-purple",
    body: dark ? "text-white/65" : "text-ink-muted",
    num: dark ? "text-white/45" : "text-fuchsia",
  };

  // "journey" — two people walking a path together (מלווה). Its own component
  // because it needs animation hooks (the pair walks along the trail).
  if (layout === "journey") {
    return (
      <JourneyWorld hat={hat} base={base} variant={variant} tone={tone} animate={animate} />
    );
  }

  // "map" — a nomad's route across the world, pins wired by flight-paths (נווד).
  if (layout === "map") {
    return <MapWorld hat={hat} tone={tone} animate={animate} />;
  }

  const textBlock = (
    <div className="flex flex-col items-start text-right">
      <span
        data-layer="name"
        className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]"
      >
        <span className={c.num}>{hat.number}</span>
        <span className="h-px w-10" style={{ background: linePurple }} />
      </span>
      <h2
        data-layer="name"
        className={`text-[clamp(3.5rem,11vw,8rem)] font-extrabold leading-[0.95] tracking-tightest ${c.name}`}
      >
        {hat.name_he}
        {!dark && <span className="text-fuchsia">.</span>}
      </h2>
      <p
        data-layer="tagline"
        className={`mt-4 text-[clamp(1.25rem,3.4vw,2rem)] italic ${c.tagline}`}
      >
        {hat.tagline_he}
      </p>
      <p
        data-layer="body"
        className={`mt-5 max-w-md text-base leading-relaxed sm:text-lg ${c.body}`}
      >
        {hat.body_he}
      </p>
    </div>
  );

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* atmosphere — moves slowest, overscanned & clipped so no edge seam */}
      <div data-layer="atmos" className="absolute -inset-[14%]">
        <Atmosphere accent={accent} base={base} variant={variant} animate={animate} />
      </div>

      {/* giant ghost number — positioned differently per layout */}
      <span
        data-layer="number"
        aria-hidden="true"
        className={`pointer-events-none absolute select-none font-extrabold leading-none tracking-tightest ${
          manifesto
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            : showcase
            ? "right-[5%] top-[7%]"
            : "left-[6%] top-[12%]"
        }`}
        style={{
          fontSize: manifesto ? "clamp(16rem, 46vw, 38rem)" : "clamp(9rem, 26vw, 22rem)",
          color: numberColor ?? linePurple,
          opacity: manifesto ? 0.05 : dark ? 0.16 : 0.2,
        }}
      >
        {hat.number}
      </span>

      {/* decorative shapes — differ per layout */}
      {manifesto ? (
        <>
          {/* two arcs that "embrace" the centred content — מלווה */}
          <svg
            data-layer="shape-l"
            aria-hidden="true"
            className="gpu pointer-events-none absolute left-[7%] top-1/2 h-[76vh] w-auto -translate-y-1/2"
            viewBox="0 0 120 400"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M100,10 C 18,120 18,280 100,390" stroke={linePurple} strokeWidth="2.2" opacity="0.7" />
          </svg>
          <svg
            data-layer="shape-r"
            aria-hidden="true"
            className="gpu pointer-events-none absolute right-[7%] top-1/2 h-[76vh] w-auto -translate-y-1/2"
            viewBox="0 0 120 400"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M20,10 C 102,120 102,280 20,390" stroke={shapeAccent} strokeWidth="2.2" opacity="0.75" />
          </svg>
        </>
      ) : showcase ? (
        <>
          <svg
            data-layer="shape-l"
            aria-hidden="true"
            className="gpu pointer-events-none absolute -left-[3%] top-[22%] h-[62vh] w-[42vw] opacity-70"
            viewBox="0 0 400 600"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M30,10 C220,120 -40,300 200,420 C360,510 150,560 300,595"
              stroke={linePurple}
              strokeWidth="1.2"
              opacity="0.4"
            />
          </svg>
          <svg
            data-layer="shape-r"
            aria-hidden="true"
            className="gpu pointer-events-none absolute bottom-[14%] right-[9%] h-40 w-40 opacity-70 sm:h-52 sm:w-52"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M100,18 C158,18 184,74 172,120 C158,174 98,192 58,168 C18,144 20,74 52,46 C66,33 84,18 100,18 Z"
              stroke={shapeAccent}
              strokeWidth="1.3"
              opacity="0.5"
            />
          </svg>
        </>
      ) : (
        <>
          <svg
            data-layer="shape-r"
            aria-hidden="true"
            className="gpu pointer-events-none absolute right-[7%] top-[16%] h-40 w-40 opacity-70 sm:h-56 sm:w-56"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="99" stroke={linePurple} strokeWidth="1" opacity="0.4" />
            <circle cx="100" cy="100" r="66" stroke={shapeAccent} strokeWidth="1.3" opacity="0.55" />
          </svg>
          <svg
            data-layer="shape-l"
            aria-hidden="true"
            className="gpu pointer-events-none absolute bottom-[12%] left-[10%] h-32 w-32 opacity-70 sm:h-44 sm:w-44"
            viewBox="0 0 160 160"
            fill="none"
          >
            <path d="M80 6 L154 150 L6 150 Z" stroke={linePurple} strokeWidth="1" opacity="0.5" />
          </svg>
        </>
      )}

      {/* content — manifesto is a centred column; others are a 2-col grid */}
      {manifesto ? (
        <div
          data-content
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center"
        >
          <span
            data-layer="name"
            className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]"
          >
            <span className="h-px w-8" style={{ background: linePurple }} />
            <span className={c.num}>{hat.number}</span>
            <span className="h-px w-8" style={{ background: linePurple }} />
          </span>
          <h2
            data-layer="name"
            className={`text-[clamp(4rem,13vw,9rem)] font-extrabold leading-[0.9] tracking-tightest ${c.name}`}
          >
            {hat.name_he}
            {!dark && <span className="text-fuchsia">.</span>}
          </h2>
          <p
            data-layer="tagline"
            className={`mt-6 max-w-2xl text-[clamp(1.5rem,4vw,2.6rem)] font-medium italic leading-tight ${c.tagline}`}
          >
            {hat.tagline_he}
          </p>
          <p
            data-layer="body"
            className={`mt-5 max-w-lg text-base leading-relaxed sm:text-lg ${c.body}`}
          >
            {hat.body_he}
          </p>
          <div data-layer="media" className="mt-10 w-full max-w-sm">
            <div className="md:rotate-[1.5deg]">
              <HatMedia type={hat.media.type} accent={accent} tone={tone} />
            </div>
          </div>
        </div>
      ) : (
        <div
          data-content
          className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6"
        >
        <div className="grid w-full items-center gap-10 md:grid-cols-2 md:gap-16">
          {showcase ? (
            <>
              {/* media first → RIGHT in RTL, tilted & lifted. The tilt is on an
                  inner wrapper so GSAP's transform (on data-layer) doesn't erase it. */}
              <div data-layer="media" className="w-full">
                <div className="md:-translate-y-8 md:rotate-[-3deg]">
                  <HatMedia type={hat.media.type} accent={accent} tone={tone} />
                </div>
              </div>
              {/* text second → LEFT in RTL, pushed lower */}
              <div className="md:translate-y-10">{textBlock}</div>
            </>
          ) : (
            <>
              {textBlock}
              <div data-layer="media" className="w-full">
                <HatMedia type={hat.media.type} accent={accent} tone={tone} />
              </div>
            </>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
