import type { Dictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/profile";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ContactForm } from "@/components/ui/contact-form";
import { ContactMotion } from "@/components/animations/contact-motion";

export function Contact({ copy, locale }: { copy: Dictionary["contactSection"]; locale: "es" | "en" }) {
  return <ContactMotion>
    <section id="contact" className="contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact-grid">
        <div className="contact-intro">
          <span className="contact-watermark" aria-hidden="true">07</span>
          <div className="contact-intro-top">
            <p className="micro-label contact-eyebrow" data-contact-intro="eyebrow"><span>07 /</span> {copy.eyebrow}</p>
            <span className="contact-cross" aria-hidden="true">✳</span>
          </div>
          <div className="contact-intro-main">
            <h2 id="contact-title" aria-label={copy.titleLabel}>
              {copy.title.map((line) => <span className="contact-title-mask" aria-hidden="true" key={line}><span data-contact-intro="title">{line}</span></span>)}
            </h2>
            <p className="contact-introduction" data-contact-intro="description">{copy.introduction}</p>
            <a className="contact-direct" data-contact-intro="direct" href={getWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer">
              <span className="contact-direct-icon" aria-hidden="true">↗</span>
              <span><strong>{copy.directNumber}</strong><small>{copy.directLabel}</small></span>
              <ArrowIcon />
            </a>
          </div>
          <div className="contact-intro-bottom micro-label" data-contact-intro="footer">
            <a href={`mailto:${profile.email}`}><span>{copy.emailLabel}</span><strong>{profile.email}</strong></a>
            <span>San José, Costa Rica</span>
          </div>
        </div>

        <div className="contact-form-panel">
          <div className="contact-form-content">
            <p className="contact-form-eyebrow micro-label" data-contact-form="eyebrow">{copy.formEyebrow}</p>
            <h3 data-contact-form="title">{copy.formTitle}</h3>
            <p className="contact-form-description" data-contact-form="description">{copy.formDescription}</p>
            <ContactForm copy={copy} locale={locale} />
          </div>
          <div className="contact-panel-footer micro-label" data-contact-form="footer"><span>{copy.footer}</span><span>07 / 08</span></div>
        </div>
      </div>
    </section>
  </ContactMotion>;
}
