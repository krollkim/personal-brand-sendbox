"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global smooth-scroll (Lenis) wired to GSAP's ticker + ScrollTrigger. This is
 * the recommended integration: Lenis drives scroll, ScrollTrigger updates on
 * every Lenis scroll, and a single gsap.ticker RAF runs Lenis (lagSmoothing off
 * so pinned/scrubbed timelines stay locked to scroll on 120Hz screens).
 * Disabled entirely for prefers-reduced-motion — native scroll instead.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
