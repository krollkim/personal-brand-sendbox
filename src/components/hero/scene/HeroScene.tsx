"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Backdrop from "./Backdrop";
import Portrait3D from "./Portrait3D";

/**
 * The atmospheric hero scene: a soft gradient world the portrait lives inside.
 * ONLY the portrait is animated (gentle float + pointer parallax) — no geometry,
 * no particles, per Kim's direction. Mounted only on capable devices — the
 * static fallback is handled by the parent.
 */
export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#6E5E89")}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 5]} intensity={30} color="#B89BE0" />
      <pointLight position={[-5, -2, 3]} intensity={22} color="#6B3FA0" />

      <Backdrop />
      <Suspense fallback={null}>
        <Portrait3D />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>

      <AdaptiveDpr />
    </Canvas>
  );
}
