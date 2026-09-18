import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

/**
 * Header del hero. Flota por encima del campo WebGL sin taparlo.
 * La navegación completa (menú móvil, estado sticky) entra cuando existan
 * las secciones a las que apuntar.
 */
export function SiteHeader({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const links = [
    { href: `/${locale}#servicios`, label: dict.nav.services },
    { href: `/${locale}#proceso`, label: dict.nav.process },
    { href: `/${locale}#nosotros`, label: dict.nav.about },
    { href: `/${locale}#preguntas`, label: dict.nav.faq },
  ];

  return (
    <header className="animate-fade-in absolute inset-x-0 top-0 z-50">
      <div className="container-moct flex items-center justify-between py-7">
        <Link
          href={`/${locale}`}
          className="text-chalk transition-opacity duration-300 hover:opacity-70"
        >
          <Logo className="w-28 sm:w-32" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-fluid-sm text-chalk-dim transition-colors duration-300 hover:text-chalk"
            >
              {link.label}
              {/* Subrayado que crece desde la izquierda al pasar el mouse. */}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <Link
          href={`/${locale}#contacto`}
          className="rounded-pill border border-white/15 bg-white/[0.03] px-5 py-2.5 text-fluid-sm text-chalk backdrop-blur-sm transition-colors duration-300 hover:border-accent/60 hover:bg-accent/10"
        >
          {dict.nav.cta}
        </Link>
      </div>
    </header>
  );
}
