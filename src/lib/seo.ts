import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { site } from "@/config/site";
import { defaultLocale, hreflang, locales, type Locale } from "@/i18n/config";

/**
 * URL absoluta a partir de un path interno.
 *
 * No usa `new URL(path, base)` a propósito: con una ruta absoluta, el
 * constructor descarta el subdirectorio de la base, así que un despliegue
 * bajo `/moct` emitiría canonical apuntando a la raíz del dominio.
 */
export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Bloqueo de indexación, explícito y por entorno.
 *
 * Antes se deducía del tipo de build —el export estático era siempre una vista
 * previa—, pero ahora ese mismo export es el sitio de producción en el dominio
 * propio. Así que el bloqueo se pide a mano, sólo en despliegues de prueba.
 */
export const isSearchBlocked = process.env.NEXT_PUBLIC_NOINDEX === "true";

/**
 * El export estático sirve cada ruta como carpeta, así que la URL real termina
 * en barra. Next ya lo aplica en los canonical y los hreflang; esto es para que
 * lo que escribimos a mano —el sitemap— diga exactamente la misma dirección y
 * no una que redirige.
 */
export function canonicalUrl(path = "/") {
  const url = absoluteUrl(path);
  if (process.env.DEPLOY_TARGET !== "github-pages") return url;
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Construye el bloque de alternates (canonical + hreflang + x-default)
 * para una ruta dada, sin el prefijo de idioma.
 * Ej: pathWithoutLocale = "/servicios" -> /es/servicios, /en/servicios
 */
export function buildAlternates(locale: Locale, pathWithoutLocale = "") {
  const clean = pathWithoutLocale.replace(/^\/+|\/+$/g, "");
  const suffix = clean ? `/${clean}` : "";

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflang[l]] = canonicalUrl(`/${l}${suffix}`);
  }
  languages["x-default"] = canonicalUrl(`/${defaultLocale}${suffix}`);

  return {
    canonical: absoluteUrl(`/${locale}${suffix}`),
    languages,
  };
}

type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Ruta sin prefijo de idioma, ej. "servicios/automatizacion" */
  path?: string;
  /** Imagen OG propia; si no, usa la generada por opengraph-image. */
  image?: string;
};

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image,
}: PageMetaInput): Metadata {
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: hreflang[locale],
      title,
      description,
      url: alternates.canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** JSON-LD de la organización. Se inyecta una sola vez, en el layout. */
export function organizationJsonLd(locale: Locale) {
  const sameAs = [
    site.social.linkedin,
    site.social.instagram,
    site.social.github,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: canonicalUrl(`/${locale}`),
    logo: absoluteUrl(asset("/brand/logo.svg")),
    foundingDate: String(site.foundingYear),
    ...(sameAs.length ? { sameAs } : {}),
    // Dirección postal: es uno de los datos que usan los buscadores y los
    // asistentes para verificar que detrás del sitio hay una empresa real.
    address: {
      "@type": "PostalAddress",
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.address.country,
    ...(site.contact.email
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              email: site.contact.email,
              telephone: `+${site.contact.whatsapp}`,
              availableLanguage: ["es", "en"],
              areaServed: site.address.country,
            },
          ],
        }
      : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: canonicalUrl(`/${locale}`),
    inLanguage: hreflang[locale],
    publisher: { "@id": `${site.url}/#organization` },
  };
}

/**
 * Preguntas frecuentes en datos estructurados. Es lo que habilita el resultado
 * desplegable en Google: la respuesta aparece en el buscador sin que el usuario
 * entre, y la web gana altura en la página de resultados.
 */
export function faqJsonLd(dict: {
  faq: { items: { question: string; answer: string }[] };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Catálogo de servicios, para que el buscador entienda qué vendemos. */
export function servicesJsonLd(
  dict: {
    services: { title: string; items: { name: string; body: string }[] };
  },
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: dict.services.title,
    url: absoluteUrl(`/${locale}#servicios`),
    provider: { "@id": `${site.url}/#organization` },
    itemListElement: dict.services.items.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.body,
        provider: { "@id": `${site.url}/#organization` },
      },
    })),
  };
}
