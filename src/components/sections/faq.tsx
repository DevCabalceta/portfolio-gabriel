import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { FaqMotion } from "@/components/animations/faq-motion";
import { FaqList } from "@/components/ui/faq-list";

export function Faq({ copy, locale }: { copy: Dictionary["faq"]; locale: Locale }) {
  return <FaqMotion>
    <section id="faq" className="faq" aria-labelledby="faq-title" tabIndex={-1}>
      <div className="faq-atmosphere" aria-hidden="true"><span>?</span><i /></div>
      <div className="faq-layout">
        <header className="faq-intro">
          <p className="faq-eyebrow micro-label" data-faq-intro="eyebrow"><span>06 /</span> {copy.eyebrow}</p>
          <h2 id="faq-title" aria-label={copy.titleLabel}>
            {copy.title.map((line) => <span className="faq-title-mask" aria-hidden="true" key={line}><span data-faq-intro="title">{line}</span></span>)}
          </h2>
          <p className="faq-introduction" data-faq-intro="description">{copy.introduction}</p>
          <a className="faq-contact" data-faq-intro="contact" href={getWhatsAppUrl(locale, copy.more)} target="_blank" rel="noopener noreferrer"><span>{copy.contact}</span><ArrowIcon /></a>
          <span className="faq-intro-index micro-label" aria-hidden="true">GABRIEL CABALCETA — 2026</span>
        </header>
        <FaqList copy={copy} />
      </div>
      <footer className="faq-footer micro-label"><span>{copy.more}</span><span>06 / 06</span></footer>
    </section>
  </FaqMotion>;
}
