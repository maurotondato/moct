"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Campo de fondo para todo lo que va debajo del hero.
 *
 * Tiene dos regímenes. Del diagnóstico a servicios es una grilla técnica con
 * nodos que laten. De proceso hasta el pie es una placa de circuito: trazas
 * con codos y puntos de soldadura, recorridas por un pulso diagonal. Al cruzar
 * de uno a otro la figura se desarma —las celdas se dispersan— y se vuelve a
 * armar con la otra forma.
 *
 * Nunca dibuja al mismo tiempo que el campo del hero: mientras el hero está en
 * pantalla este bucle queda frenado.
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
  uniform float uMorph;

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

  /** Distancia a un segmento: con esto se dibujan las trazas. */
  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    float t = uTime;

    vec3 violet = vec3(0.306, 0.078, 1.000);
    vec3 blue = vec3(0.180, 0.320, 1.000);
    vec3 accent = mix(violet, blue, uHue);
    vec3 lav = vec3(0.706, 0.612, 1.000);

    // En el medio de la transición la dispersión llega a su máximo: es el
    // instante en que la figura anterior ya se soltó y la nueva no se armó.
    float scatter = sin(uMorph * 3.14159265);

    // Niebla de fondo, común a los dos regímenes.
    float fog = fbm(p * 1.1 + vec2(t * 0.03, -t * 0.02));

    vec3 col = vec3(0.016, 0.013, 0.039);
    col += accent * fog * 0.20 * uEnergy;

    // --- Régimen 1: grilla con nodos ---
    if (uMorph < 0.995) {
      vec2 gp = p * uDensity + vec2(t * 0.02, -t * 0.035);
      vec2 cell = floor(gp);
      vec2 f = fract(gp) - 0.5;

      // Al desarmarse, cada celda se corre en su propia dirección.
      f += (vec2(hash(cell), hash(cell + 5.1)) - 0.5) * scatter * 1.6;

      vec2 gf = abs(f);
      float grid = smoothstep(0.032, 0.0, min(gf.x, gf.y));
      float node = smoothstep(0.08, 0.0, length(f));
      float wave = sin((cell.x + cell.y) * 0.6 - t * 1.05) * 0.5 + 0.5;
      node *= 0.2 + wave * 0.95;

      float scan = exp(-abs(p.y - (fract(t * 0.06) * 2.6 - 1.3)) * 4.5);

      float amount = (1.0 - uMorph) * uEnergy;
      col += accent * grid * 0.14 * amount;
      col += lav * node * 0.30 * amount;
      col += accent * scan * 0.10 * amount;
    }

    // --- Régimen 2: placa de circuito ---
    if (uMorph > 0.005) {
      vec2 gp = p * uDensity + vec2(t * 0.012, -t * 0.008);
      vec2 cell = floor(gp);
      vec2 f = fract(gp) - 0.5;

      // Misma dispersión que la grilla, para que el desarme se lea continuo.
      f += (vec2(hash(cell), hash(cell + 5.1)) - 0.5) * scatter * 1.6;

      // Cada celda saca una pieza de trazado: recta, codo o nada. Repetido
      // sobre la grilla, el conjunto se lee como el ruteo de una placa.
      float r = hash(cell);
      float d = 10.0;
      if (r < 0.18) {
        d = sdSegment(f, vec2(-0.5, 0.0), vec2(0.5, 0.0));
      } else if (r < 0.36) {
        d = sdSegment(f, vec2(0.0, -0.5), vec2(0.0, 0.5));
      } else if (r < 0.50) {
        d = min(sdSegment(f, vec2(-0.5, 0.0), vec2(0.0, 0.0)),
                sdSegment(f, vec2(0.0, 0.0), vec2(0.0, 0.5)));
      } else if (r < 0.64) {
        d = min(sdSegment(f, vec2(0.5, 0.0), vec2(0.0, 0.0)),
                sdSegment(f, vec2(0.0, 0.0), vec2(0.0, -0.5)));
      } else if (r < 0.75) {
        d = min(sdSegment(f, vec2(-0.5, 0.0), vec2(0.0, 0.0)),
                sdSegment(f, vec2(0.0, 0.0), vec2(0.0, -0.5)));
      } else if (r < 0.86) {
        d = min(sdSegment(f, vec2(0.5, 0.0), vec2(0.0, 0.0)),
                sdSegment(f, vec2(0.0, 0.0), vec2(0.0, 0.5)));
      }

      float trace = smoothstep(0.055, 0.018, d);

      // Algunas celdas llevan una isleta, como los puntos de soldadura.
      float padSeed = hash(cell + 3.9);
      float ring = abs(length(f) - 0.17);
      float pad = padSeed > 0.88 ? smoothstep(0.030, 0.006, ring) : 0.0;

      // Un pulso diagonal recorre la placa encendiendo los tramos que toca.
      float wave = sin((cell.x * 0.55 + cell.y * 0.4) - t * 1.5) * 0.5 + 0.5;
      float spark = pow(wave, 7.0);

      vec3 tone = mix(accent, lav, spark);
      float lit = trace * (0.32 + spark * 1.7) + pad * (0.5 + spark * 1.6);

      col += tone * lit * uMorph * uEnergy * 0.30;
    }

    // Anillo que se expande al cambiar de sección.
    float r = length(p);
    float front = (1.0 - uPulse) * 2.4;
    col += lav * exp(-abs(r - front) * 8.0) * uPulse * 0.45;

    // El puntero enciende la zona que tiene alrededor.
    vec2 m = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    col += accent * exp(-length(p - m) * 2.8) * 0.13 * uEnergy;

    col *= smoothstep(1.55, 0.25, r);
    col *= uFade;
    col += (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.024;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Carácter de cada sección. `morph` elige el régimen: 0 es la grilla, 1 el
 * campo de dígitos. El corte está después de servicios, y de ahí hasta el pie
 * se mantiene el segundo.
 */
const SECTION_LOOKS: Record<
  string,
  { density: number; energy: number; hue: number; morph: number }
> = {
  diagnostico: { density: 8, energy: 0.8, hue: 0.0, morph: 0 },
  servicios: { density: 15, energy: 1.0, hue: 0.18, morph: 0 },
  proceso: { density: 11, energy: 1.0, hue: 0.3, morph: 1 },
  nosotros: { density: 14, energy: 0.95, hue: 0.12, morph: 1 },
  preguntas: { density: 8, energy: 0.7, hue: 0.05, morph: 1 },
  contacto: { density: 12, energy: 1.15, hue: 0.0, morph: 1 },
};

const DEFAULT_LOOK = { density: 9, energy: 0.8, hue: 0, morph: 0 };

/** Segundos que tarda la figura en desarmarse y volver a armarse. */
const MORPH_SECONDS = 1.5;

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
        uMorph: { value: 0 },
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

    const target = { ...DEFAULT_LOOK };
    const current = { ...DEFAULT_LOOK };
    const mouse = { x: 0.5, y: 0.5 };
    const mouseTarget = { x: 0.5, y: 0.5 };

    let pulse = 0;
    let activeId = "";

    /**
     * La densidad se mide contra el alto de la pantalla. En un teléfono, que es
     * angosto y alto, esa misma densidad da menos columnas y los dígitos quedan
     * gruesas al lado del texto. Se compensa apretando la trama y bajando el
     * brillo, sólo en el segundo régimen: la grilla ahí se ve bien como está.
     */
    const applyLook = (id: string) => {
      const look = SECTION_LOOKS[id] ?? DEFAULT_LOOK;
      const narrow = window.innerWidth < 768;
      const isCircuit = look.morph === 1;
      target.density = look.density * (narrow && isCircuit ? 1.15 : 1);
      target.energy = look.energy * (narrow && isCircuit ? 0.85 : 1);
      target.hue = look.hue;
      target.morph = look.morph;
    };

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
          applyLook(id);
          if (!prefersReduced) pulse = 1;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const onResizeLook = () => {
      if (activeId) applyLook(activeId);
    };
    window.addEventListener("resize", onResizeLook);

    const onPointerMove = (event: PointerEvent) => {
      mouseTarget.x = event.clientX / window.innerWidth;
      mouseTarget.y = 1 - event.clientY / window.innerHeight;
    };
    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

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
    let lastTime = 0;
    let visible = true;

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || heroVisible) {
        lastTime = time;
        return;
      }

      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      // Acotado: si la pestaña estuvo en segundo plano, el salto sería enorme.
      const delta = Math.min((time - (lastTime || time)) / 1000, 0.05);
      lastTime = time;

      current.density += (target.density - current.density) * 0.04;
      current.energy += (target.energy - current.energy) * 0.05;
      current.hue += (target.hue - current.hue) * 0.05;

      // El morph avanza a velocidad fija, no por acercamiento: así el desarme
      // dura siempre lo mismo y se lee como un gesto, no como un desvanecido.
      const step = delta / MORPH_SECONDS;
      if (current.morph < target.morph) {
        current.morph = Math.min(current.morph + step, target.morph);
      } else if (current.morph > target.morph) {
        current.morph = Math.max(current.morph - step, target.morph);
      }

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
      // Suavizado en los extremos: el desarme arranca y termina sin tirón.
      program.uniforms.uMorph.value =
        current.morph * current.morph * (3 - 2 * current.morph);

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
      window.removeEventListener("resize", onResizeLook);
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
