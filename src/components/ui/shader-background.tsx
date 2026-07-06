"use client";

import { useEffect, useRef } from "react";

/**
 * Plasma-grid flowing-lines shader, adapted for Kim Kroll's hero.
 *
 * Adaptations vs. the source shader:
 *  - Base color is a neutral warm taupe sampled from hero.jpg (#A29B90) so the
 *    portrait sits in the same environment with no visible seam. The original
 *    dark blue/purple background (which faded to black at the edges) is gone.
 *  - Lines stay neon purple (#6B3FA0) but are heavily dialed back in intensity —
 *    atmospheric presence, never dominant.
 *  - overallSpeed lowered (0.2 -> 0.07) so the lines drift slowly and calmly.
 *  - GPU-friendly: capped DPR, single full-screen draw, paused when offscreen or
 *    when the tab is hidden. Static fallback for mobile / low-core / reduced-motion.
 */

type ShaderBackgroundProps = {
  className?: string;
  /** Overall line brightness. Keep low for a premium, restrained feel. */
  intensity?: number;
};

const VERTEX_SRC = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const FRAGMENT_SRC = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float uIntensity;

  const float overallSpeed = 0.07;
  const float gridSmoothWidth = 0.015;
  const float scale = 5.0;
  const vec4 lineColor = vec4(0.420, 0.247, 0.627, 1.0); // #6B3FA0
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  // neutral taupe base, matched to hero.jpg background (#A29B90).
  // The vertical mid-tone lands exactly on the photo bg so the portrait's
  // feathered halo meets the shader with no seam.
  const vec3 bgBottom = vec3(0.600, 0.573, 0.530);
  const vec3 bgTop    = vec3(0.670, 0.643, 0.600);

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
    float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec4 lines = vec4(0.0);
    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float lineVal = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.01, space) * 1.2;

      lineVal = lineVal + circle;
      lines += lineVal * lineColor * rand;
    }

    // atmospheric only: taper near top/bottom edges and dial the whole thing down
    lines *= uIntensity * (0.32 + 0.68 * verticalFade);

    vec3 bg = mix(bgBottom, bgTop, uv.y);
    gl_FragColor = vec4(bg + lines.rgb, 1.0);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

export default function ShaderBackground({
  className,
  intensity = 0.45,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    // No WebGL -> the canvas keeps its CSS gradient fallback (see style below).
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aVertexPosition");
    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (timeSeconds: number) => {
      resize();
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeSeconds);
      gl.uniform1f(uIntensity, intensity);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // ---- Decide animate vs. static (mobile / weak device / reduced motion) ----
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmallScreen = window.innerWidth < 768;
    const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
    const shouldAnimate = !prefersReduced && !isSmallScreen && !lowCores;

    let rafId = 0;
    let startTime = performance.now();
    let running = false;

    const loop = () => {
      const t = (performance.now() - startTime) / 1000;
      draw(t);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      startTime = performance.now() - 6000; // begin mid-flow, not from a flat frame
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onResize = () => {
      if (!running) draw(8.0); // keep static frame crisp through resizes
    };
    window.addEventListener("resize", onResize);

    if (!shouldAnimate) {
      // single, pleasant static frame — no rAF loop at all
      draw(8.0);
      return () => {
        window.removeEventListener("resize", onResize);
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
      };
    }

    // Pause when the tab is hidden
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Pause when the hero scrolls out of view
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    // Recover from a lost GPU context
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    start();

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "h-full w-full"}
      // CSS fallback paints instantly (pre-WebGL) and covers no-WebGL devices
      style={{
        display: "block",
        background:
          "linear-gradient(to top, #999287 0%, #A29B90 50%, #ABA499 100%)",
      }}
    />
  );
}
