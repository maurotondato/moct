"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

/**
 * Los cuatro pasos, encendidos por el scroll.
 *
 * El avance de la página se traduce en un valor 0→1 que hace dos cosas: llena
 * la línea que une los pasos (por variable CSS, sin re-render) y decide cuántos
 * pasos quedaron "alcanzados" (eso sí es estado, pero cambia cuatro veces en
 * toda la sección, no en cada cuadro).
 *
 * Es el recorrido de la sección hecho literal: la línea avanza, el paso se
 * enciende, el siguiente todavía espera.
 */
export function Process({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps;
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [reached, setReached] = useState(0);
  const reachedRef = useRef(0);

  // Sin movimiento, todos los pasos van encendidos. Se calcula en el render en
  // vez de escribirlo como estado dentro de un efecto: es un valor derivado.
  const reachedCount = prefersReduced ? steps.length : reached;

  useEffect(() => {
    if (prefersReduced) return;

    const el = sectionRef.current;
    if (!el) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;

      /**
       * El recorrido tiene que terminar mientras la sección todavía se ve.
       *
       * Antes el tramo era `alto + 75% de pantalla`, y con los cuatro pasos en
       * una fila baja eso empujaba el final tan lejos que el último recién se
       * encendía cuando la sección ya se iba: en la práctica nunca se veía
       * "Puesta en marcha" activo.
       *
       * Ahora el tramo se mide contra el alto real del bloque, con un piso de
       * 60% de pantalla para que en escritorio no se llene de golpe. Arranca
       * cuando el bloque asoma al 90% de la pantalla y llega al final con el
       * bloque todavía bien adentro del cuadro.
       */
      const span = Math.max(rect.height + viewport * 0.05, viewport * 0.6);
      const travelled = viewport * 0.9 - rect.top;
      const progress = Math.min(Math.max(travelled / span, 0), 1);

      el.style.setProperty("--progress", String(progress));

      const next = Math.min(
        steps.length,
        Math.floor(progress * steps.length + 0.35),
      );
      if (next !== reachedRef.current) {
        reachedRef.current = next;
        setReached(next);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReduced, steps.length]);

  return (
    <section
      id="proceso"
      className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-moct">
        <SectionHeading
          eyebrow={dict.process.eyebrow}
          title={dict.process.title}
          subtitle={dict.process.subtitle}
        />

        <div
          ref={sectionRef}
          className="process mt-16 lg:mt-20"
          style={{ "--progress": prefersReduced ? 1 : 0 } as React.CSSProperties}
        >
          <ol className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Riel horizontal (escritorio): el fondo marca el recorrido completo
                y la capa violeta avanza con el scroll. */}
            <span
              aria-hidden
              className="absolute top-6 right-0 left-0 hidden h-px bg-white/10 lg:block"
            >
              <span className="process-rail block h-full w-full origin-left bg-gradient-to-r from-accent via-accent to-accent-soft" />
            </span>

            {/* Riel vertical (móvil y tablet). */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-6 w-px bg-white/10 lg:hidden"
            >
              <span className="process-rail block h-full w-full origin-top bg-gradient-to-b from-accent via-accent to-accent-soft" />
            </span>

            {steps.map((step, index) => {
              const isReached = index < reachedCount;
              const isCurrent = index === reachedCount - 1;

              return (
                <li
                  key={step.name}
                  className="relative pl-20 lg:pl-0"
                  data-reached={isReached}
                >
                  <div
                    className={cn(
                      "process-node absolute left-0 flex size-12 items-center justify-center rounded-full border font-mono text-fluid-sm transition-all duration-700 ease-out-expo lg:relative",
                      isReached
                        ? "border-accent bg-accent text-white"
                        : "border-white/15 bg-ink-950 text-chalk-muted",
                      isCurrent && "process-node-current",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3
                    className={cn(
                      "mt-0 text-fluid-lg font-semibold tracking-tight transition-all duration-700 ease-out-expo lg:mt-6",
                      isReached
                        ? "translate-y-0 text-chalk opacity-100"
                        : "translate-y-2 text-chalk-muted opacity-50",
                    )}
                  >
                    {step.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 text-fluid-sm leading-relaxed text-pretty transition-all duration-700 ease-out-expo",
                      isReached
                        ? "translate-y-0 text-chalk-dim opacity-100"
                        : "translate-y-3 text-chalk-muted opacity-40",
                    )}
                    style={{ transitionDelay: isReached ? "90ms" : "0ms" }}
                  >
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
