import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";

/** El gancho: el visitante tiene que reconocerse antes de que le hablemos de nosotros. */
export function Problems({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="diagnostico"
      className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-moct">
        <SectionHeading
          eyebrow={dict.problems.eyebrow}
          title={dict.problems.title}
          subtitle={dict.problems.subtitle}
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 sm:grid-cols-2">
          {dict.problems.items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 90}>
              <div className="group h-full bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 md:p-10">
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
                {/* Subrayado que crece al pasar el mouse: premia la exploración. */}
                <span
                  aria-hidden
                  className="mt-7 block h-px w-10 origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-[3]"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
