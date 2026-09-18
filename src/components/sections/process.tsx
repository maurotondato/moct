import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";

/** Los cuatro pasos. Reemplaza a la prueba social mientras no haya casos que mostrar. */
export function Process({ dict }: { dict: Dictionary }) {
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

        <ol className="relative mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Línea que une los pasos, sólo cuando entran en una fila. */}
          <span
            aria-hidden
            className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent lg:block"
          />

          {dict.process.steps.map((step, index) => (
            <Reveal as="li" key={step.name} delay={index * 110} className="relative">
              <div className="flex size-12 items-center justify-center rounded-full border border-accent/40 bg-ink-950 font-mono text-fluid-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 text-fluid-lg font-semibold tracking-tight">
                {step.name}
              </h3>
              <p className="mt-3 text-fluid-sm leading-relaxed text-chalk-dim text-pretty">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
