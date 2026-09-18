import type { Dictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/profile";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { FooterMotion } from "@/components/animations/footer-motion";

export function SiteFooter({ copy }: { copy: Dictionary["siteFooter"] }) {
  return <FooterMotion>
    <footer id="site-footer" className="site-footer" aria-labelledby="site-footer-title">
      <div className="site-footer-orbit" aria-hidden="true" />
      <div className="site-footer-inner">
        <div className="site-footer-top micro-label" data-footer-reveal="top">
          <span><i aria-hidden="true" />{copy.eyebrow}</span>
          <span>{copy.location}</span>
        </div>

        <div className="site-footer-chapter">
          <div className="site-footer-heading">
            <span className="site-footer-pretitle micro-label" data-footer-reveal="pretitle">{copy.linksLabel}</span>
            <h2 id="site-footer-title" aria-label={copy.titleLabel}>
              {copy.title.map((line) => <span className="site-footer-title-mask" aria-hidden="true" key={line}><span data-footer-reveal="title">{line}</span></span>)}
            </h2>
          </div>
          <div className="site-footer-aside">
            <div className="site-footer-aside-copy" data-footer-reveal="description">
              <span className="micro-label">{copy.role}</span>
              <p>{copy.description}</p>
            </div>
            <a className="site-footer-email" data-footer-reveal="email" href={`mailto:${profile.email}`}>
              <span className="micro-label">{copy.emailLabel}</span>
              <span className="site-footer-email-address">{profile.email}</span>
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="site-footer-signature" aria-hidden="true">
          <span className="site-footer-signature-mask"><span data-footer-reveal="signature">GABRIEL</span></span>
          <span className="site-footer-signature-mask"><span data-footer-reveal="signature">CABALCETA<span className="site-footer-signature-dot">.</span></span></span>
        </div>

        <nav className="site-footer-links" aria-label={copy.linksLabel}>
          <a data-footer-reveal="link" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><ArrowIcon /></a>
          <a data-footer-reveal="link" href={profile.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><ArrowIcon /></a>
          <a data-footer-reveal="link" href={profile.whatsapp} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><ArrowIcon /></a>
          <a data-footer-reveal="link" href={profile.resume} download><span>{copy.resume}</span><ArrowIcon /></a>
        </nav>

        <div className="site-footer-bottom micro-label" data-footer-reveal="bottom">
          <span>© {new Date().getFullYear()} GABRIEL CABALCETA</span>
          <span>{copy.credit}</span>
          <a href="#home">{copy.backToTop}<span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  </FooterMotion>;
}
