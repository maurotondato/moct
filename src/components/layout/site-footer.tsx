import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site, whatsappLink } from "@/config/site";
import { localeLabel, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function SiteFooter({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const whatsapp = whatsappLink(dict.contact.whatsappMessage);
  const links = [
    { href: `/${locale}#servicios`, label: dict.nav.services },
    { href: `/${locale}#proceso`, label: dict.nav.process },
    { href: `/${locale}#nosotros`, label: dict.nav.about },
    { href: `/${locale}#preguntas`, label: dict.nav.faq },
    { href: `/${locale}#contacto`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-white/10 py-16">
      <div className="container-moct">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="w-36 text-chalk" />
            <p className="mt-6 max-w-xs text-fluid-sm text-chalk-dim text-pretty">
              {dict.footer.builtLine}
            </p>
          </div>

          <nav aria-label={dict.footer.sections}>
            <h2 className="font-mono text-fluid-xs tracking-[0.25em] text-chalk-muted uppercase">
              {dict.footer.sections}
            </h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-fluid-sm text-chalk-dim transition-colors duration-300 hover:text-accent-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-fluid-xs tracking-[0.25em] text-chalk-muted uppercase">
              {dict.footer.contactTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-fluid-sm text-chalk-dim transition-colors duration-300 hover:text-accent-soft"
                >
                  {site.contact.email}
                </a>
              </li>
              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fluid-sm text-chalk-dim transition-colors duration-300 hover:text-accent-soft"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {site.social.instagram ? (
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fluid-sm text-chalk-dim transition-colors duration-300 hover:text-accent-soft"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>

            <div className="mt-8 flex gap-2">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  hrefLang={item}
                  aria-current={item === locale ? "page" : undefined}
                  className={
                    item === locale
                      ? "rounded-pill border border-accent/50 bg-accent/10 px-3 py-1 text-fluid-xs text-accent-soft"
                      : "rounded-pill border border-white/10 px-3 py-1 text-fluid-xs text-chalk-muted transition-colors hover:border-white/30 hover:text-chalk"
                  }
                >
                  {localeLabel[item]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-fluid-xs text-chalk-muted">
            © {new Date().getFullYear()} {site.legalName}. {dict.common.allRightsReserved}
          </p>
          <p className="font-mono text-fluid-xs tracking-[0.2em] text-chalk-muted uppercase">
            {dict.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
