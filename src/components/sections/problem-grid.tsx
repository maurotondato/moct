"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Las cuatro tarjetas del diagnóstico.
 *
 * Tres capas de movimiento, todas atadas al cursor:
 *  1. Un foco de luz violeta que sigue al puntero dentro de la tarjeta.
 *  2. El borde se ilumina sólo en el tramo más cercano al cursor, con la misma
 *     posición pero recortada al contorno con una máscara.
 *  3. La tarjeta se inclina hacia el puntero en 3D, poquito, para que se sienta
 *     física sin marear.
 *
 * Todo se comunica por variables CSS, así que el movimiento lo resuelve el
 * compositor y no hay re-render de React por cada píxel del mouse.
 */
export function ProblemGrid({ dict }: { dict: Dictionary }) {
  const prefersReduced = usePrefersReducedMotion();
  const frame = useRef(0);
  const gridRef = useRef<HTMLUListElement>(null);

  // La entrada se dispara al llegar a pantalla, no al cargar la página:
  // si no, las tarjetas ya terminaron de animarse antes de que alguien las vea.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        grid.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function handlePointerMove(event: React.PointerEvent<HTMLLIElement>) {
    if (prefersReduced) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Un solo cuadro por frame: los eventos de puntero llegan más rápido que la pantalla.
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      // Normalizado a [-1, 1] desde el centro, para la inclinación.
      card.style.setProperty("--rx", `${((y / rect.height) * 2 - 1) * -4}deg`);
      card.style.setProperty("--ry", `${((x / rect.width) * 2 - 1) * 5}deg`);
    });
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLLIElement>) {
    const card = event.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }

  return (
    <ul
      ref={gridRef}
      data-revealed="false"
      className="problem-grid mt-16 grid gap-4 sm:grid-cols-2"
    >
      {dict.problems.items.map((item, index) => (
        <li
          key={item.title}
          className="problem-card group"
          style={{ animationDelay: `${index * 120}ms` }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="problem-card-inner">
            {/* Borde iluminado: mismo degradado que el foco, recortado al contorno. */}
            <span aria-hidden className="problem-card-border" />
            {/* Foco que sigue al cursor. */}
            <span aria-hidden className="problem-card-glow" />

            <div className="relative">
              <span
                aria-hidden
                className="font-mono text-fluid-xs text-accent/70"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-fluid-lg leading-snug font-semibold text-balance">
                {item.title}
              </h3>
              <p className="mt-4 text-fluid-sm leading-relaxed text-chalk-dim text-pretty">
                {item.body}
              </p>
              <span
                aria-hidden
                className="mt-7 block h-px w-10 origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-[3]"
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
