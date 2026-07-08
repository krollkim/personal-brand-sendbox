"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";
import type { WorkTypeKey } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Outlined category chips — colour ties each project back to a hat.
const TYPE_STYLE: Record<WorkTypeKey, string> = {
  build: "border-purple/35 text-purple-deep",
  content: "border-fuchsia/40 text-fuchsia-ink",
  guide: "border-purple-soft/50 text-purple-soft",
};

function Mockup({ label, ratio = "aspect-[4/3]" }: { label: string; ratio?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-surface shadow-[0_24px_60px_-30px_rgba(78,44,119,0.3)] transition-transform duration-500 group-hover:-translate-y-1.5 ${ratio}`}
    >
      <div className="absolute inset-x-0 top-0 flex h-9 items-center gap-1.5 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm tracking-[0.3em] text-ink-muted/50">{label}</span>
      </div>
    </div>
  );
}

function Meta({
  name,
  typeKey,
  typeLabel,
  oneLiner,
}: {
  name: string;
  typeKey: WorkTypeKey;
  typeLabel: string;
  oneLiner: string;
}) {
  return (
    <div className="text-start">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_STYLE[typeKey]}`}
      >
        {typeLabel}
      </span>
      <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{name}</h3>
      <p className="mt-2 text-base leading-relaxed text-ink-muted">{oneLiner}</p>
    </div>
  );
}

/** "מה יצא לי מהראש" — the proof/portfolio. A calm editorial gallery: one featured
 *  project, then a grid. Placeholder cards, styled to look real, for Kim to fill. */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  const [featured, ...rest] = t.work.projects;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-card]").forEach((el, i) => {
          gsap.from(el, {
            y: 44,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className="relative bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* header */}
        <div className="mb-14 text-start sm:mb-20">
          <span className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-ink">
            <span className="h-px w-10 bg-purple" />
            {t.work.kicker}
          </span>
          <h2 className="text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tightest text-ink">
            {t.work.title}
            <span className="text-fuchsia">.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-muted sm:text-xl">{t.work.subtitle}</p>
        </div>

        {/* featured */}
        <article
          data-card
          className="group mb-6 grid gap-8 md:mb-8 md:grid-cols-2 md:items-center lg:gap-12"
        >
          <Mockup label={t.work.preview} ratio="aspect-[16/10]" />
          <Meta
            name={featured.name}
            typeKey={featured.type}
            typeLabel={t.work.types[featured.type]}
            oneLiner={featured.oneLiner}
          />
        </article>

        {/* the rest */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((pr) => (
            <article key={pr.name} data-card className="group flex flex-col gap-4">
              <Mockup label={t.work.preview} />
              <Meta
                name={pr.name}
                typeKey={pr.type}
                typeLabel={t.work.types[pr.type]}
                oneLiner={pr.oneLiner}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
