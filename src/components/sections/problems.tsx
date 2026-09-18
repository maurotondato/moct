import { SectionHeading } from "@/components/ui/section-heading";
import { ProblemGrid } from "./problem-grid";
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
        <ProblemGrid dict={dict} />
      </div>
    </section>
  );
}
