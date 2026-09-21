import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";

const defaultMessages: Record<Locale, string> = {
  es: "Hola Gabriel, vi tu portfolio y me gustaría conversar sobre un proyecto.",
  en: "Hi Gabriel, I saw your portfolio and would like to discuss a project.",
};

const portfolioLabels: Record<Locale, string> = {
  es: "Ver el portfolio",
  en: "View the portfolio",
};

export function getLocalizedPortfolioUrl(locale: Locale) {
  return new URL(`/${locale}`, profile.portfolio).toString();
}

export function getWhatsAppUrl(locale: Locale, message?: string) {
  const introduction = message?.trim() || defaultMessages[locale];
  const portfolioLine = `${portfolioLabels[locale]}: ${getLocalizedPortfolioUrl(locale)}`;
  return `${profile.whatsapp}?text=${encodeURIComponent(`${introduction}\n\n${portfolioLine}`)}`;
}
