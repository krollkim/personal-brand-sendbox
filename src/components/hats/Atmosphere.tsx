"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type AtmosphereVariant = "grid" | "fluid" | "clean" | "flow" | "soft";

/**
 * Shared per-world atmosphere. Same skeleton for every world — only the hue,
 * fog and treatment change. GPU-friendly (CSS + gradients), smooth on 120Hz.
 *
 *  - "clean": white minimal, a whisper of a structured grid (design-system
 *             direction — e.g. בונה)
 *  - "grid":  structured perspective grid, dark/deep (legacy dark direction)
 *  - "fluid": soft organic blobs, light/airy (legacy)
 */
export default function Atmosphere({
  accent,
  base,
  variant,
  animate = true,
}: {
  accent: string;
  base: string;
  variant: AtmosphereVariant;
  animate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animate || !ref.current) return;
      if (variant === "grid") {
        gsap.to(ref.current.querySelectorAll("[data-grid]"), {
          backgroundPositionY: "+=64px",
          duration: 5,
          ease: "none",
          repeat: -1,
        });
      } else if (variant === "fluid" || variant === "flow") {
        gsap.to(ref.current.querySelectorAll("[data-blob]"), {
          x: "random(-50,50)",
          y: "random(-36,36)",
          scale: "random(0.9,1.18)",
          duration: "random(7,11)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.6,
        });
      }
      // "clean" is intentionally static — restraint over motion.
    },
    { scope: ref, dependencies: [variant, animate] }
  );

  if (variant === "soft") {
    return (
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        {/* one calm, centered glow — quiet & human (מלווה). Static. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(200,121,78,0.07) 0%, rgba(107,63,160,0.05) 55%, transparent 76%)",
          }}
        />
      </div>
    );
  }

  if (variant === "flow") {
    return (
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        {/* soft organic blobs — the "creator" fluidity, kept very light so white
            still dominates. They drift slowly (intentional motion). */}
        <div
          data-blob
          className="gpu absolute left-[12%] top-[15%] h-[46vh] w-[46vh] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(107,63,160,0.11) 0%, transparent 70%)" }}
        />
        <div
          data-blob
          className="gpu absolute bottom-[12%] right-[10%] h-[52vh] w-[52vh] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(225,29,139,0.09) 0%, transparent 72%)" }}
        />
        <div
          data-blob
          className="gpu absolute right-[32%] top-[42%] h-[34vh] w-[34vh] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(107,63,160,0.08) 0%, transparent 72%)" }}
        />
      </div>
    );
  }

  if (variant === "clean") {
    return (
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        {/* a whisper of a structured grid — a restrained nod to "builder" */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(107,63,160,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(107,63,160,0.06) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
            WebkitMaskImage:
              "radial-gradient(115% 95% at 50% 42%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 80%)",
            maskImage:
              "radial-gradient(115% 95% at 50% 42%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 80%)",
          }}
        />
        {/* one soft pearlescent glow — the single restrained color moment */}
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[52vh] w-[52vh] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(225,29,139,0.5) 0%, rgba(107,63,160,0.4) 55%, transparent 100%)",
            opacity: 0.14,
          }}
        />
      </div>
    );
  }

  if (variant === "fluid") {
    return (
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(120% 110% at 50% 28%, ${base} 0%, #E4DAF0 60%, #D7CBEA 100%)`,
        }}
      >
        <div
          data-blob
          className="gpu absolute left-[14%] top-[18%] h-[42vh] w-[42vh] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
            filter: "blur(6px)",
          }}
        />
        <div
          data-blob
          className="gpu absolute right-[12%] top-[34%] h-[50vh] w-[50vh] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}40 0%, transparent 72%)`,
            filter: "blur(10px)",
          }}
        />
        <div
          data-blob
          className="gpu absolute bottom-[8%] left-[40%] h-[36vh] w-[36vh] rounded-full"
          style={{
            background: "radial-gradient(circle, #FFFFFF99 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        {/* soft light vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(120,100,150,0.18) 100%)",
          }}
        />
      </div>
    );
  }

  // grid
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(125% 100% at 50% 8%, ${base} 0%, #0A0712 100%)`,
      }}
    >
      <div
        data-grid
        aria-hidden="true"
        className="gpu absolute bottom-[-12%] left-1/2 h-[78%] w-[220%]"
        style={{
          transform: "translateX(-50%) perspective(440px) rotateX(63deg)",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(${accent}66 1px, transparent 1px), linear-gradient(90deg, ${accent}66 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          WebkitMaskImage:
            "linear-gradient(to top, #000 4%, rgba(0,0,0,0.35) 40%, transparent 78%)",
          maskImage:
            "linear-gradient(to top, #000 4%, rgba(0,0,0,0.35) 40%, transparent 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(90% 70% at 50% 38%, ${accent}26 0%, transparent 55%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, transparent 45%, rgba(10,7,18,0.55) 100%)",
        }}
      />
    </div>
  );
}
