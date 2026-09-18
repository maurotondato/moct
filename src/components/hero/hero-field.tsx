"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * Campo de energía de marca.
 *
 * Es fbm con domain warping (ruido que deforma sus propias coordenadas), lo que
 * da las vetas orgánicas tipo aurora en vez del degradado plano de siempre.
 * La paleta sale del logo: negro violáceo -> índigo -> violeta eléctrico -> lavanda.
 */
const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uIntro;
  uniform float uScroll;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Coordenadas centradas y corregidas por aspecto: el campo no se estira.
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    float t = uTime * 0.05;

    // Domain warping en dos pasadas.
    vec2 q = vec2(
      fbm(p * 1.5 + t),
      fbm(p * 1.5 + vec2(3.2, 1.7) - t)
    );
    vec2 r = vec2(
      fbm(p * 1.5 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3),
      fbm(p * 1.5 + 2.0 * q + vec2(8.3, 2.8) - t * 1.1)
    );
    float f = fbm(p * 1.5 + 2.2 * r);

    // El puntero arrastra una zona de energía: el campo "responde".
    vec2 m = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float glow = exp(-length(p - m) * 2.4);

    float energy = f + glow * 0.30;

    // La energía se concentra a la derecha, igual que el gradiente del logo
    // original: el flanco izquierdo queda oscuro para que respire el titular.
    // En pantallas angostas ese sesgo dejaría todo negro (no hay "derecha" que
    // mostrar), así que se desvanece a medida que baja el aspecto.
    float aspect = uResolution.x / uResolution.y;
    float bias = smoothstep(0.80, 1.45, aspect);
    energy *= mix(1.0, mix(0.22, 1.0, smoothstep(-0.95, 0.90, p.x)), bias);

    vec3 cDeep   = vec3(0.020, 0.016, 0.047);
    vec3 cIndigo = vec3(0.122, 0.024, 0.525);
    vec3 cViolet = vec3(0.306, 0.078, 1.000);
    vec3 cLav    = vec3(0.706, 0.612, 1.000);

    // Umbrales altos: el violeta pleno aparece sólo en las crestas, no de fondo.
    vec3 col = cDeep;
    col = mix(col, cIndigo, smoothstep(0.40, 0.72, energy));
    col = mix(col, cViolet, smoothstep(0.66, 0.96, energy));
    col = mix(col, cLav, smoothstep(0.88, 1.05, energy) * 0.45);

    // Viñeta: mantiene el foco en el texto.
    col *= smoothstep(1.15, 0.28, length(p));

    // Baja general: el fondo acompaña, no compite.
    col *= 0.78;

    // El campo se apaga a medida que el hero sale de pantalla.
    col *= 1.0 - uScroll * 0.85;

    // Entrada: el campo se abre desde el centro.
    float reveal = smoothstep(0.0, 1.0, uIntro);
    col *= mix(smoothstep(1.1, 0.0, length(p)) * 0.6, 1.0, reveal);
    col *= reveal;

    // Grano: le saca el aspecto "digital limpio" y suma textura de impresión.
    col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function HeroField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        // Tope de 1.5: en pantallas 3x el costo se triplica y no se nota.
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        powerPreference: "high-performance",
      });
    } catch {
      // Sin WebGL no hay nada que limpiar: queda el degradado de respaldo
      // que ya está pintado en el contenedor.
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.42] },
        uIntro: { value: 0 },
        uScroll: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Objetivo vs. actual: el puntero se persigue con lerp para que el campo
    // se mueva con inercia en vez de saltar.
    const target = { x: 0.5, y: 0.42 };
    const current = { x: 0.5, y: 0.42 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    let scroll = 0;
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sin movimiento: un único fotograma, con el campo ya formado.
    if (prefersReduced) {
      program.uniforms.uTime.value = 12;
      program.uniforms.uIntro.value = 1;
      renderer.render({ scene: mesh });

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let frame = 0;
    let running = true;
    let startTime = 0;

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!running) return;

      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;

      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [current.x, current.y];
      program.uniforms.uIntro.value = Math.min(elapsed / 1.6, 1);
      program.uniforms.uScroll.value = scroll;

      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(loop);

    // Fuera de pantalla o pestaña oculta: no gastamos GPU.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        // El degradado va siempre puesto y el canvas (opaco) lo tapa cuando
        // WebGL arranca. Sirve de respaldo si no hay WebGL y, de paso, da color
        // desde el primer pintado en vez de un rectángulo negro.
        background:
          "radial-gradient(120% 90% at 72% 35%, var(--color-accent-deep) 0%, var(--color-ink-950) 62%)",
      }}
    />
  );
}
