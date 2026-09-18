/**
 * Diccionario base (es-AR). El tipo `Dictionary` se infiere de acá,
 * así que cualquier clave que falte en otro idioma rompe el build.
 *
 * El eyebrow es la bajada real del logo. El resto del copy es PROVISORIO
 * hasta que se cierre el brief de contenido (servicios, diferencial, CTA).
 */
export const es = {
  meta: {
    title: "moctLab. — Soluciones tecnológicas para empresas",
    description:
      "Diseñamos y construimos software, automatizaciones e inteligencia artificial aplicada para que tu empresa opere mejor.",
  },
  nav: {
    services: "Servicios",
    product: "Producto",
    process: "Proceso",
    about: "Nosotros",
    contact: "Contacto",
    cta: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
  },
  hero: {
    eyebrow: "Soluciones que impulsan",
    headline: "Tecnología que",
    headlineAccent: "impulsa tu operación",
    subhead:
      "Diseñamos, construimos y ponemos en producción el software que tu empresa necesita. A medida, medible y sin humo.",
    primaryCta: "Agendar una llamada",
    secondaryCta: "Ver soluciones",
    scrollHint: "Scroll",
  },
  common: {
    backToHome: "Volver al inicio",
    allRightsReserved: "Todos los derechos reservados.",
    languageSwitcher: "Cambiar idioma",
  },
};

export type Dictionary = typeof es;
