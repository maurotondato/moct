"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela su contenido cuando entra en pantalla, una sola vez.
 *
 * El contenido siempre está en el DOM —importa para SEO y para los lectores de
 * pantalla—; lo único que cambia es cómo se pinta. El `<noscript>` del layout
 * lo fuerza visible si no hay JavaScript.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.revealed = "true";
        observer.disconnect();
      },
      // Se dispara un poco antes del borde inferior: llega revelado, no revelándose.
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-revealed="false"
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
