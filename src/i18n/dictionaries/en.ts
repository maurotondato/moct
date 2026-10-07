import type { Dictionary } from "./es";

export const en: Dictionary = {
  meta: {
    title: "moctLab. — Custom software, automation and AI for business",
    description:
      "We design and build custom software, apps, automation and AI assistants so your company stops losing hours. Fixed price and timeline agreed before we start.",
  },
  nav: {
    services: "Services",
    product: "Product",
    process: "Process",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    cta: "Let's talk",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    eyebrow: "Solutions that drive you forward",
    headline: "Technology that",
    headlineAccent: "drives your business",
    subhead:
      "We design, build and ship the software your company actually needs. Bespoke, measurable, no hand-waving.",
    primaryCta: "Tell us about your project",
    secondaryCta: "See what we do",
    scrollHint: "Scroll",
  },

  problems: {
    eyebrow: "The diagnosis",
    title: "Does any of this sound familiar?",
    subtitle:
      "Almost every company we talk to carries at least one of these. None of them fix themselves.",
    items: [
      {
        title: "You lose hours on work a machine could do",
        body: "Typing data by hand, copying between spreadsheets, building the same report every Monday. Work that produces nothing and costs the same.",
      },
      {
        title: "Your systems don't talk to each other",
        body: "Invoicing over here, stock over there, the CRM somewhere else. Someone has to bridge the gap, and that someone makes mistakes.",
      },
      {
        title: "Enquiries pile up faster than you can answer",
        body: "WhatsApp overflowing, customers waiting, sales lost because nobody replied in time.",
      },
      {
        title: "The software you pay for doesn't do what you need",
        body: "A licence every month, and you still bend your way of working to fit the tool instead of the other way round.",
      },
    ],
  },

  services: {
    eyebrow: "What we build",
    title: "What we do",
    subtitle:
      "Five fronts, one principle: understand the problem before writing any code.",
    footnote: "Don't see yours here? Write anyway — chances are we build it.",
    footnoteCta: "Tell us what you need",
    items: [
      {
        name: "Custom software",
        tagline: "The system your company needs, not the one left over from someone else's.",
        body: "We build management systems designed around how your company actually works. No modules you never open, no per-seat licences, no bending to fit a generic product.",
        bullets: [
          "Management and back-office systems",
          "Dashboards built on your real numbers",
          "Internal tools for your team",
        ],
      },
      {
        name: "Web and mobile apps",
        tagline: "Your product in the browser and in their pocket.",
        body: "Fast applications that work on any device and that your customers understand without a manual. From first prototype to published app.",
        bullets: [
          "Bespoke web applications",
          "Mobile apps for Android and iOS",
          "Customer and supplier portals",
        ],
      },
      {
        name: "Process automation",
        tagline: "Everything repetitive, done on its own.",
        body: "We find the tasks your team repeats every day and turn them into processes that run themselves. The time saved shows up in the first month.",
        bullets: [
          "Automatic data loading and migration",
          "Reports that build and send themselves",
          "Approval and tracking workflows",
        ],
      },
      {
        name: "AI and WhatsApp assistants",
        tagline: "Someone who always answers, at any hour.",
        body: "Assistants that answer questions, take orders and hand over to a person when needed. Trained on your company's own information, not generic replies.",
        bullets: [
          "WhatsApp assistants for support and sales",
          "Chatbots trained on your documents",
          "Automatic triage and routing of enquiries",
        ],
      },
      {
        name: "System integrations",
        tagline: "Make everything you already own work together.",
        body: "We connect the tools you already use so they share information without anyone copying and pasting. Your invoicing, your stock and your CRM, speaking the same language.",
        bullets: [
          "Connections to invoicing systems and ERPs",
          "Integration with CRMs and sales platforms",
          "Sync between tools and databases",
        ],
      },
    ],
  },

  process: {
    eyebrow: "How we work",
    title: "From idea to production, no surprises",
    subtitle:
      "The same path on every project. You always know which step you're on and what comes next.",
    steps: [
      {
        name: "Diagnosis",
        body: "We sit down to understand how your company works today. What hurts, what repeats, what leaks. Before proposing anything.",
      },
      {
        name: "Fixed proposal",
        body: "You get it in writing: what we'll build, how long it takes and what it costs. If the scope doesn't change, neither does the number.",
      },
      {
        name: "Build",
        body: "Partial deliveries every two weeks. You see working software, not a progress report. If something's off, we fix it there.",
      },
      {
        name: "Go live",
        body: "We put it into production, train your team and stay close for the first months. We don't vanish on delivery day.",
      },
    ],
  },

  whyUs: {
    eyebrow: "Why us",
    title: "Why choose us",
    subtitle:
      "We're a small, new team. That has downsides — and it also has these upsides.",
    items: [
      {
        title: "Fixed price and timeline",
        body: "Before we start you know what it costs and when you get it. No billing by the hour on a project that never ends.",
      },
      {
        title: "The code is yours",
        body: "We hand over everything: source code, access, documentation. If you ever want to continue with someone else, you can. We don't hold your project hostage.",
      },
      {
        title: "You talk to the people who build it",
        body: "No layers of account managers. The person who understands your problem is the one writing the solution.",
      },
      {
        title: "You see progress every two weeks",
        body: "No months of silence. Every fortnight there's something working that you can try with your own hands.",
      },
      {
        title: "We build our own products",
        body: "We don't only take commissions: we design and ship products of our own. We know what it takes to get something into production.",
      },
      {
        title: "We'll tell you no",
        body: "If what you're asking for isn't right for you, or an existing tool solves it cheaper, we say so. We'd rather lose a project than sell you smoke.",
      },
    ],
  },

  faq: {
    eyebrow: "Frequent questions",
    title: "What everyone asks",
    subtitle: "If yours isn't here, write to us and we'll answer it.",
    items: [
      {
        question: "How much does a project cost?",
        answer:
          "It depends on scope, but you never find out along the way. After the diagnosis you get a fixed price in writing. If the scope doesn't change, the price doesn't change. The initial diagnosis is free.",
      },
      {
        question: "How long does it take?",
        answer:
          "A focused automation or a WhatsApp assistant is usually in production within weeks. A full management system takes months. The proposal states the committed timeline, with partial deliveries marked on the calendar.",
      },
      {
        question: "Does my company own the code?",
        answer:
          "Yes, entirely. We hand over the source code, the server access and the documentation. We don't work with models that leave the client tied to us just to keep using what they paid for.",
      },
      {
        question: "Do you work with companies in my industry?",
        answer:
          "We work with any industry. The underlying problems repeat: data typed by hand, systems that don't talk, enquiries left unanswered. What changes is the vocabulary, and we pick that up during the diagnosis.",
      },
      {
        question: "What happens after delivery?",
        answer:
          "We support the rollout and train your team. After that you can take monthly support or keep everything and carry on alone. Both are fine and neither penalises you.",
      },
      {
        question: "I don't know exactly what I need yet. Is it still worth talking?",
        answer:
          "That's the best moment to talk. A good part of our job is untangling the problem before it turns into a badly framed request. Tell us what hurts and we'll take it apart together.",
      },
    ],
  },

  contact: {
    eyebrow: "Next step",
    title: "Tell us what you need",
    subtitle:
      "We reply within 24 business hours. The first diagnosis is free and commits you to nothing.",
    whatsappMessage: "Hi moctLab, I'd like to ask you about a project.",
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      company: "Company",
      companyPlaceholder: "Your company name (optional)",
      message: "What do you need",
      messagePlaceholder:
        "Tell us what problem you want to solve. You don't need to know the solution.",
      submit: "Send via WhatsApp",
      success: "We opened WhatsApp with your message ready to send.",
      openWhatsapp: "Didn't open? Open it here",
      error:
        "We couldn't open WhatsApp. Write to us at moct.ventas@gmail.com and we'll sort it out.",
      required: "Please fill this in",
      invalidEmail: "Check the email",
      fallbackNote: "You can also write to us directly:",
      whatsappIntro: "Hi moctLab, I'm writing about a project.",
    },
  },

  footer: {
    tagline: "Solutions that drive you forward",
    builtLine: "Custom software, automation and AI for business.",
    sections: "Sections",
    contactTitle: "Contact",
    company: "Company",
    about: "About moctLab",
    privacy: "Privacy",
  },

