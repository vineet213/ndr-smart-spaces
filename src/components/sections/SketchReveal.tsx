"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "./AveAcresProcess.module.css";

/* Artwork made by scripts/residential-sketch.mjs from one render. */
const SRC = {
  photo: "/images/residential/land-photo.jpg",
  photoSmall: "/images/residential/land-photo-1200.jpg",
  sketch: "/images/residential/land-sketch.png", // R ink, G hatching
  time: "/images/residential/land-timemap.png", // R ink, G hatching, B paint: when each pixel appears
} as const;
const IMAGE_ASPECT = 16 / 9;

/* Light extra smoothing on top of Lenis: share of the remaining distance per frame. */
const FOLLOW = 0.15;

/* Scroll progress (0-1) mapped onto each phase of the reveal. */
export function phases(p: number) {
  const span = (a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1);
  return {
    ink: span(0.02, 0.32),
    shade: span(0.22, 0.45),
    // starts just below 0 (nothing painted until the phase begins, even where
    // a stroke's time is 0) and ends a touch past 1 so the last strokes finish
    // eased in: the first sweeps are broad, so coverage would otherwise race ahead
    paint: Math.pow(span(0.45, 0.82), 1.6) * 1.12 - 0.05,
    full: span(0.8, 0.88),
    expand: span(0.88, 1),
  };
}

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/* One pass: the drawing appears where its time has come (ink grows along   */
/* its lines, hatching fills in bands), then the photograph is painted in   */
/* where the brush map's time has come, with the ink showing through the    */
/* fresh paint until the very end. The cursor brush adds its own paint.     */
const FRAGMENT = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D tPhoto;
uniform sampler2D tSketch;
uniform sampler2D tTime;
uniform vec2 uScale;
uniform float uInk;
uniform float uShade;
uniform float uPaint;
uniform float uFull;
uniform float uBrush;
uniform vec2 uMouse;
uniform float uAspect;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = (vUv - 0.5) * uScale + 0.5;
  vec3 photo = texture2D(tPhoto, uv).rgb;
  vec2 sk = texture2D(tSketch, uv).rg;
  vec3 tm = texture2D(tTime, uv).rgb;

  float ink = sk.r * smoothstep(tm.r - 0.004, tm.r + 0.012, uInk);
  float shade = sk.g * smoothstep(tm.g, tm.g + 0.07, uShade);
  float graphite = max(ink, shade * 0.62);

  vec3 paper = vec3(0.980, 0.969, 0.949) - hash(floor(uv * vec2(2400.0, 1350.0))) * 0.012;
  vec3 drawing = mix(paper, vec3(0.15, 0.14, 0.13), graphite);

  float paint = smoothstep(tm.b - 0.04, tm.b, uPaint);

  // cursor brush: a soft, bristled disc
  vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);
  float r = length(d) + (noise(vUv * vec2(90.0, 30.0)) - 0.5) * 0.03;
  paint = max(paint, uBrush * (1.0 - smoothstep(0.06, 0.12, r)));
  paint = max(paint, uFull);

  vec3 painted = photo * (1.0 - ink * 0.5 * (1.0 - uFull));
  gl_FragColor = vec4(mix(drawing, painted, paint), 1.0);
}`;

type SketchRevealProps = {
  /** Target scroll progress, 0-1, written by the parent on scroll. */
  targetRef: RefObject<number>;
  /** Called every frame with the smoothed progress (for the box transform). */
  onFrame?: (progress: number) => void;
  /** Cursor painting allowed (desktop, motion allowed). */
  brush: boolean;
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

export function SketchReveal({ targetRef, onFrame, brush, label }: SketchRevealProps) {
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
      ink: u("uInk"),
      shade: u("uShade"),
      paint: u("uPaint"),
      full: u("uFull"),
      brush: u("uBrush"),
      mouse: u("uMouse"),
      aspect: u("uAspect"),
    };
    ["tPhoto", "tSketch", "tTime"].forEach((name, i) => gl.uniform1i(u(name), i));

    let ready = false;
    let disposed = false;
    let frame = 0;
    let visible = false;
    let shown = targetRef.current ?? 0;
    let drawn = -1;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, inside: false };
    let brushAmount = 0;
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
      if (aspect > IMAGE_ASPECT) gl.uniform2f(uni.scale, 1, IMAGE_ASPECT / aspect);
      else gl.uniform2f(uni.scale, aspect / IMAGE_ASPECT, 1);
      gl.uniform1f(uni.aspect, aspect);
      dirty = true;
    };

    const draw = (p: number) => {
      const ph = phases(p);
      gl.uniform1f(uni.ink, ph.ink);
      gl.uniform1f(uni.shade, ph.shade);
      gl.uniform1f(uni.paint, ph.paint);
      gl.uniform1f(uni.full, ph.full);
      gl.uniform1f(uni.brush, brushAmount);
      gl.uniform2f(uni.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = () => {
      frame = 0;
      if (disposed) return;
      const target = targetRef.current ?? 0;
      shown += (target - shown) * FOLLOW;
      if (Math.abs(target - shown) < 0.0003) shown = target;
      mouse.x += (mouse.tx - mouse.x) * 0.2;
      mouse.y += (mouse.ty - mouse.y) * 0.2;
      const brushTarget = brush && mouse.inside && phases(shown).paint < 0.02 ? 1 : 0;
      brushAmount += (brushTarget - brushAmount) * 0.12;
      if (Math.abs(brushTarget - brushAmount) < 0.002) brushAmount = brushTarget;
      const moving =
        shown !== target ||
        brushAmount !== brushTarget ||
        Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.0005;
      if (ready && (dirty || shown !== drawn || moving)) {
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

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = (event.clientY - rect.top) / rect.height;
      if (!mouse.inside) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.inside = true;
      wake();
    };
    const onLeave = () => {
      mouse.inside = false;
      wake();
    };

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
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", wake);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      // The context is left to the browser to release with the canvas: forcing
      // it lost here breaks the immediate remount React does in development.
      gl.deleteProgram(program);
    };
  }, [targetRef, brush]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={SRC.photo} alt={label} className={styles.fallback} />
    );
  }

  return <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label} />;
}
