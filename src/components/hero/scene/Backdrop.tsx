"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Large gradient backdrop plane that fills the camera view.
 * Warm taupe pocket in the center (so the feathered portrait blends with no
 * seam) easing out to a muted purple toward the edges — the start of the
 * "environment that deepens toward purple" as you scroll.
 */
export default function Backdrop() {
  const texture = useMemo(() => {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;

    const g = ctx.createRadialGradient(
      size / 2,
      size * 0.5,
      size * 0.08,
      size / 2,
      size * 0.5,
      size * 0.72
    );
    g.addColorStop(0, "#A6A096"); // taupe — matches hero.jpg bg
    g.addColorStop(0.4, "#938A96");
    g.addColorStop(0.72, "#6E5E89");
    g.addColorStop(1, "#4B3A6E"); // muted purple edges
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[44, 30]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}
