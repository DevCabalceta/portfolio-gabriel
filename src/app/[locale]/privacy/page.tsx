import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BackLink } from "@/components/ui/back-link";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { SpaLink } from "@/components/ui/spa-link";
import { profile } from "@/data/profile";
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
    <div className="legal-page">
      <a href="#privacy-content" className="skip-link">{dictionary.hero.skip}</a>
      <div className="legal-atmosphere" aria-hidden="true" />

      <header className="legal-header">
        <SpaLink className="wordmark" href={`/${locale}#home`} aria-label={`${profile.name} — ${copy.home}`}>gc<span>✳</span></SpaLink>
        <div className="legal-header-actions">
          <LanguageSwitch locale={locale} label={dictionary.nav.language} pathname="/privacy" />
          <BackLink href={`/${locale}#site-footer`} label={copy.back} />
        </div>
      </header>

      <main id="privacy-content" className="legal-main" tabIndex={-1}>
        <section className="legal-hero" aria-labelledby="privacy-title">
          <div className="legal-topline micro-label">
            <span><i aria-hidden="true" />{copy.eyebrow}</span>
            <span>09 / PRIVACY</span>
          </div>
          <div className="legal-hero-grid">
            <h1 id="privacy-title" aria-label={copy.titleLabel}>
              {copy.title.map((line, index) => <span className="legal-title-mask" aria-hidden="true" key={line}><span className={index === 1 ? "accent" : ""}>{line}</span></span>)}
            </h1>
            <div className="legal-intro">
              <p>{copy.introduction}</p>
              <dl>
                <div><dt className="micro-label">{copy.updatedLabel}</dt><dd>{copy.updated}</dd></div>
                <div><dt className="micro-label">{copy.responsibleLabel}</dt><dd>{copy.responsible}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <div className="legal-content-grid">
          <aside className="legal-index" aria-labelledby="privacy-contents-title">
            <h2 id="privacy-contents-title" className="micro-label">{copy.contents}</h2>
            <nav>
              {copy.sections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}
            </nav>
          </aside>

          <article className="legal-article">
            {copy.sections.map((section) => (
              <section id={section.id} className="legal-section" key={section.id}>
                <span className="legal-section-number" aria-hidden="true">{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items.length > 0 && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              </section>
            ))}

            <section className="legal-contact" aria-labelledby="privacy-contact-title">
              <p className="micro-label">{copy.contactEyebrow}</p>
              <h2 id="privacy-contact-title">{copy.contactTitle}</h2>
              <p>{copy.contactDescription}</p>
              <div className="legal-contact-actions">
                <a className="legal-primary-action" href={`mailto:${profile.email}`}><span>{copy.contactAction}</span><ArrowIcon /></a>
                <a href="https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/L/2010-2019/2010-2014/2011/1153F/DCEF7.HTML" target="_blank" rel="noopener noreferrer"><span>{copy.lawAction}</span><ArrowIcon /></a>
                <a href="https://www.prodhab.go.cr/" target="_blank" rel="noopener noreferrer"><span>{copy.authorityAction}</span><ArrowIcon /></a>
              </div>
            </section>
          </article>
        </div>
      </main>

      <footer className="legal-footer">
        <p className="micro-label">© {new Date().getFullYear()} Gabriel Cabalceta</p>
        <p>{copy.footer}</p>
        <BackLink href={`/${locale}#site-footer`} label={copy.back} className="legal-footer-back" />
      </footer>
    </div>
  );
}
