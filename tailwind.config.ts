import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY — the site is white. White dominates everything.
        canvas: "#FFFFFF",
        surface: "#F7F5FA", // faint purple-tinted off-white for subtle surfaces

        // INK — text on white
        ink: "#0A0A0A",
        "ink-muted": "#6B6B72",

        // SECONDARY — purple (brand)
        purple: {
          DEFAULT: "#6B3FA0",
          deep: "#4E2C77",
          soft: "#8A5FBE",
          tint: "#F1EAF8",
        },

        // ACCENT — fuchsia pink (the "third color"): minimal splashes / points only
        fuchsia: {
          DEFAULT: "#E11D8B",
          soft: "#F25CB0",
          tint: "#FCE7F3",
        },
      },
      backgroundImage: {
        // "pearlescent" accent — reserved for rare, special moments
        pearl: "linear-gradient(120deg, #6B3FA0 0%, #B0379E 50%, #E11D8B 100%)",
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
