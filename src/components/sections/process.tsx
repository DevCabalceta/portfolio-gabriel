import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ProcessMotion } from "@/components/animations/process-motion";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function Process({ copy, locale }: { copy: Dictionary["process"]; locale: Locale }) {
  return <ProcessMotion>
    <section id="process" className="process" aria-labelledby="process-title" tabIndex={-1}>
      <div className="process-story">
        <div className="process-stage">
          <div className="process-topline micro-label" data-process-intro><span><span>04 /</span> {copy.label}</span><span>{copy.eyebrow}</span></div>
          <div className="process-atmosphere" aria-hidden="true">
            <span className="process-orbit process-orbit-outer" />
            <span className="process-orbit process-orbit-inner" />
            <span className="process-cross">✳</span>
            <span className="process-watermark">PROCESS</span>
          </div>
          <div className="process-intro">
            <h2 id="process-title" className="process-title" aria-label={copy.titleLabel}>
              {copy.title.map((line) => <span className="title-mask" aria-hidden="true" key={line}><span data-process-title>{line}</span></span>)}
            </h2>
            <p className="process-introduction" data-process-intro>{copy.introduction}</p>
            <a className="process-contact" data-process-intro href={getWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer">{copy.contact}<ArrowIcon /></a>
            <p className="process-note micro-label" data-process-intro><span aria-hidden="true" />{copy.note}</p>
          </div>
          <div className="process-timeline">
            <span className="process-timeline-track" aria-hidden="true"><span className="process-timeline-progress" /></span>
            <ol className="process-chapters" aria-label={copy.label}>
              {copy.steps.map((step, index) => <li className="process-step" key={step.label}>
                <span className="process-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="process-step-content">
                  <p className="process-step-label micro-label"><span>{String(index + 1).padStart(2, "0")}</span> / {step.label}</p>
                  <div className="process-step-title-mask"><h3>{step.title}</h3></div>
                  <p className="process-step-description">{step.description}</p>
                  <p className="process-step-detail micro-label">{step.detail}</p>
                </div>
              </li>)}
            </ol>
          </div>
          <div className="process-meter" aria-hidden="true">
            <span>01</span><span className="process-meter-track"><span className="process-progress" /></span><span>07</span>
          </div>
        </div>
      </div>
      <footer className="process-footer">
        <span className="process-footer-index micro-label" data-process-closing="index">04 / 04</span>
        <div className="process-closing-copy">
          <p aria-label={copy.closing}>
            {copy.closing.split(" ").map((word, index) => <span className="process-closing-word-mask" aria-hidden="true" key={`${word}-${index}`}><span data-process-closing="word">{word}&nbsp;</span></span>)}
          </p>
          <span data-process-closing="detail">{copy.closingDetail}</span>
        </div>
        <a data-process-closing="cta" href={getWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer">{copy.fallbackContact}<ArrowIcon /></a>
      </footer>
    </section>
  </ProcessMotion>;
}
