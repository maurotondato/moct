import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

/**
 * Armazón de las páginas de texto (empresa, contacto, privacidad).
 *
 * Comparten cabecera y pie con la portada, pero no llevan el campo WebGL de
 * fondo: son páginas para leer, y acá el fondo sería ruido.
 */
export function PageShell({
  dict,
  locale,
  eyebrow,
  title,
  intro,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main className="flex-1">
        <article className="container-moct pt-40 pb-24 md:pt-48 md:pb-32">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
              <p className="font-mono text-fluid-xs tracking-[0.3em] text-chalk-dim uppercase">
                {eyebrow}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-fluid-3xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-6 max-w-2xl text-fluid-lg leading-relaxed text-chalk-dim text-pretty">
              {intro}
            </p>
          </Reveal>

          {children}

          <Reveal delay={120}>
            <Link
              href={`/${locale}`}
              className="group mt-16 inline-flex items-center gap-2 text-fluid-sm text-chalk-dim transition-colors hover:text-accent-soft"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
              >
                ←
              </span>
              {dict.pages.backToHome}
            </Link>
          </Reveal>
        </article>
      </main>
      <SiteFooter dict={dict} locale={locale} />
    </>
  );
}

/** Secciones de texto corrido, numeradas por si hace falta citarlas. */
export function ProseSections({
  sections,
}: {
  sections: readonly { heading: string; body: string }[];
}) {
  return (
    <div className="mt-16 max-w-2xl space-y-12">
      {sections.map((section, index) => (
        <Reveal key={section.heading} delay={index * 60}>
          <section>
            <h2 className="text-fluid-xl leading-snug font-semibold tracking-tight text-balance">
              {section.heading}
            </h2>
            <p className="mt-4 text-fluid-base leading-relaxed text-chalk-dim text-pretty">
              {section.body}
            </p>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
