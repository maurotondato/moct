/**
 * Diccionario base (es-AR). El tipo `Dictionary` se infiere de acá,
 * así que cualquier clave que falte en otro idioma rompe el build.
 *
 * ⚠️ BORRADOR COMERCIAL: el eyebrow del hero es la bajada real del logo, pero
 * los plazos, garantías y respuestas de FAQ son redacción propuesta, no
 * compromisos confirmados. Hay que revisarlos antes de publicar: son promesas
 * que el cliente después reclama.
 */
export const es = {
  meta: {
    title: "moctLab. — Software a medida, automatización e IA para empresas",
    description:
      "Diseñamos y construimos software a medida, apps, automatizaciones y asistentes con IA para que tu empresa deje de perder horas. Precio y plazo cerrados antes de empezar.",
  },
  nav: {
    services: "Servicios",
    product: "Producto",
    process: "Proceso",
    about: "Nosotros",
    contact: "Contacto",
    faq: "Preguntas",
    cta: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
  },
  hero: {
    eyebrow: "Soluciones que impulsan",
    headline: "Tecnología que",
    headlineAccent: "impulsa tu empresa",
    subhead:
      "Diseñamos, construimos y ponemos en producción el software que tu empresa necesita. A medida, medible y sin humo.",
    primaryCta: "Contanos tu proyecto",
    secondaryCta: "Ver qué hacemos",
    scrollHint: "Scroll",
  },

  problems: {
    eyebrow: "El diagnóstico",
    title: "¿Alguna de estas te suena?",
    subtitle:
      "Casi todas las empresas con las que hablamos arrastran al menos una. Ninguna se arregla sola.",
    items: [
      {
        title: "Perdés horas en tareas que podría hacer una máquina",
        body: "Cargar datos a mano, copiar de un Excel a otro, armar el mismo informe todos los lunes. Trabajo que no deja nada y se paga igual.",
      },
      {
        title: "Tus sistemas no se hablan entre sí",
        body: "La facturación por un lado, el stock por otro, el CRM por otro. Alguien tiene que hacer de puente, y ese alguien se equivoca.",
      },
      {
        title: "Las consultas llegan y no das abasto",
        body: "WhatsApp explotado, clientes esperando respuesta, ventas que se caen porque nadie contestó a tiempo.",
      },
      {
        title: "El software que usás no hace lo que necesitás",
        body: "Pagás una licencia por mes y seguís adaptando tu forma de trabajar al programa, en vez de al revés.",
      },
    ],
  },

  services: {
    eyebrow: "Qué construimos",
    title: "Lo que hacemos",
    subtitle:
      "Cinco frentes, una misma lógica: entender el problema antes de escribir código.",
    footnote: "¿No ves lo tuyo acá? Escribinos igual: lo más probable es que lo hagamos.",
    footnoteCta: "Contanos qué necesitás",
    items: [
      {
        name: "Software a medida",
        tagline: "El sistema que tu empresa necesita, no el que le sobró a otra.",
        body: "Construimos sistemas de gestión pensados para cómo trabaja tu empresa de verdad. Sin módulos que no usás, sin licencias por usuario, sin adaptarte a un producto genérico.",
        bullets: [
          "Sistemas de gestión y administración",
          "Paneles de control con tus números reales",
          "Herramientas internas para tu equipo",
        ],
      },
      {
        name: "Apps web y móviles",
        tagline: "Tu producto en el navegador y en el teléfono.",
        body: "Aplicaciones rápidas, que funcionan en cualquier dispositivo y que tus clientes entienden sin manual. Desde el primer prototipo hasta la app publicada.",
        bullets: [
          "Aplicaciones web a medida",
          "Apps móviles para Android y iOS",
          "Portales para clientes y proveedores",
        ],
      },
      {
        name: "Automatización de procesos",
        tagline: "Todo lo repetitivo, hecho solo.",
        body: "Identificamos las tareas que tu equipo repite todos los días y las convertimos en procesos que corren solos. El tiempo que se ahorra se nota en el primer mes.",
        bullets: [
          "Carga y migración de datos automática",
          "Informes que se generan y se envían solos",
          "Flujos de aprobación y seguimiento",
        ],
      },
      {
        name: "Asistentes con IA y WhatsApp",
        tagline: "Alguien que contesta siempre, a cualquier hora.",
        body: "Asistentes que responden consultas, toman pedidos y derivan a una persona cuando hace falta. Entrenados con la información de tu empresa, no con respuestas genéricas.",
        bullets: [
          "Asistentes de WhatsApp para atención y ventas",
          "Chatbots entrenados con tus documentos",
          "Clasificación y derivación automática de consultas",
        ],
      },
      {
        name: "Integraciones entre sistemas",
        tagline: "Que todo lo que ya tenés funcione junto.",
        body: "Conectamos las herramientas que ya usás para que compartan información sin que nadie tenga que copiar y pegar. Tu facturación, tu stock y tu CRM, hablando el mismo idioma.",
        bullets: [
          "Conexión con sistemas de facturación y ERP",
          "Integración con CRMs y plataformas de venta",
          "Sincronización entre herramientas y bases de datos",
        ],
      },
    ],
  },

  process: {
    eyebrow: "Cómo trabajamos",
    title: "De la idea a producción, sin sorpresas",
    subtitle:
      "El mismo camino en todos los proyectos. Sabés en qué paso estás y qué viene después.",
    steps: [
      {
        name: "Diagnóstico",
        body: "Nos sentamos a entender cómo trabaja tu empresa hoy. Qué duele, qué se repite, qué se pierde. Antes de proponer nada.",
      },
      {
        name: "Propuesta cerrada",
        body: "Te pasamos por escrito qué vamos a construir, en cuánto tiempo y a qué precio. Si el alcance no cambia, el número tampoco.",
      },
      {
        name: "Construcción",
        body: "Entregas parciales cada dos semanas. Ves el avance funcionando, no un informe de avance. Si algo no va, se corrige ahí.",
      },
      {
        name: "Puesta en marcha",
        body: "Lo dejamos andando en tu empresa, capacitamos a tu equipo y acompañamos los primeros meses. No desaparecemos al entregar.",
      },
    ],
  },

  whyUs: {
    eyebrow: "Por qué nosotros",
    title: "Por qué elegirnos",
    subtitle:
      "Somos un equipo chico y nuevo. Eso tiene desventajas, y también estas ventajas.",
    items: [
      {
        title: "Precio y plazo cerrados",
        body: "Antes de empezar sabés cuánto sale y cuándo lo tenés. Nada de facturar por hora y que el proyecto no termine nunca.",
      },
      {
        title: "El código es tuyo",
        body: "Te entregamos todo: el código, los accesos, la documentación. Si algún día querés seguir con otro, podés. No te secuestramos el proyecto.",
      },
      {
        title: "Hablás con quien programa",
        body: "Sin capas de intermediarios ni ejecutivos de cuenta. La persona que entiende tu problema es la que escribe la solución.",
      },
      {
        title: "Ves avances cada dos semanas",
        body: "No hay meses de silencio. Cada quince días hay algo funcionando que podés probar con tus propias manos.",
      },
      {
        title: "Construimos productos propios",
        body: "No solo tomamos encargos: también desarrollamos y lanzamos productos nuestros. Sabemos lo que cuesta llevar algo a producción.",
      },
      {
        title: "Te decimos que no",
        body: "Si lo que pedís no te conviene, o se resuelve más barato con una herramienta que ya existe, te lo decimos. Preferimos perder un proyecto antes que venderte humo.",
      },
    ],
  },

  faq: {
    eyebrow: "Dudas frecuentes",
    title: "Lo que todos preguntan",
    subtitle: "Si te quedó alguna afuera, escribinos y la respondemos.",
    items: [
      {
        question: "¿Cuánto cuesta un proyecto?",
        answer:
          "Depende del alcance, pero nunca te enterás sobre la marcha. Después del diagnóstico te pasamos un precio cerrado por escrito. Si el alcance no cambia, el precio no cambia. El diagnóstico inicial no se cobra.",
      },
      {
        question: "¿Cuánto tarda?",
        answer:
          "Una automatización puntual o un asistente de WhatsApp suele estar en producción en semanas. Un sistema de gestión completo lleva meses. En la propuesta va el plazo comprometido, con las entregas parciales marcadas en el calendario.",
      },
      {
        question: "¿El código queda de mi empresa?",
        answer:
          "Sí, íntegramente. Te entregamos el código fuente, los accesos a los servidores y la documentación. No trabajamos con modelos donde el cliente queda atado a nosotros para poder seguir usando lo que pagó.",
      },
      {
        question: "¿Trabajan con empresas de mi rubro?",
        answer:
          "Trabajamos con empresas de cualquier rubro. Los problemas de fondo se repiten: datos que se cargan a mano, sistemas que no se hablan, consultas sin responder. Lo que cambia es el vocabulario, y eso lo aprendemos en el diagnóstico.",
      },
      {
        question: "¿Qué pasa después de la entrega?",
        answer:
          "Acompañamos la puesta en marcha y capacitamos a tu equipo. Después podés contratar soporte mensual o quedarte con todo y seguir por tu cuenta. Las dos opciones son válidas y ninguna te penaliza.",
      },
      {
        question: "Todavía no sé bien qué necesito. ¿Sirve igual hablar?",
        answer:
          "Es el mejor momento para hablar. Buena parte de nuestro trabajo es justamente ordenar el problema antes de que se convierta en un pedido mal planteado. Contanos qué te duele y lo desarmamos juntos.",
      },
    ],
  },

  contact: {
    eyebrow: "Siguiente paso",
    title: "Contanos qué necesitás",
    subtitle:
      "Respondemos dentro de las 24 horas hábiles. El primer diagnóstico no se cobra ni compromete a nada.",
    /** Mensaje que aparece ya escrito al abrir el chat. */
    whatsappMessage: "Hola moctLab, quiero consultarles por un proyecto.",
    form: {
      name: "Nombre",
      namePlaceholder: "Cómo te llamás",
      email: "Email",
      emailPlaceholder: "tu@empresa.com",
      company: "Empresa",
      companyPlaceholder: "Nombre de tu empresa (opcional)",
      message: "Qué necesitás",
      messagePlaceholder:
        "Contanos qué problema querés resolver. No hace falta que sepas la solución.",
      submit: "Enviar consulta",
      sending: "Enviando...",
      success: "Listo. Te respondemos dentro de las 24 horas hábiles.",
      error:
        "No se pudo enviar. Escribinos directamente a moct.ventas@gmail.com y lo resolvemos.",
      required: "Completá este campo",
      invalidEmail: "Revisá el email",
      fallbackNote: "También podés escribirnos directo:",
    },
  },

  footer: {
    tagline: "Soluciones que impulsan",
    builtLine: "Software a medida, automatización e IA para empresas.",
    sections: "Secciones",
    contactTitle: "Contacto",
  },

  common: {
    backToHome: "Volver al inicio",
    allRightsReserved: "Todos los derechos reservados.",
    languageSwitcher: "Cambiar idioma",
  },
};

export type Dictionary = typeof es;
