import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

/**
 * El logo se pinta como máscara CSS en vez de SVG inline: el archivo queda
 * cacheado aparte (no engorda el bundle) y la forma toma `currentColor`,
 * así sirve igual sobre fondo oscuro o claro.
 */
type LogoProps = {
  className?: string;
  /**
   * `mark` es el logotipo sin bajada (el que se usa en el sitio: la bajada ya
   * está escrita en el hero y repetirla es redundante), `full` lo incluye y
   * `wordmark` es sólo "moct".
   */
  variant?: "mark" | "full" | "wordmark";
  /** Texto alternativo. `null` cuando el logo es decorativo. */
  label?: string | null;
  /** Se fusiona con los estilos de la máscara (p. ej. para retrasar su animación). */
  style?: React.CSSProperties;
};

const SOURCES = {
  mark: { src: "/brand/logo-mark.svg", ratio: 3.7809 },
  full: { src: "/brand/logo.svg", ratio: 3.1206 },
  wordmark: { src: "/brand/logo-wordmark.svg", ratio: 2.8806 },
} as const;

export function Logo({
  className,
  variant = "mark",
  label = "moctLab.",
  style,
}: LogoProps) {
  const { ratio } = SOURCES[variant];
  const src = asset(SOURCES[variant].src);

  return (
    <span
      className={cn("block bg-current", className)}
      style={{
        aspectRatio: String(ratio),
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
