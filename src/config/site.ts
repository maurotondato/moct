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
    email: "hola@moct.com", // TODO
    phone: "", // TODO: E.164, ej. +5491122334455
    whatsapp: "", // TODO: solo dígitos, ej. 5491122334455
  },
  social: {
    linkedin: "", // TODO
    instagram: "", // TODO
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
