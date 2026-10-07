import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

/**
 * 404 de toda la aplicación.
 *
 * Va acá y no en un `not-found` común porque la raíz de rutas es un segmento
 * dinámico (`[locale]`): no hay un layout único del que colgar el 404. Por eso
 * este archivo devuelve el documento HTML entero y trae sus propios estilos.
 *
 * El cuerpo lista el mapa del sitio, llms.txt y las páginas principales: un
 * agente que cae en una ruta inexistente se lleva de dónde seguir en vez de un
 * cartel vacío. Next ya marca estas respuestas con noindex.
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — Página no encontrada | moctLab.",
  description:
    "La dirección no existe en moctlab.com.ar. Links al mapa del sitio y a las secciones principales.",
};

const LINKS = [
  { href: "/es/", label: "Inicio", en: "Home" },
  { href: "/es/about/", label: "Sobre moctLab", en: "About" },
  { href: "/es/contact/", label: "Contacto", en: "Contact" },
  { href: "/sitemap.xml", label: "Mapa del sitio (XML)", en: "Sitemap" },
  { href: "/llms.txt", label: "llms.txt", en: "llms.txt" },
];

export default function GlobalNotFound() {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink-950 text-chalk">
        <main className="container-moct flex flex-1 flex-col justify-center py-24">
          <p className="font-mono text-fluid-xs tracking-[0.3em] text-accent uppercase">
            Error 404
          </p>
          <h1 className="mt-5 max-w-2xl text-fluid-3xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
            Esta dirección no existe
          </h1>
          <p className="mt-5 max-w-xl text-fluid-lg text-chalk-dim text-pretty">
            La página que buscabas no está en {site.url.replace("https://", "")}.
            Puede que el enlace esté mal escrito o que la hayamos movido.
          </p>
          <p className="mt-2 max-w-xl text-fluid-sm text-chalk-muted text-pretty">
            This address does not exist on this site. The links below lead to the
            site map and the main pages.
          </p>

          <nav aria-label="Páginas principales" className="mt-10">
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-3 text-fluid-base text-chalk-dim transition-colors hover:text-accent-soft"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-fluid-xs text-accent"
                    >
                      →
                    </span>
                    {link.label}
                    {link.label !== link.en ? (
                      <span className="text-chalk-muted">· {link.en}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-12 font-mono text-fluid-xs text-chalk-muted">
            {site.name} — {site.tagline}
          </p>
        </main>
      </body>
    </html>
  );
}
