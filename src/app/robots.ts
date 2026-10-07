import type { MetadataRoute } from "next";
import { absoluteUrl, isSearchBlocked } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Sólo los despliegues de prueba se cierran, para que no compitan con el
  // dominio real por las mismas palabras.
  if (isSearchBlocked) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}

export const dynamic = "force-static";
