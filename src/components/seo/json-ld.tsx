type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inyecta JSON-LD. Sirve tanto para un objeto como para un @graph. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro, generado en el server: no hay input de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
