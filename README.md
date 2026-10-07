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
npm run dev         # desarrollo
npm run build       # build de producción (servidor Node, proxy activo)
npm run build:pages # export estático para GitHub Pages
npm run lint        # eslint
npx tsc --noEmit
```

## Dominio y DNS (moctlab.com.ar)

**NIC.ar no tiene editor de zona: sólo delega servidores de nombres.** No se
pueden cargar registros A, AAAA ni CNAME ahí. Hace falta un proveedor de DNS
—Cloudflare en plan gratuito alcanza— y en NIC.ar se delega hacia él.

### 1. Cargar la zona en el proveedor de DNS

Registros que apuntan a GitHub Pages, para el dominio sin `www`:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `maurotondato.github.io` |

En Cloudflare, estos registros van **sin proxy** (nube gris, "DNS only"). Con el
proxy activado GitHub no puede validar el dominio para emitir el certificado y
"Enforce HTTPS" queda deshabilitado. Una vez que el certificado está emitido, el
proxy se puede encender si hace falta.

### 2. Delegar en NIC.ar

Trámites a Distancia → NICar → la lista de dominios → el dominio → **Delegar**.
Se cargan los dos servidores de nombres que da el proveedor y se confirma con
**Ejecutar cambios**. Ojo: *Delegar* no es lo mismo que *Autodelegar*; esa
segunda opción es para servidores de nombres propios dentro del mismo dominio.

### 3. Activar el dominio en GitHub

Settings → Pages → Custom domain → `moctlab.com.ar` → Save. Cuando aparezca
"DNS check successful", recién ahí marcar **Enforce HTTPS**: el certificado
tarda unos minutos en emitirse.

El archivo `public/CNAME` viaja dentro del artefacto y declara el dominio en
cada despliegue, así que no hay que volver a tocarlo.

## Despliegue

El sitio se publica solo en cada push: lo hace `.github/workflows/pages.yml`.
Para activarlo, una vez, en GitHub: **Settings → Pages → Source: GitHub Actions**.

Dos cosas que hay que saber de este despliegue:

- **Pages no corre servidor.** El proxy que redirige `/` al idioma del
  visitante no existe ahí, así que `scripts/pages-postbuild.mjs` escribe un
  `index.html` de raíz que hace lo mismo desde el navegador. Ese script también
  crea el `.nojekyll` sin el cual Pages ignora la carpeta `_next/` y el sitio
  carga sin estilos, y los atajos de `/about`, `/contact` y `/privacy`.
- **Para bloquear la indexación en un despliegue de prueba**, se define
  `NEXT_PUBLIC_NOINDEX=true`. En producción no se define.

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

## Formulario de contacto

El formulario arma un mensaje de WhatsApp con los datos cargados y abre el chat
con el número de `site.contact.whatsapp`. No hay servicio externo de por medio:
un sitio estático no manda mails solo, y así la consulta llega al teléfono al
instante sin una cuenta más que mantener.

El enlace se abre dentro del gesto de envío, que es lo que permite abrir una
pestaña sin que el navegador lo bloquee; igual queda a la vista por si el
bloqueador se adelanta.

## Pendiente del brief

- [ ] ⚠️ **Revisar los compromisos comerciales**: plazos, precio cerrado,
      propiedad del código y respuestas de FAQ son redacción propuesta, no
      confirmada. Están en `src/i18n/dictionaries/es.ts`.
- [ ] Dominio final → `site.url`
- [ ] Definir si Pliggo vive en este dominio o aparte
- [ ] Datos de contacto, redes y razón social
- [ ] Casos / testimonios reales (si los hay)
