"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * The portrait as a textured plane living INSIDE the 3D scene.
 * A radial alpha map feathers the edges so the photo's beige background melts
 * into the backdrop — the portrait reads as part of the environment, with
 * floating geometry able to pass in front of and behind it.
 */
export default function Portrait3D() {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useTexture("/images/hero/hero.jpg");
  map.colorSpace = THREE.SRGBColorSpace;

  const alphaMap = useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
    const g = ctx.createRadialGradient(
      size / 2,
      size * 0.47,
      size * 0.14,
      size / 2,
      size * 0.52,
      size * 0.56
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.62, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = -0.35 + Math.sin(t * 0.55) * 0.04;
    // gentle parallax tilt toward the pointer
    m.rotation.y += (state.pointer.x * 0.1 - m.rotation.y) * 0.045;
    m.rotation.x += (-state.pointer.y * 0.06 - m.rotation.x) * 0.045;
  });

  return (
    <mesh ref={mesh} position={[0, -0.35, 0]}>
      <planeGeometry args={[2.7, 2.7]} />
      <meshBasicMaterial
        map={map}
        alphaMap={alphaMap}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
