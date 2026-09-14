import type { Dictionary } from "@/i18n/dictionaries";
import { ServicesMotion } from "@/components/animations/services-motion";
import { ServicePricing } from "@/components/ui/service-pricing";

export function Services({ copy, locale }: { copy: Dictionary["services"]; locale: "es" | "en" }) {
  return <ServicesMotion>
    <section id="services" className="services" aria-labelledby="services-title" tabIndex={-1}>
      <div className="services-atmosphere" aria-hidden="true">
        <span className="services-coordinate">05</span>
        <span className="services-arc" />
        <span className="services-axis" />
      </div>

      <header className="services-intro">
        <div className="services-topline micro-label" data-services-intro="label">
          <span><span>05 /</span> {copy.label}</span><span>{copy.eyebrow}</span>
        </div>
        <div className="services-heading">
          <h2 id="services-title" aria-label={copy.titleLabel}>
            {copy.title.map((line) => <span className="services-title-mask" aria-hidden="true" key={line}><span data-services-intro="title">{line}</span></span>)}
          </h2>
          <div className="services-introduction" data-services-intro="copy">
            <p>{copy.introduction}</p>
            <span className="micro-label">{copy.statement}</span>
          </div>
        </div>
      </header>

      <ServicePricing copy={copy} locale={locale} />

      <footer className="services-footer micro-label" data-services-outro>
        <span>{copy.footer}</span><span>San José, Costa Rica</span>
      </footer>
    </section>
  </ServicesMotion>;
}
