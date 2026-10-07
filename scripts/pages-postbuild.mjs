/**
 * Post-proceso del export estático para GitHub Pages.
 *
 * Hace dos cosas que el export no puede hacer solo:
 *
 * 1. `.nojekyll` — sin este archivo, Pages procesa el sitio con Jekyll, que
 *    ignora toda carpeta que empiece con guion bajo. Next publica sus assets
 *    en `_next/`, así que la página carga sin estilos ni JavaScript.
 *
 * 2. `index.html` en la raíz — el proxy que redirige `/` al idioma del
 *    visitante no corre en un hosting estático. Este archivo lo reemplaza:
 *    detecta el idioma del navegador y redirige. Si el JavaScript está
 *    bloqueado, el `<meta refresh>` dentro de `<noscript>` lleva al idioma
 *    por defecto.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? "out";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (!existsSync(outDir)) {
  console.error(`No existe "${outDir}". ¿Corriste el export antes?`);
  process.exit(1);
}

writeFileSync(join(outDir, ".nojekyll"), "");

const defaultLocale = "es";
const locales = ["es", "en"];

const redirect = `<!doctype html>
<html lang="${defaultLocale}">
  <head>
    <meta charset="utf-8" />
    <title>moctLab.</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${basePath}/${defaultLocale}/" />
    <!-- El meta va dentro de noscript: si no, compite con el redirect de
         abajo y el navegador aborta una de las dos navegaciones. -->
    <noscript>
      <meta http-equiv="refresh" content="0; url=${basePath}/${defaultLocale}/" />
    </noscript>
    <script>
      (function () {
        var locales = ${JSON.stringify(locales)};
        var preferred = (navigator.languages || [navigator.language || "${defaultLocale}"])
          .map(function (tag) { return String(tag).toLowerCase().split("-")[0]; });
        var match = preferred.find(function (tag) { return locales.indexOf(tag) !== -1; });
        location.replace("${basePath}/" + (match || "${defaultLocale}") + "/");
      })();
    </script>
  </head>
  <body>
    <p>Redirigiendo a <a href="${basePath}/${defaultLocale}/">moctLab.</a></p>
  </body>
</html>
`;

writeFileSync(join(outDir, "index.html"), redirect);

/**
 * Atajos en la raíz para las rutas que los agentes prueban de memoria:
 * /about, /contact y /privacy. Las páginas reales viven bajo el idioma, así
 * que acá sólo va un reenvío, marcado noindex y con el canonical apuntando a
 * la versión buena para que no compita con ella.
 */
const shortcuts = ["about", "contact", "privacy"];

for (const slug of shortcuts) {
  const target = `${basePath}/${defaultLocale}/${slug}/`;
  const html = `<!doctype html>
<html lang="${defaultLocale}">
  <head>
    <meta charset="utf-8" />
    <title>moctLab.</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${target}" />
    <noscript>
      <meta http-equiv="refresh" content="0; url=${target}" />
    </noscript>
    <script>location.replace(${JSON.stringify("")} + "${target}");</script>
  </head>
  <body>
    <p>Esta página vive en <a href="${target}">${target}</a>.</p>
  </body>
</html>
`;
  mkdirSync(join(outDir, slug), { recursive: true });
  writeFileSync(join(outDir, slug, "index.html"), html);
}

console.log(
  `Listo: .nojekyll, index.html y ${shortcuts.length} atajos escritos en ${outDir}/`,
);
