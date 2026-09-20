import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/sections/legal-document";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type PrivacyPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).privacyPage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    ...(siteUrl ? { alternates: { canonical: `/${locale}/privacy`, languages: { es: "/es/privacy", en: "/en/privacy", "x-default": "/es/privacy" } } } : {}),
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
      locale: locale === "es" ? "es_CR" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_CR",
      siteName: "Gabriel Cabalceta",
      ...(siteUrl ? { url: `/${locale}/privacy` } : {}),
    },
    twitter: { card: "summary", title: copy.metaTitle, description: copy.metaDescription },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.privacyPage;

  return (
    <LegalDocument
      locale={locale}
      languageLabel={dictionary.nav.language}
      skipLabel={dictionary.hero.skip}
      pathname="/privacy"
      contentId="privacy-content"
      titleId="privacy-title"
      contentsId="privacy-contents-title"
      contactTitleId="privacy-contact-title"
      chapter="09 / PRIVACY"
      copy={copy}
      resources={[
        { href: "https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/L/2010-2019/2010-2014/2011/1153F/DCEF7.HTML", label: copy.lawAction, external: true },
        { href: "https://www.prodhab.go.cr/", label: copy.authorityAction, external: true },
      ]}
    />
  );
}
