"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Campo de fondo para todo lo que va debajo del hero.
 *
 * Es una capa fija que no se mueve con el scroll: lo que cambia es su carácter.
 * Cada sección tiene su propia densidad de grilla, energía y matiz, y al cruzar
 * de una a otra sale un anillo que recorre la pantalla. Así la página se siente
 * como un sistema encendido de punta a punta en vez de un fondo negro con
 * bloques de texto.
 *
 * Nunca dibuja al mismo tiempo que el campo del hero: mientras el hero está en
 * pantalla este bucle queda frenado, así nunca hay dos shaders a pantalla
 * completa compitiendo por la GPU.
 */

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uDensity;
  uniform float uEnergy;
  uniform float uHue;
  uniform float uPulse;
  uniform float uFade;

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
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    float t = uTime;

    // La grilla deriva despacio en diagonal: nunca está del todo quieta.
    vec2 gp = p * uDensity + vec2(t * 0.02, -t * 0.035);
    vec2 cellPos = fract(gp) - 0.5;

    // Líneas finas en los ejes de la celda.
    vec2 gf = abs(cellPos);
    float grid = smoothstep(0.032, 0.0, min(gf.x, gf.y));

    // Nodo en cada cruce, latiendo en una onda diagonal que atraviesa la grilla.
    float node = smoothstep(0.08, 0.0, length(cellPos));
    vec2 cell = floor(gp);
    float wave = sin((cell.x + cell.y) * 0.6 - t * 1.05) * 0.5 + 0.5;
    node *= 0.2 + wave * 0.95;

    // Niebla de fondo: le da profundidad para que la grilla no flote sobre negro plano.
    float fog = fbm(p * 1.1 + vec2(t * 0.03, -t * 0.02));

    // Banda de escaneo que sube y vuelve a empezar.
    float scan = exp(-abs(p.y - (fract(t * 0.06) * 2.6 - 1.3)) * 4.5);

    // Al cambiar de sección, un anillo se expande desde el centro.
    float r = length(p);
    float front = (1.0 - uPulse) * 2.4;
    float ring = exp(-abs(r - front) * 8.0) * uPulse;

    vec3 violet = vec3(0.306, 0.078, 1.000);
    vec3 blue = vec3(0.180, 0.320, 1.000);
    vec3 accent = mix(violet, blue, uHue);
    vec3 lav = vec3(0.706, 0.612, 1.000);

    vec3 col = vec3(0.016, 0.013, 0.039);
    col += accent * fog * 0.20 * uEnergy;
    col += accent * grid * 0.14 * uEnergy;
    col += lav * node * 0.30 * uEnergy;
    col += accent * scan * 0.10 * uEnergy;
    col += lav * ring * 0.45;

    // El puntero enciende la zona que tiene alrededor.
    vec2 m = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    col += accent * exp(-length(p - m) * 2.8) * 0.13 * uEnergy;

    col *= smoothstep(1.55, 0.25, r);
    col *= uFade;

    col += (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.024;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Carácter de cada sección: densidad de grilla, energía y matiz. */
const SECTION_LOOKS: Record<string, { density: number; energy: number; hue: number }> = {
  diagnostico: { density: 8, energy: 0.8, hue: 0.0 },
  servicios: { density: 15, energy: 1.0, hue: 0.18 },
  proceso: { density: 6.5, energy: 0.9, hue: 0.38 },
  nosotros: { density: 11, energy: 0.95, hue: 0.12 },
  preguntas: { density: 5.5, energy: 0.6, hue: 0.0 },
  contacto: { density: 10, energy: 1.15, hue: 0.06 },
};

const DEFAULT_LOOK = { density: 9, energy: 0.8, hue: 0 };

export function SectionsField({ heroId = "hero" }: { heroId?: string }) {
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
        // Esta capa está fija y acompaña todo el scroll, así que paga su costo
        // durante casi toda la visita. En pantallas chicas, donde además el
        // hardware suele ser más modesto, se dibuja a resolución nativa 1x.
        dpr:
          window.innerWidth < 768
            ? 1
            : Math.min(window.devicePixelRatio || 1, 1.5),
        powerPreference: "high-performance",
      });
    } catch {
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
        uMouse: { value: [0.5, 0.5] },
        uDensity: { value: DEFAULT_LOOK.density },
        uEnergy: { value: DEFAULT_LOOK.energy },
        uHue: { value: DEFAULT_LOOK.hue },
        uPulse: { value: 0 },
        uFade: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };
    resize();
    window.addEventListener("resize", resize);

    // Objetivos a los que el campo se acerca de a poco, para que el cambio de
    // sección sea un deslizamiento y no un corte.
    const target = { ...DEFAULT_LOOK };
    const current = { ...DEFAULT_LOOK };
    const mouse = { x: 0.5, y: 0.5 };
    const mouseTarget = { x: 0.5, y: 0.5 };

    let pulse = 0;
    let activeId = "";

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    ).filter((section) => section.id !== heroId);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          if (id === activeId) continue;
          activeId = id;
          const look = SECTION_LOOKS[id] ?? DEFAULT_LOOK;
          target.density = look.density;
          target.energy = look.energy;
          target.hue = look.hue;
          // Cruzar de sección dispara el anillo.
          if (!prefersReduced) pulse = 1;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const onPointerMove = (event: PointerEvent) => {
      mouseTarget.x = event.clientX / window.innerWidth;
      mouseTarget.y = 1 - event.clientY / window.innerHeight;
    };
    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Mientras el hero está en pantalla, su propio campo tapa a éste: frenamos
    // el bucle para no tener dos shaders a pantalla completa a la vez.
    let heroVisible = true;
    const hero = document.getElementById(heroId);
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    if (hero) heroObserver.observe(hero);
    else heroVisible = false;

    if (prefersReduced) {
      // Sin movimiento: un único fotograma, con el campo ya formado y quieto.
      program.uniforms.uTime.value = 8;
      program.uniforms.uFade.value = 1;
      renderer.render({ scene: mesh });

      return () => {
        window.removeEventListener("resize", resize);
        sectionObserver.disconnect();
        heroObserver.disconnect();
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let frame = 0;
    let startTime = 0;
    let visible = true;

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || heroVisible) return;

      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;

      current.density += (target.density - current.density) * 0.04;
      current.energy += (target.energy - current.energy) * 0.05;
      current.hue += (target.hue - current.hue) * 0.05;
      mouse.x += (mouseTarget.x - mouse.x) * 0.05;
      mouse.y += (mouseTarget.y - mouse.y) * 0.05;
      pulse *= 0.975;
      if (pulse < 0.002) pulse = 0;

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uDensity.value = current.density;
      program.uniforms.uEnergy.value = current.energy;
      program.uniforms.uHue.value = current.hue;
      program.uniforms.uPulse.value = pulse;
      program.uniforms.uFade.value = Math.min(elapsed / 1.1, 1);

      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(loop);

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      sectionObserver.disconnect();
      heroObserver.disconnect();
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [prefersReduced, heroId]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 20%, var(--color-ink-900) 0%, var(--color-ink-950) 65%)",
      }}
    />
  );
}
