"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ServiceVisual } from "./service-visual";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Vitrina de servicios.
 *
 * La columna izquierda queda fija y la derecha scrollea. El servicio activo se
 * decide con un IntersectionObserver cuyo `rootMargin` recorta la pantalla a una
 * franja fina en el centro: el bloque que cruza esa franja manda. Es más estable
 * que calcular posiciones a mano y no pelea con el scroll suave.
 *
 * En pantallas chicas no hay columna fija: cada servicio lleva su propio motivo
 * y la sección se lee como una lista.
 */
export function Services({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const services = dict.services.items;
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      // Franja de 10% en el centro de la pantalla.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="servicios"
      className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-moct">
        <SectionHeading
          eyebrow={dict.services.eyebrow}
          title={dict.services.title}
          subtitle={dict.services.subtitle}
        />

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
          {/* Columna fija: índice, riel de progreso y motivo del servicio activo. */}
          <div className="hidden lg:block">
            {/* Centrado vertical en pantalla: la columna fija queda a la misma
                altura que el texto del servicio, que también va centrado. */}
            <div className="sticky top-0 flex h-screen flex-col justify-center">
              <div className="flex items-start gap-8">
                <ol
                  aria-hidden
                  className="flex flex-col gap-3 pt-2 font-mono text-fluid-xs"
                >
                  {services.map((service, index) => (
                    <li
                      key={service.name}
                      className={cn(
                        "flex items-center gap-3 transition-colors duration-500",
                        index === active ? "text-accent" : "text-chalk-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "block h-px origin-left transition-all duration-500 ease-out-expo",
                          index === active
                            ? "w-8 bg-accent"
                            : "w-4 bg-chalk-muted/30",
                        )}
                      />
                      {String(index + 1).padStart(2, "0")}
                    </li>
                  ))}
                </ol>

                <div className="relative aspect-square w-full max-w-[300px]">
                  {services.map((service, index) => (
                    <ServiceVisual
                      key={service.name}
                      index={index}
                      active={index === active}
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-out-expo",
                        index === active
                          ? "scale-100 opacity-100 blur-none"
                          : "pointer-events-none scale-95 opacity-0 blur-sm",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* El nombre del servicio activo, con relevo: sale uno y entra el otro. */}
              <div className="relative mt-6 h-20 overflow-hidden">
                {services.map((service, index) => (
                  <p
                    key={service.name}
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 top-0 text-fluid-xl font-semibold tracking-tight transition-all duration-500 ease-out-expo",
                      index === active
                        ? "translate-y-0 opacity-100 blur-none"
                        : "translate-y-6 opacity-0 blur-[6px]",
                    )}
                  >
                    {service.tagline}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Columna que scrollea: el contenido real, uno abajo del otro. */}
          <ol className="space-y-24 lg:space-y-0">
            {services.map((service, index) => (
              <li
                key={service.name}
                data-index={index}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                className="lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
              >
                <Reveal>
                  <div
                    className={cn(
                      "transition-opacity duration-500",
                      // En escritorio, lo que no está activo se atenúa: guía la lectura.
                      "lg:opacity-40",
                      index === active && "lg:opacity-100",
                    )}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-fluid-sm text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "h-px flex-1 origin-left transition-all duration-700 ease-out-expo",
                          index === active
                            ? "bg-gradient-to-r from-accent to-transparent"
                            : "bg-white/10",
                        )}
                      />
                    </div>

                    <h3 className="mt-6 text-fluid-2xl leading-tight font-semibold tracking-[-0.02em]">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-fluid-lg text-accent-soft lg:hidden">
                      {service.tagline}
                    </p>

                    {/* En pantallas chicas el motivo viaja con su servicio. */}
                    <ServiceVisual
                      index={index}
                      active
                      className="my-9 aspect-square w-52 lg:hidden"
                    />

                    <p className="mt-5 max-w-xl text-fluid-base leading-relaxed text-chalk-dim text-pretty">
                      {service.body}
                    </p>

                    <ul className="mt-7 space-y-3">
                      {service.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-fluid-sm text-chalk-dim"
                        >
                          <span
                            aria-hidden
                            className="mt-2 block size-1 shrink-0 rounded-full bg-accent"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-20 lg:mt-8">
          <div className="flex flex-col items-start gap-5 rounded-card border border-white/10 bg-ink-950/60 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-fluid-base text-chalk-dim text-pretty">
              {dict.services.footnote}
            </p>
            <Link
              href={`/${locale}#contacto`}
              className="group inline-flex shrink-0 items-center gap-2 text-fluid-sm font-medium text-accent-soft transition-colors hover:text-accent"
            >
              {dict.services.footnoteCta}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