pages: {
    backToHome: "Back to home",
    about: {
      eyebrow: "Who we are",
      title: "About moctLab",
      intro:
        "moctLab is an Argentine software company. We build custom systems, automation and applied artificial intelligence for companies that need technology to solve a concrete problem, not add a new one.",
      sections: [
        {
          heading: "What we do",
          body: "We work across five areas: custom management software, web and mobile applications, automation of repetitive processes, WhatsApp assistants and AI chatbots, and integration between systems that currently don't talk to each other. The common thread is that everything starts by understanding how the company operates before a line of code gets written. Most projects that reach us don't begin with a technical request but with an irritation: someone types data by hand every day, enquiries pile up unanswered, or two systems that should share information force a person to act as the bridge between them.",
        },
        {
          heading: "How we work",
          body: "The first assessment is free and commits you to nothing: we sit down to understand the problem and, if there is something worth building, we say so. Then we send a written proposal with fixed scope, timeline and price. If the scope doesn't change, neither does the number. During the build there are partial deliveries every two weeks, so the client tries working software instead of reading progress reports. When we finish we put the system into production, train the team and stay close for the first months.",
        },
        {
          heading: "What sets us apart",
          body: "The source code, the access credentials and the documentation all end up in the client's hands. We don't work with models that leave a company tied to us just to keep using what it paid for: if one day they want to continue with another team, they can. There are no layers of account managers either — the person who understands the problem is the one writing the solution. And if what we're asked for isn't the right call, or an existing tool solves it cheaper, we say so even when that means losing the project.",
        },
        {
          heading: "Where we are",
          body: "We are a small team based in the province of Buenos Aires, Argentina, working remotely with companies across the country. We work in Spanish and English. Alongside client projects we build products of our own: that experience of taking something from idea to production, with real users on it, is what we bring to every engagement.",
        },
      ],
    },
    contact: {
      eyebrow: "Let's talk",
      title: "Contact",
      intro:
        "WhatsApp is the fastest way to reach us. We reply within 24 business hours and the first assessment is free and without commitment.",
      sections: [
        {
          heading: "Where to write",
          body: "WhatsApp is where we reply fastest and the best place to start if you want an answer the same day. Email works just as well for longer enquiries or when you need to attach documentation. We're on Instagram too, although we're slower there. All three reach the same person: there is no call centre and no form landing in an inbox nobody checks.",
        },
        {
          heading: "What to tell us",
          body: "You don't need to know what solution you need; a good part of our job is untangling the problem before it turns into a badly framed request. Telling us what is costing you time or money is enough to start. If you can add which systems you use today, how many people work with them and which part of the process hurts most, the first exchange goes much further and we can reach a concrete proposal faster.",
        },
        {
          heading: "What happens next",
          body: "We reply to arrange a short call, around thirty minutes, where we understand the operation and tell you frankly whether there is something worth doing. If there is, you get a written proposal with fixed scope, timeline and price. If there isn't, or if an existing tool would serve you better, we say that too. None of this costs anything until you sign the proposal.",
        },
      ],
      channels: "Channels",
      whatsappLabel: "WhatsApp",
      emailLabel: "Email",
      instagramLabel: "Instagram",
      formCta: "Or fill in the form",
    },
    privacy: {
      eyebrow: "Transparency",
      title: "Privacy policy",
      intro:
        "This site collects as little data as possible: no cookies, no analytics tools, and nothing you type into the form is stored.",
      updatedLabel: "Last updated",
      updated: "October 2026",
      sections: [
        {
          heading: "What we collect",
          body: "The site sets no cookies and uses no analytics, audience measurement or advertising services. There is no cross-session tracking and no browsing profiles. Fonts are served from our own domain, so your browser makes no requests to third-party servers in order to render the page. In practice, browsing this site leaves us no record of your visit beyond what we describe below.",
        },
        {
          heading: "The contact form",
          body: "The form sends nothing to our servers or to anyone else's. What you fill in is used only to compose, inside your own browser, a WhatsApp message that opens with the text already written. You decide whether to send it. If you do, that data lives in the WhatsApp conversation, subject to the privacy policies of WhatsApp and Meta, and we keep it for as long as the commercial exchange lasts.",
        },
        {
          heading: "Hosting and technical logs",
          body: "The site is hosted on GitHub Pages. Like any web server, the hosting provider logs technical connection data, including IP address and browser type, for security and service operation. Those logs belong to the provider and are governed by its own privacy policy; we do not access them or use them for any purpose.",
        },
        {
          heading: "Third-party links",
          body: "The site links to external services such as WhatsApp and Instagram. Following those links takes you off this site and under each platform's own privacy policy, over which we have no control. We recommend reading them if you have questions about how they handle your data.",
        },
        {
          heading: "Your rights",
          body: "Under Argentina's Personal Data Protection Act 25.326, you have the right to access, rectify and delete the personal data we hold about you, free of charge. If you wrote to us at some point and want the conversation and associated data deleted, ask at the contact address below and we will do it. The Agency for Access to Public Information, the body enforcing the act, handles complaints from anyone whose rights are affected.",
        },
        {
          heading: "Changes and contact",
          body: "If we change how we handle data, we update this page and its last-modified date. For any privacy question, write to our contact address and we reply within 24 business hours.",
        },
      ],
    },
  },

  common: {
    backToHome: "Back to home",
    allRightsReserved: "All rights reserved.",
    languageSwitcher: "Switch language",
  },
};
