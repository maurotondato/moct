# MOCT — sitio web

Sitio corporativo de MOCT. Next.js 16 (App Router) + Tailwind 4 + Motion/GSAP,
estética dark tech, bilingüe ES/EN, optimizado para SEO técnico.

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16, App Router, SSG |
| Estilos | Tailwind CSS 4 (tokens en `src/app/globals.css`) |
| Animación | Motion + GSAP + Lenis (scroll suave) |
| WebGL | OGL (shaders del hero) |
| Idiomas | `es` / `en` con rutas `/es` y `/en`, hreflang y `x-default` |

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # eslint
npx tsc --noEmit
```

## Arquitectura

```
src/
  app/
    [locale]/        # todas las páginas, prefijadas por idioma
    globals.css      # design tokens + utilidades base
    robots.ts
    sitemap.ts       # con alternates hreflang por ruta
  components/
    providers/       # scroll suave
    seo/             # JSON-LD
  config/site.ts     # marca, dominio, contacto → fuente única de verdad
  hooks/
  i18n/              # config, diccionarios es/en, getDictionary
  lib/               # utils y helpers de SEO/metadata
  proxy.ts           # detección y redirección de idioma
```

### Dónde tocar cada cosa

- **Colores de marca**: `src/app/globals.css`, bloque `@theme` (`--color-accent`,
  `--color-accent-2`). Son provisorios hasta que entre el logo definitivo.
- **Dominio, mails, redes, razón social**: `src/config/site.ts`.
- **Textos**: `src/i18n/dictionaries/es.ts` (define el tipo) y `en.ts`.
  Si falta una clave en inglés, el build falla a propósito.
- **Rutas nuevas en el sitemap**: array `routes` en `src/app/sitemap.ts`.

## Marca

- Nombre: **moctLab.** — bajada oficial: *Soluciones que impulsan*
- Acento: `#4E14FF`, muestreado del píxel más saturado del logo original.
- Los logos llegaron sólo en PNG. Se vectorizaron a SVG (`public/brand/`) y se
  pintan como máscara CSS, así toman `currentColor` y sirven sobre cualquier fondo.

## Pendiente del brief

- [ ] Servicios definitivos y copy de cada sección (el del hero es provisorio)
- [ ] Dominio final → `site.url`
- [ ] Definir si Pliggo vive en este dominio o aparte
- [ ] Datos de contacto, redes y razón social
- [ ] Casos / testimonios reales (si los hay)
