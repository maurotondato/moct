import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Sin clientes que mostrar todavía, la credibilidad se apoya en compromisos
 * concretos y verificables. Nada de logos ni testimonios inventados.
 */
export function WhyUs({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="nosotros"
      className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-moct">
        <SectionHeading
          eyebrow={dict.whyUs.eyebrow}
          title={dict.whyUs.title}
          subtitle={dict.whyUs.subtitle}
        />

        <ul className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {dict.whyUs.items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={(index % 3) * 90}>
              <div className="group relative h-full rounded-card border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04]">
                {/* Resplandor que aparece al pasar el mouse. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: "0 20px 60px -25px rgb(78 20 255 / 0.65)",
                  }}
                />
                <span
                  aria-hidden
                  className="block size-2 rounded-full bg-accent transition-transform duration-500 ease-spring group-hover:scale-150"
                />
                <h3 className="mt-6 text-fluid-lg leading-snug font-semibold text-balance">
                  {item.title}
                </h3>
                <p className="mt-3 text-fluid-sm leading-relaxed text-chalk-dim text-pretty">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
