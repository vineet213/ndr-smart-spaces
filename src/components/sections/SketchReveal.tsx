"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "./AveAcresProcess.module.css";

/* Artwork made by scripts/residential-sketch.mjs from one render. */
const SRC = {
  photo: "/images/residential/masterplan-photo.jpg",
  photoSmall: "/images/residential/masterplan-photo-1200.jpg",
  sketch: "/images/residential/masterplan-sketch.png", // R roads, G plots, B boundary
  time: "/images/residential/masterplan-timemap.png", // R, G the drawing, B the colour: when each pixel appears
} as const;
const IMAGE_ASPECT = 80 / 41;

/* Light extra smoothing on top of Lenis: share of the remaining distance per frame. */
const FOLLOW = 0.15;

/* Scroll progress (0-1) mapped onto each phase of the reveal. */
export function phases(p: number) {
  const span = (a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1);
  return {
    boundary: span(0.02, 0.2),
    // the wave runs slightly past both ends so nothing shows early or stays undrawn
    roads: span(0.14, 0.32) * 1.08 - 0.04,
    plots: span(0.26, 0.45) * 1.08 - 0.04,
    colour: Math.pow(span(0.46, 0.82), 1.25) * 1.06 - 0.03,
    full: span(0.8, 0.88),
    expand: span(0.88, 1),
    // a slow push in while the plan is made, easing back before it opens out
    zoom: 1 - 0.05 * Math.sin(Math.PI * span(0, 0.88)),
  };
}

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/* One pass, in the order a site is made: the boundary is walked round in   */
/* gold from the entrance, the roads spread out from it, the plots and      */
/* their numbers follow, then colour comes in along the roads and block by  */
/* block, with the land around the site last.                               */
const FRAGMENT = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D tPhoto;
uniform sampler2D tSketch;
uniform sampler2D tTime;
uniform vec2 uScale;
uniform float uBoundary;
uniform float uRoads;
uniform float uPlots;
uniform float uColour;
uniform float uFull;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = (vUv - 0.5) * uScale + 0.5;
  vec3 photo = texture2D(tPhoto, uv).rgb;
  vec3 sk = texture2D(tSketch, uv).rgb;
  vec3 tm = texture2D(tTime, uv).rgb;

  // the boundary is walked round the site, starting at the bottom
  float walk = fract(atan(uv.y - 0.45, uv.x - 0.5) / 6.28318 + 0.75);
  float boundary = sk.b * smoothstep(walk - 0.012, walk + 0.012, uBoundary * 1.03);
  float roads = sk.r * smoothstep(tm.r - 0.03, tm.r + 0.03, uRoads);
  float plots = sk.g * smoothstep(tm.g - 0.04, tm.g + 0.04, uPlots);
  float line = max(roads, plots);

  vec3 paper = vec3(0.980, 0.969, 0.949) - hash(floor(uv * vec2(2400.0, 1230.0))) * 0.008;
  vec3 drawing = mix(paper, vec3(0.15, 0.14, 0.13), line);
  vec3 gold = vec3(0.84, 0.59, 0.23);
  drawing = mix(drawing, gold, boundary);

  float colour = max(smoothstep(tm.b - 0.035, tm.b + 0.005, uColour), uFull);

  // the lines stay faintly over fresh colour, then settle into it
  vec3 painted = photo * (1.0 - line * 0.3 * (1.0 - uFull));
  painted = mix(painted, gold, boundary * 0.8 * (1.0 - uFull));
  gl_FragColor = vec4(mix(drawing, painted, colour), 1.0);
}`;

type SketchRevealProps = {
  /** Target scroll progress, 0-1, written by the parent on scroll. */
  targetRef: RefObject<number>;
  /** Called every frame with the smoothed progress (for the box transform). */
  onFrame?: (progress: number) => void;
  label: string;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function SketchReveal({ targetRef, onFrame, label }: SketchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFrameRef = useRef(onFrame);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uni = {
      scale: u("uScale"),
      boundary: u("uBoundary"),
      roads: u("uRoads"),
      plots: u("uPlots"),
      colour: u("uColour"),
      full: u("uFull"),
    };
    ["tPhoto", "tSketch", "tTime"].forEach((name, i) => gl.uniform1i(u(name), i));

    let ready = false;
    let disposed = false;
    let frame = 0;
    let visible = false;
    let shown = targetRef.current ?? 0;
    let drawn = -1;
    let cover: [number, number] = [1, 1];
    let dirty = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
      // cover: crop the 16:9 artwork to the box
      cover = aspect > IMAGE_ASPECT ? [1, IMAGE_ASPECT / aspect] : [aspect / IMAGE_ASPECT, 1];
      dirty = true;
    };

    const draw = (p: number) => {
      const ph = phases(p);
      gl.uniform2f(uni.scale, cover[0] * ph.zoom, cover[1] * ph.zoom);
      gl.uniform1f(uni.boundary, ph.boundary);
      gl.uniform1f(uni.roads, ph.roads);
      gl.uniform1f(uni.plots, ph.plots);
      gl.uniform1f(uni.colour, ph.colour);
      gl.uniform1f(uni.full, ph.full);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = () => {
      frame = 0;
      if (disposed) return;
      const target = targetRef.current ?? 0;
      shown += (target - shown) * FOLLOW;
      if (Math.abs(target - shown) < 0.0003) shown = target;
      if (ready && (dirty || shown !== drawn)) {
        draw(shown);
        drawn = shown;
        dirty = false;
      }
      onFrameRef.current?.(shown);
      if (visible) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const small = window.matchMedia("(max-width: 900px)").matches;
    Promise.all([
      loadImage(small ? SRC.photoSmall : SRC.photo),
      loadImage(SRC.sketch),
      loadImage(SRC.time),
    ])
      .then((images) => {
        if (disposed) return;
        images.forEach((img, i) => {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        });
        ready = true;
        dirty = true;
        wake();
      })
      .catch(() => setFailed(true));

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersection.observe(canvas);
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", wake);
      // The context is left to the browser to release with the canvas: forcing
      // it lost here breaks the immediate remount React does in development.
      gl.deleteProgram(program);
    };
  }, [targetRef]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={SRC.photo} alt={label} className={styles.fallback} />
    );
  }

  return <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label} />;
}
