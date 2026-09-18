import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Acordeón con `<details>` nativo: abre y cierra sin JavaScript, ya viene
 * accesible y el texto de las respuestas está siempre en el HTML, que es lo que
 * necesita el fragmento enriquecido de Google.
 */
export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="preguntas"
      className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-moct">
        <SectionHeading
          eyebrow={dict.faq.eyebrow}
          title={dict.faq.title}
          subtitle={dict.faq.subtitle}
        />

        <div className="mt-16 max-w-3xl">
          {dict.faq.items.map((item, index) => (
            <Reveal key={item.question} delay={index * 60}>
              <details className="faq group border-b border-white/10">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-fluid-lg font-medium transition-colors duration-300 hover:text-accent-soft">
                  <span className="text-pretty">{item.question}</span>
                  {/* El signo va en SVG y no como carácter: una "+" tipográfica
                      se apoya en la línea de base y nunca queda en el centro
                      óptico del círculo. Los trazos sí son simétricos. */}
                  <span
                    aria-hidden
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-[400ms] ease-out-expo group-open:rotate-45 group-open:border-accent group-open:text-accent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="faq-body max-w-2xl pb-7 text-fluid-base leading-relaxed text-chalk-dim text-pretty">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
