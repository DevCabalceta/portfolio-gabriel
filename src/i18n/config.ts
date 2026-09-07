export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized<T> = Record<Locale, T>;
export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
