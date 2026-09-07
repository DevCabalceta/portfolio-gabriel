"use client";

import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div className="language-switch" role="group" aria-label={label}>
      {locales.map((language) => (
        <Link key={language} href={`/${language}`} hrefLang={language} lang={language}
          aria-current={language === locale ? "page" : undefined}
          aria-label={language === "es" ? "Español" : "English"}
          onClick={() => { document.cookie = `portfolio-locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax`; }}>
          {language.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
