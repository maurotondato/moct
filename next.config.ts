import type { NextConfig } from "next";

/**
 * GitHub Pages sirve archivos estáticos: no hay servidor Node, así que el
 * proxy (la redirección de idioma) no corre y las imágenes no se optimizan.
 * Por eso el export vive detrás de una variable de entorno, y el build normal
 * —el que va a usar el dominio real— queda intacto.
 */
const isPagesBuild = process.env.DEPLOY_TARGET === "github-pages";

// En un repo de proyecto el sitio cuelga de /<repo>, no de la raíz del dominio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        // Sin servidor no hay optimizador de imágenes.
        images: { unoptimized: true },
        // Cada ruta como carpeta con su index.html: es lo que espera Pages.
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
