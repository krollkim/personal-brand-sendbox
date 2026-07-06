"use client";

import { forwardRef } from "react";

/**
 * Kim Kroll monogram — geometric "KK" mark used as the opening logo.
 * On load it animates in, then expands/dissolves into the background shapes
 * (the "logo-to-background reveal"). Drawn with strokes so it reads sharp
 * and minimal, not decorative.
 */
const Monogram = forwardRef<SVGSVGElement>(function Monogram(_props, ref) {
  return (
    <svg
      ref={ref}
      className="gpu"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* outer ring */}
      <circle
        data-mono="ring"
        cx="60"
        cy="60"
        r="54"
        stroke="#6B3FA0"
        strokeWidth="1.5"
        opacity="0.55"
      />
      {/* first K */}
      <g data-mono="k1" stroke="#6B3FA0" strokeWidth="3" strokeLinecap="round">
        <line x1="44" y1="34" x2="44" y2="86" />
        <line x1="44" y1="60" x2="68" y2="34" />
        <line x1="44" y1="60" x2="68" y2="86" />
      </g>
      {/* second K (offset, lighter — the doubled initial) */}
      <g
        data-mono="k2"
        stroke="#8A5FBE"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      >
        <line x1="62" y1="34" x2="62" y2="86" />
        <line x1="62" y1="60" x2="86" y2="34" />
        <line x1="62" y1="60" x2="86" y2="86" />
      </g>
    </svg>
  );
});

export default Monogram;
