import { HeroField } from "./hero-field";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/ui/split-text";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

/**
 * Coreografía de entrada, en milisegundos. Todo se encadena desde acá para
 * que el orden de lectura sea el mismo que el orden de aparición:
 * eyebrow -> titular -> bajada -> acciones.
 */
const T = {
  eyebrow: 200,
  headline: 420,
  headlineStagger: 24,
  subhead: 1150,
  actions: 1320,
  cue: 1800,
} as const;

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  // La segunda línea arranca cuando la cascada de la primera ya está encaminada.
  const accentDelay =
    T.headline + dict.hero.headline.replace(/\s/g, "").length * T.headlineStagger + 120;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32 pb-28">
      <HeroField />

      {/* Velo de legibilidad: oscurece el flanco del texto y funde el borde
          inferior con la sección siguiente. Sin esto, la bajada pierde contraste
          cuando el campo sube de intensidad. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(5_4_12/0.75)_0%,rgb(5_4_12/0.45)_45%,transparent_100%)] md:bg-[linear-gradient(105deg,var(--color-ink-950)_0%,rgb(5_4_12/0.88)_30%,rgb(5_4_12/0.35)_58%,transparent_85%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-ink-950"
      />

      {/* El wordmark gigante, casi invisible: da escala y peso de marca sin competir con el titular. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex justify-center">
        <Logo
          variant="wordmark"
          label={null}
          className="animate-fade-in w-[170%] max-w-none text-white/[0.028] sm:w-[130%] lg:w-[105%] lg:text-white/[0.062]"
          style={{ animationDelay: `${T.cue}ms`, animationDuration: "2.2s" }}
        />
      </div>

      <div className="container-moct relative">
        {/* Eyebrow: la bajada real del logo. */}
        <div
          className="animate-rise-in flex items-center gap-3"
          style={{ animationDelay: `${T.eyebrow}ms` }}
        >
          <span
            aria-hidden
            className="animate-pulse-dot size-1.5 shrink-0 rounded-full bg-accent"
          />
          <p className="font-mono text-fluid-xs tracking-[0.34em] text-chalk-dim uppercase">
            {dict.hero.eyebrow}
          </p>
        </div>
        <div
          className="animate-line-grow mt-5 h-px w-full max-w-md bg-gradient-to-r from-accent via-accent/40 to-transparent"
          style={{ animationDelay: `${T.eyebrow + 120}ms` }}
        />

        <h1
          className="mt-8 max-w-[18ch] text-fluid-4xl leading-[0.92] font-semibold tracking-[-0.03em]"
          aria-label={`${dict.hero.headline} ${dict.hero.headlineAccent}`}
        >
          <SplitText
            text={dict.hero.headline}
            delay={T.headline}
            stagger={T.headlineStagger}
            className="block"
          />
          {/* La segunda línea entra como bloque, no letra por letra: el degradado
              necesita vivir en el mismo elemento que se anima, porque un `filter`
              en los hijos los aísla y `background-clip: text` deja de pintarlos.
              De paso, el contraste entre cascada y masa hace más fuerte la entrada. */}
          <span
            aria-hidden
            className="text-gradient-brand animate-rise-in block pb-[0.08em]"
            style={{ animationDelay: `${accentDelay}ms` }}
          >
            {dict.hero.headlineAccent}
          </span>
        </h1>

        <p
          className="animate-rise-in mt-8 max-w-xl text-fluid-lg leading-relaxed text-chalk-dim text-pretty"
          style={{ animationDelay: `${T.subhead}ms` }}
        >
          {dict.hero.subhead}
        </p>

        <div
          className="animate-rise-in mt-11 flex flex-wrap items-center gap-4"
          style={{ animationDelay: `${T.actions}ms` }}
        >
          <Button href={`/${locale}#contacto`}>{dict.hero.primaryCta}</Button>
          <Button href={`/${locale}#diagnostico`} variant="ghost">
            {dict.hero.secondaryCta}
          </Button>
        </div>
      </div>

      {/* Pista de scroll: una barrita que cae dentro de un riel. */}
      <div
        className="animate-fade-in absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
        style={{ animationDelay: `${T.cue}ms` }}
      >
        <span className="font-mono text-[0.625rem] tracking-[0.3em] text-chalk-muted uppercase">
          {dict.hero.scrollHint}
        </span>
        <span
          aria-hidden
          className="relative block h-10 w-px overflow-hidden bg-white/10"
        >
          <span className="animate-scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent to-accent" />
        </span>
      </div>
    </section>
  );
}
