import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingActions } from "@/components/layout/floating-actions";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { ChapterTransition } from "@/components/animations/chapter-transition";
import { DeferredToaster } from "@/components/ui/deferred-toaster";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getDictionary(locale);
  return (
    <>
      <a href="#main" className="skip-link">{copy.hero.skip}</a>
      <DeferredToaster />
      <SmoothScroll />
      <SiteHeader locale={locale} copy={copy.nav} />
      <main id="main" tabIndex={-1}>
        <ChapterTransition id="home" previous={<Hero copy={copy.hero} />}><About copy={copy.about} /></ChapterTransition>
        <Projects locale={locale} copy={copy.work} />
        <Process copy={copy.process} locale={locale} />
        <Services copy={copy.services} locale={locale} />
        <Faq copy={copy.faq} locale={locale} />
        <Contact copy={copy.contactSection} locale={locale} />
      </main>
      <SiteFooter copy={copy.siteFooter} services={copy.services} navigation={copy.nav} locale={locale} />
      <FloatingActions copy={copy} locale={locale} />
    </>
  );
}
