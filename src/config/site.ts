/**
 * Fuente única de verdad de la marca.
 * Todo lo marcado con TODO se completa cuando lleguen los datos definitivos;
 * cambiarlo acá lo propaga a metadata, JSON-LD, sitemap, header y footer.
 */

export const site = {
  name: "moctLab.",
  shortName: "moct",
  tagline: "Soluciones que impulsan",
  legalName: "moctLab.", // TODO: razón social para el footer y el JSON-LD
  // TODO: dominio real. Se usa en canonical, OG, sitemap y robots.
  // Se puede pisar por entorno para que cada despliegue (Pages, preview, prod)
  // emita sus propios canonical en vez de mentir apuntando a otro lado.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moct.com",
  foundingYear: 2026,
  contact: {
    email: "moct.ventas@gmail.com",
    phone: "",
    /**
     * WhatsApp en formato internacional, sólo dígitos: 54 (Argentina) + 9
     * (móvil) + el número sin el 0 ni el 15. Verificar que el enlace abra el
     * chat correcto antes de publicar.
     */
    whatsapp: "5492223431190",
  },
  social: {
    linkedin: "", // TODO
    instagram: "https://instagram.com/moctlab",
    github: "",
  },
  /** Producto propio. TODO: confirmar si vive acá o en dominio aparte. */
  products: {
    pliggo: {
      name: "Pliggo",
      url: "", // TODO: URL de la app si ya está online
    },
  },
} as const;

export type Site = typeof site;

/** Enlace a WhatsApp con el mensaje inicial ya escrito. */
export function whatsappLink(message?: string) {
  if (!site.contact.whatsapp) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.contact.whatsapp}${query}`;
}
