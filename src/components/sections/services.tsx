import type { Dictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/profile";
import { ServicesMotion } from "@/components/animations/services-motion";
import { ArrowIcon } from "@/components/ui/arrow-icon";

function whatsappFor(message: string) {
  return `${profile.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function Services({ copy }: { copy: Dictionary["services"] }) {
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

      <ol className="services-plans" aria-label={copy.label}>
        {copy.plans.map((plan, index) => <li className={`service-plan${plan.recommended ? " service-plan-recommended" : ""}`} key={plan.title}>
          <span className="service-plan-line" data-service-line aria-hidden="true" />
          <div className="service-plan-topline micro-label">
            <span data-service-part="number">{plan.number}</span>
            <span data-service-part="kind">{plan.kind}</span>
          </div>
          <div className="service-plan-heading">
            <div className="service-plan-title-mask"><h3 data-service-part="title">{plan.title}</h3></div>
            <p className="service-price" data-service-part="price"><span>{plan.price}</span>{plan.priceNote && <small>{plan.priceNote}</small>}</p>
          </div>
          {plan.recommended && <p className="service-recommended micro-label" data-service-part="recommended"><span aria-hidden="true" />{copy.recommended}</p>}
          <p className="service-summary" data-service-part="summary">{plan.summary}</p>
          <div className="service-benefits">
            <p className="micro-label" data-service-part="benefits-label">{copy.includes}</p>
            <ul>
              {plan.features.map((feature, featureIndex) => <li data-service-benefit key={feature}><span>{String(featureIndex + 1).padStart(2, "0")}</span>{feature}</li>)}
            </ul>
          </div>
          <a className="service-cta" data-service-part="cta" href={whatsappFor(copy.inquiry.replace("{plan}", plan.title))} target="_blank" rel="noopener noreferrer">
            <span>{plan.cta}</span><ArrowIcon />
          </a>
          <span className="service-plan-index" aria-hidden="true">0{index + 1}</span>
        </li>)}
      </ol>

      <footer className="services-footer micro-label" data-services-outro>
        <span>{copy.footer}</span><span>San José, Costa Rica</span>
      </footer>
    </section>
  </ServicesMotion>;
}
