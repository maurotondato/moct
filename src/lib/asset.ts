/**
 * Prefija una ruta de `public/` con el basePath del despliegue.
 *
 * `next/link` y `next/image` aplican el basePath solos, pero una URL escrita a
 * mano dentro de CSS (una máscara, un background) no pasa por ahí: sin esto,
 * el logo desaparece en cualquier despliegue que no cuelgue de la raíz.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${basePath}${path}`;
}
