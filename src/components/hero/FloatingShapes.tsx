"use client";

/**
 * Atmospheric geometric layer that lives behind / around the portrait.
 * This is the "floating z-index layers" signature: some shapes sit BEHIND the
 * portrait (peeking through its feathered edges), some IN FRONT and overlap it.
 *
 * It coexists with the shader: the shader is the moving environment behind
 * everything, these crisp purple shapes give cheap depth around the portrait.
 *
 * Restraint: every shape is rendered, but only the ones marked [data-drift]
 * actually move — never more than 2-3 in motion at once.
 */

export function ShapesBack() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft purple atmosphere glow behind the portrait */}
      <div
        data-shape="blob"
        className="gpu absolute h-[560px] w-[560px] rounded-full opacity-0"
        style={{
          left: "calc(50% - 280px)",
          top: "calc(46% - 280px)",
          background:
            "radial-gradient(circle, rgba(107,63,160,0.16) 0%, rgba(107,63,160,0) 68%)",
          filter: "blur(10px)",
        }}
      />
      {/* large outlined ring — drifts */}
      <svg
        data-shape="ring-lg"
        data-drift
        className="gpu absolute left-[13%] top-[18%] opacity-0"
        width="360"
        height="360"
        viewBox="0 0 360 360"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="180" cy="180" r="179" stroke="#6B3FA0" strokeWidth="1" opacity="0.26" />
      </svg>
      {/* triangle outline — static */}
      <svg
        data-shape="triangle"
        className="gpu absolute bottom-[14%] right-[14%] opacity-0"
        width="158"
        height="158"
        viewBox="0 0 158 158"
        fill="none"
        aria-hidden="true"
      >
        <path d="M79 12 L148 140 L10 140 Z" stroke="#8A5FBE" strokeWidth="1.2" opacity="0.3" />
      </svg>
    </div>
  );
}

export function ShapesFront() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* small filled dot near the shoulder — drifts */}
      <div
        data-shape="dot"
        data-drift
        className="gpu absolute right-[22%] top-[28%] h-2.5 w-2.5 rounded-full opacity-0"
        style={{ background: "#6B3FA0" }}
      />
      {/* medium ring overlapping the portrait's upper edge — static */}
      <svg
        data-shape="ring-sm"
        className="gpu absolute left-[24%] top-[12%] opacity-0"
        width="92"
        height="92"
        viewBox="0 0 92 92"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="46" cy="46" r="45" stroke="#6B3FA0" strokeWidth="1.3" opacity="0.42" />
      </svg>
      {/* thin diagonal line accent — drifts */}
      <svg
        data-shape="line"
        data-drift
        className="gpu absolute bottom-[20%] left-[19%] opacity-0"
        width="130"
        height="130"
        viewBox="0 0 130 130"
        fill="none"
        aria-hidden="true"
      >
        <line x1="6" y1="124" x2="124" y2="6" stroke="#8A5FBE" strokeWidth="1.3" opacity="0.4" />
      </svg>
    </div>
  );
}
