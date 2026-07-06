"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Atmospheric VIDEO background — used for hat2 only (experimental).
 *
 * Performance / UX rules:
 *  - preload="none" + lazy: the video element (and its sources) only mount once
 *    the world is APPROACHING the viewport, so it never slows the hero.
 *  - Mobile / prefers-reduced-motion: the video is NOT loaded at all — a static
 *    poster image is shown instead (autoplay video wastes battery/data and is
 *    often blocked on mobile).
 *  - Until the video is ready, the poster image is shown (no blank frame).
 */
export default function VideoAtmosphere({
  base,
  poster,
  webm,
  mp4,
}: {
  base: string;
  poster: string;
  webm: string;
  mp4: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capable, setCapable] = useState(false);
  const [load, setLoad] = useState(false);

  // Decide whether this device should play video at all.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    setCapable(!reduce && !small);
  }, []);

  // Lazy trigger: load only when the world is near the viewport.
  useEffect(() => {
    if (!capable || !rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 1600px 600px 1600px" }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [capable]);

  // Kick off playback once the sources are mounted.
  useEffect(() => {
    if (!load || !videoRef.current) return;
    const v = videoRef.current;
    v.load();
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [load]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: base }}
    >
      {capable && load ? (
        <video
          ref={videoRef}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="gpu absolute inset-0 h-full w-full object-cover"
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      ) : (
        // Fallback / pre-load: static poster (mobile, reduced-motion, or not yet loaded)
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
