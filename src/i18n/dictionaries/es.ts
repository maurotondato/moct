/**
 * Diccionario base (es-AR). El tipo `Dictionary` se infiere de acá,
 * así que cualquier clave que falte en otro idioma rompe el build.
 * El copy definitivo entra cuando se cierre el brief de contenido.
 */
export const es = {
  meta: {
    title: "MOCT — Soluciones tecnológicas para empresas",
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
    eyebrow: "Soluciones tecnológicas para empresas",
    headline: "Tecnología que trabaja",
    headlineAccent: "para tu negocio",
    subhead:
      "Construimos el software que tu empresa necesita: a medida, medible y puesto en producción.",
    primaryCta: "Agendar una llamada",
    secondaryCta: "Ver soluciones",
    scrollHint: "Scrolleá",
  },
  common: {
    backToHome: "Volver al inicio",
    allRightsReserved: "Todos los derechos reservados.",
    languageSwitcher: "Cambiar idioma",
  },
};

export type Dictionary = typeof es;
