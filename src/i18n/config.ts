export const locales = ["es", "en"] as const;
export const defaultLocale = "es" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Etiquetas hreflang por locale. */
export const hreflang: Record<Locale, string> = {
  es: "es-AR",
  en: "en",
};

export const localeLabel: Record<Locale, string> = {
  es: "Español",
  en: "English",
};
