import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

/** Encabezado común a todas las secciones: eyebrow con punto, título y bajada. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
          <p className="font-mono text-fluid-xs tracking-[0.3em] text-chalk-dim uppercase">
            {eyebrow}
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="mt-5 text-fluid-3xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
          {title}
        </h2>
      </Reveal>

      {subtitle ? (
        <Reveal delay={160}>
          <p className="mt-5 text-fluid-lg leading-relaxed text-chalk-dim text-pretty">
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
