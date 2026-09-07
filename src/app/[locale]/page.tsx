import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale);
  return (
    <>
      <a href="#main" className="skip-link">{copy.hero.skip}</a>
      <SiteHeader locale={locale} copy={copy.nav} />
      <main id="main" tabIndex={-1}><Hero copy={copy.hero} /></main>
    </>
  );
}
