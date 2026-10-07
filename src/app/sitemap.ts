import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { buildAlternates, canonicalUrl } from "@/lib/seo";

/** Rutas sin prefijo de idioma. Se van sumando a medida que crece el sitio. */
const routes = ["", "about", "contact", "privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: canonicalUrl(`/${locale}${route ? `/${route}` : ""}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: buildAlternates(locale, route).languages,
      },
    })),
  );
}

export const dynamic = "force-static";
