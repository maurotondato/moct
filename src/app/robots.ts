import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewDeploy } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // La vista previa se cierra entera: no queremos que Google la indexe y
  // después compita con el dominio real por las mismas palabras.
  if (isPreviewDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}

export const dynamic = "force-static";
