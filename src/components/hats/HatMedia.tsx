"use client";

import type { HatMediaType } from "@/lib/hats";
import { useLang } from "@/lib/i18n";

/**
 * Renders a hat's media block by type. These are framed placeholders — Kim
 * drops in real projects / videos / images later. The frame itself reads as
 * premium (a glassy device chrome lit by the world's accent).
 */
export default function HatMedia({
  type,
  accent,
  tone = "dark",
}: {
  type: HatMediaType;
  accent: string;
  tone?: "dark" | "light";
}) {
  const { t } = useLang();
  const label = t.media[type];
  const dark = tone === "dark";

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border backdrop-blur-sm"
      style={{
        aspectRatio: type === "project" ? "16 / 10" : "4 / 3",
        borderColor: `${accent}66`,
        background: dark
          ? `linear-gradient(150deg, ${accent}33 0%, rgba(10,7,18,0.5) 70%)`
          : `linear-gradient(150deg, ${accent}22 0%, rgba(255,255,255,0.55) 70%)`,
        boxShadow: `0 30px 80px -30px ${accent}, inset 0 1px 0 0 ${
          dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"
        }`,
      }}
    >
      {/* browser/device chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/25" : "bg-ink/20"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/20" : "bg-ink/15"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
      </div>

      {/* placeholder body */}
      <div className="flex h-[calc(100%-2.75rem)] flex-col items-center justify-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg"
          style={{ background: `${accent}40`, color: dark ? "#fff" : "#2A1A40" }}
          aria-hidden="true"
        >
          {type === "video" ? "▶" : type === "image" ? "◳" : "❖"}
        </span>
        <span
          className={`text-sm font-medium tracking-wide ${
            dark ? "text-white/70" : "text-ink/60"
          }`}
        >
          [{label}]
        </span>
      </div>
    </div>
  );
}
