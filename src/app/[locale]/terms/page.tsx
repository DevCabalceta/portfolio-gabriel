import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/sections/legal-document";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type TermsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale).termsPage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    ...(siteUrl ? { alternates: { canonical: `/${locale}/terms`, languages: { es: "/es/terms", en: "/en/terms", "x-default": "/es/terms" } } } : {}),
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
      locale: locale === "es" ? "es_CR" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_CR",
      siteName: "Gabriel Cabalceta",
      ...(siteUrl ? { url: `/${locale}/terms` } : {}),
    },
    twitter: { card: "summary", title: copy.metaTitle, description: copy.metaDescription },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const copy = dictionary.termsPage;

  return (
    <LegalDocument
      locale={locale}
      languageLabel={dictionary.nav.language}
      skipLabel={dictionary.hero.skip}
      pathname="/terms"
      contentId="terms-content"
      titleId="terms-title"
      contentsId="terms-contents-title"
      contactTitleId="terms-contact-title"
      chapter={locale === "es" ? "10 / TÉRMINOS" : "10 / TERMS"}
      copy={copy}
      resources={[
        { href: `/${locale}/privacy`, label: copy.privacyAction },
        { href: "https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?nValor1=1&nValor2=26481&nValor3=133737&param1=NRTC&strTipM=TC", label: copy.consumerLawAction, external: true },
        { href: "https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?nValor1=1&nValor2=3396", label: copy.copyrightLawAction, external: true },
      ]}
    />
  );
}
