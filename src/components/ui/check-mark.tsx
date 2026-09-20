"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * El punto que encabeza cada tarjeta se convierte en un tilde cuando la
 * tarjeta llega al centro de la pantalla.
 *
 * Una vez marcado se queda así: es una lista de cosas que se van confirmando
 * mientras bajás, no un efecto que va y viene. Por eso el observador se
 * desconecta en cuanto dispara.
 */
export function CheckMark({
  delay = 0,
  className,
}: {
  delay?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.checked = "true";
        observer.disconnect();
      },
      /**
       * La zona sensible va desde el borde de arriba hasta el 62% de la
       * pantalla. Una tarjeta se marca cuando su borde superior cruza esa
       * línea, así las filas se van marcando de a una a medida que subís.
       *
       * Es una zona y no una línea fina a propósito: con una franja angosta,
       * un salto de scroll grande podía pasarla de largo entre dos cuadros y
       * la tarjeta se quedaba sin marcar para siempre.
       */
      { rootMargin: "0px 0px -38% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      data-checked="false"
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={cn("check size-6 text-accent", className)}
      style={{ ["--check-delay" as string]: `${delay}ms` }}
    >
      {/* El anillo crece desde el punto. */}
      <circle
        className="check-ring"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      {/* El punto de partida, que se retira cuando entra el tilde. */}
      <circle className="check-dot" cx="12" cy="12" r="3.75" fill="currentColor" />
      <path
        className="check-tick"
        pathLength={1}
        d="M7.4 12.5l3.2 3.2L16.9 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
