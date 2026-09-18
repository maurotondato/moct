import { cn } from "@/lib/utils";

/**
 * Revela un texto letra por letra.
 *
 * Es CSS puro a propósito: cero JavaScript en el cliente, sin riesgo de
 * desajuste de hidratación y el navegador lo corre en el compositor. El
 * bloque global de `prefers-reduced-motion` lo deja en su estado final.
 *
 * El texto completo va en `aria-label` y las letras quedan ocultas al lector
 * de pantalla, para que no se lea deletreado.
 */
type SplitTextProps = {
  text: string;
  className?: string;
  /** Milisegundos entre letra y letra. */
  stagger?: number;
  /** Retraso inicial en milisegundos. */
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
};

export function SplitText({
  text,
  className,
  stagger = 26,
  delay = 0,
  as: Tag = "span",
}: SplitTextProps) {
  const words = text.split(" ");
  let index = 0;

  return (
    <Tag className={cn("[text-wrap:balance]", className)} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          aria-hidden
          // inline-flex evita que las letras se separen al final de renglón.
          className="inline-flex overflow-hidden pb-[0.12em] align-bottom"
        >
          {[...word].map((char, charIndex) => {
            const offset = delay + index * stagger;
            index += 1;
            return (
              <span
                key={`${char}-${charIndex}`}
                className="animate-char-rise inline-block will-change-transform"
                style={{ animationDelay: `${offset}ms` }}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? (
            <span className="inline-block">&nbsp;</span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}
