"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Kind = "ico" | "torus" | "sphere" | "octa";

type Obj = {
  pos: [number, number, number];
  scale: number;
  kind: Kind;
  color: string;
  wire?: boolean;
  speed: number;
};

// A handful of purple geometric elements at varying depths. Some sit BEHIND
// the portrait (negative z), some IN FRONT (positive z) — real 3D depth.
const OBJECTS: Obj[] = [
  { pos: [-2.7, 1.3, -1.6], scale: 0.95, kind: "ico", color: "#6B3FA0", wire: true, speed: 0.45 },
  { pos: [2.9, 0.7, -2.2], scale: 1.25, kind: "torus", color: "#8A5FBE", wire: true, speed: 0.4 },
  { pos: [2.35, -1.5, 1.3], scale: 0.26, kind: "sphere", color: "#9A6FD0", speed: 0.7 },
  { pos: [-2.45, -1.1, 1.5], scale: 0.55, kind: "octa", color: "#6B3FA0", wire: true, speed: 0.55 },
  { pos: [-1.9, 2.0, 0.9], scale: 0.16, kind: "sphere", color: "#B89BE0", speed: 0.85 },
  { pos: [1.7, 1.85, -0.5], scale: 0.62, kind: "ico", color: "#8A5FBE", wire: true, speed: 0.5 },
  { pos: [0.3, -2.1, 0.6], scale: 0.2, kind: "sphere", color: "#9A6FD0", speed: 0.75 },
];

function Geometry({ kind }: { kind: Kind }) {
  switch (kind) {
    case "ico":
      return <icosahedronGeometry args={[1, 0]} />;
    case "torus":
      return <torusGeometry args={[1, 0.32, 16, 48]} />;
    case "octa":
      return <octahedronGeometry args={[1, 0]} />;
    case "sphere":
    default:
      return <sphereGeometry args={[1, 24, 24]} />;
  }
}

export default function FloatingObjects() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    g.children.forEach((child, i) => {
      const o = OBJECTS[i];
      if (!o) return;
      child.position.y = o.pos[1] + Math.sin(t * o.speed + i * 1.7) * 0.2;
      child.position.x = o.pos[0] + Math.cos(t * o.speed * 0.8 + i) * 0.14;
      child.rotation.x += 0.0016;
      child.rotation.y += 0.0022;
    });

    // whole-group parallax toward the pointer for depth
    g.rotation.y += (state.pointer.x * 0.16 - g.rotation.y) * 0.04;
    g.rotation.x += (-state.pointer.y * 0.1 - g.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      {OBJECTS.map((o, i) => (
        <mesh key={i} position={o.pos} scale={o.scale}>
          <Geometry kind={o.kind} />
          {o.wire ? (
            <meshBasicMaterial
              color={o.color}
              wireframe
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={1.5}
              roughness={0.35}
              metalness={0.1}
              toneMapped={false}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}
