import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BackLink } from "@/components/ui/back-link";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { SpaLink } from "@/components/ui/spa-link";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";

type LegalSection = {
  id: string;
  number: string;
  title: string;
  paragraphs: readonly string[];
  items: readonly string[];
};

type LegalCopy = {
  eyebrow: string;
  title: readonly string[];
  titleLabel: string;
  introduction: string;
  updatedLabel: string;
  updated: string;
  responsibleLabel: string;
  responsible: string;
  back: string;
  home: string;
  contents: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactAction: string;
  footer: string;
  sections: readonly LegalSection[];
};

type LegalResource = {
  href: string;
  label: string;
  external?: boolean;
};

type LegalDocumentProps = {
  locale: Locale;
  languageLabel: string;
  skipLabel: string;
  pathname: `/${string}`;
  contentId: string;
  titleId: string;
  contentsId: string;
  contactTitleId: string;
  chapter: string;
  copy: LegalCopy;
  resources: readonly LegalResource[];
};

export function LegalDocument({
  locale,
  languageLabel,
  skipLabel,
  pathname,
  contentId,
  titleId,
  contentsId,
  contactTitleId,
  chapter,
  copy,
  resources,
}: LegalDocumentProps) {
  return (
    <div className="legal-page">
      <a href={`#${contentId}`} className="skip-link">{skipLabel}</a>
      <div className="legal-atmosphere" aria-hidden="true" />

      <header className="legal-header">
        <SpaLink className="wordmark" href={`/${locale}#home`} aria-label={`${profile.name} — ${copy.home}`}>gc<span>✳</span></SpaLink>
        <div className="legal-header-actions">
          <LanguageSwitch locale={locale} label={languageLabel} pathname={pathname} />
          <BackLink href={`/${locale}#site-footer`} label={copy.back} />
        </div>
      </header>

      <main id={contentId} className="legal-main" tabIndex={-1}>
        <section className="legal-hero" aria-labelledby={titleId}>
          <div className="legal-topline micro-label">
            <span><i aria-hidden="true" />{copy.eyebrow}</span>
            <span>{chapter}</span>
          </div>
          <div className="legal-hero-grid">
            <h1 id={titleId} aria-label={copy.titleLabel}>
              {copy.title.map((line, index) => (
                <span className="legal-title-mask" aria-hidden="true" key={line}>
                  <span className={index === 1 ? "accent" : ""}>{line}</span>
                </span>
              ))}
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
          <aside className="legal-index" aria-labelledby={contentsId}>
            <h2 id={contentsId} className="micro-label">{copy.contents}</h2>
            <nav>
              {copy.sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>
              ))}
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

            <section className="legal-contact" aria-labelledby={contactTitleId}>
              <p className="micro-label">{copy.contactEyebrow}</p>
              <h2 id={contactTitleId}>{copy.contactTitle}</h2>
              <p>{copy.contactDescription}</p>
              <div className="legal-contact-actions">
                <a className="legal-primary-action" href={`mailto:${profile.email}`}><span>{copy.contactAction}</span><ArrowIcon /></a>
                {resources.map((resource) => resource.external ? (
                  <a href={resource.href} target="_blank" rel="noopener noreferrer" key={resource.href}><span>{resource.label}</span><ArrowIcon /></a>
                ) : (
                  <SpaLink href={resource.href} key={resource.href}><span>{resource.label}</span><ArrowIcon /></SpaLink>
                ))}
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
