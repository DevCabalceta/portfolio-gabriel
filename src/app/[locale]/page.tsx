import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingActions } from "@/components/layout/floating-actions";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { ChapterTransition } from "@/components/animations/chapter-transition";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale);
  return (
    <>
      <a href="#main" className="skip-link">{copy.hero.skip}</a>
      <SiteHeader locale={locale} copy={copy.nav} />
      <main id="main" tabIndex={-1}>
        <ChapterTransition id="home" previous={<Hero copy={copy.hero} />}><About copy={copy.about} /></ChapterTransition>
        <Projects locale={locale} copy={copy.work} />
      </main>
      <FloatingActions copy={copy} />
    </>
  );
}
