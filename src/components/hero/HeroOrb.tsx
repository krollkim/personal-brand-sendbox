"use client";

import { useEffect, useRef } from "react";

/**
 * HeroOrb — a lightweight rotating dot-sphere rendered on a plain Canvas 2D.
 * No Three.js / WebGL / dependencies. Decorative (aria-hidden), transparent
 * background so the hero background shows through.
 *
 *  - ~150 points on a Fibonacci sphere, slow auto-rotation + gentle mouse parallax
 *  - thin links between nearby points (network mesh)
 *  - colour interpolates purple (#7c3aed) → magenta (#e6197f) by position
 *  - DPR-aware (crisp on retina), responsive to the container size
 *  - one rAF loop; pauses when offscreen / tab hidden; static on reduced-motion
 */

const N = 150;
const CONNECT = 0.42; // 3D distance threshold for drawing a link
const C1 = [124, 58, 237]; // #7c3aed
const C2 = [230, 25, 127]; // #e6197f

const rgb = (t: number) => {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const r = Math.round(C1[0] + (C2[0] - C1[0]) * k);
  const g = Math.round(C1[1] + (C2[1] - C1[1]) * k);
  const b = Math.round(C1[2] + (C2[2] - C1[2]) * k);
  return `${r},${g},${b}`;
};

type Pt = { x: number; y: number; z: number; t: number };

function fibonacciSphere(n: number): Pt[] {
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    const x = Math.cos(th) * r;
    const z = Math.sin(th) * r;
    pts.push({ x, y, z, t: (x + 1) / 2 }); // hue by original x (rotates with sphere)
  }
  return pts;
}

export default function HeroOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = fibonacciSphere(N);
    const proj = new Array(N) as {
      sx: number;
      sy: number;
      z: number;
      scale: number;
      t: number;
    }[];

    let W = 0;
    let H = 0;

    const resize = () => {
      if (!ctx) return;
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); // keep the static / paused frame correct on resize
    };

    // motion state
    let autoRotY = 0;
    let targetPX = 0;
    let targetPY = 0;
    let px = 0;
    let py = 0;

    const onPointer = (e: PointerEvent) => {
      targetPX = e.clientX / window.innerWidth - 0.5;
      targetPY = e.clientY / window.innerHeight - 0.5;
    };

    function draw() {
      if (!ctx || !W || !H) return;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.42;

      px += (targetPX - px) * 0.05;
      py += (targetPY - py) * 0.05;

      const ry = autoRotY + px * 0.9;
      const rx = -py * 0.6;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      for (let i = 0; i < N; i++) {
        const p = base[i];
        // rotate around Y then X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const scale = 1 + z2 * 0.32; // depth: nearer points bigger
        proj[i] = {
          sx: cx + x1 * R,
          sy: cy + y2 * R,
          z: z2,
          scale,
          t: p.t,
        };
      }

      ctx.clearRect(0, 0, W, H);

      // links between nearby points
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        const a = base[i];
        for (let j = i + 1; j < N; j++) {
          const b = base[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d >= CONNECT) continue;
          const pa = proj[i];
          const pb = proj[j];
          const depth = (pa.z + pb.z) * 0.5; // -1..1
          const alpha = (1 - d / CONNECT) * (0.16 + depth * 0.12);
          if (alpha <= 0.012) continue;
          ctx.strokeStyle = `rgba(${rgb((pa.t + pb.t) * 0.5)},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // points
      for (let i = 0; i < N; i++) {
        const p = proj[i];
        const depth = (p.z + 1) * 0.5; // 0 back .. 1 front
        const r = (1.1 + depth * 2.1) * p.scale;
        const alpha = 0.32 + depth * 0.62;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb(p.t)},${alpha.toFixed(3)})`;
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- animation loop with pause controls ---
    let raf = 0;
    let running = false;
    const loop = () => {
      autoRotY += 0.0018;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let inView = true;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (!document.hidden && inView) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) {
      draw(); // single static frame, no loop, no pointer tracking
    } else {
      window.addEventListener("pointermove", onPointer);
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!reduce) window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
