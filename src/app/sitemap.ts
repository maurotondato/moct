import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { absoluteUrl, buildAlternates } from "@/lib/seo";

/** Rutas sin prefijo de idioma. Se van sumando a medida que crece el sitio. */
const routes = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${route ? `/${route}` : ""}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: buildAlternates(locale, route).languages,
      },
    })),
  );
}

export const dynamic = "force-static";
