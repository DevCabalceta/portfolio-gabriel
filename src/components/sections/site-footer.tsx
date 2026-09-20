import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { profile } from "@/data/profile";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { FooterMotion } from "@/components/animations/footer-motion";
import { SpaLink } from "@/components/ui/spa-link";

type SiteFooterProps = {
  copy: Dictionary["siteFooter"];
  services: Dictionary["services"];
  navigation: Dictionary["nav"];
  locale: Locale;
};

const footerNavigation = [
  ["home", "home"],
  ["about", "about"],
  ["work", "work"],
  ["process", "process"],
  ["faq", "faq"],
] as const;

export function SiteFooter({ copy, services, navigation, locale }: SiteFooterProps) {
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
          <div className="site-footer-aside-copy" data-footer-reveal="description">
            <span className="micro-label">{copy.role}</span>
            <p>{copy.description}</p>
          </div>
        </div>

        <div className="site-footer-directory">
          <section className="site-footer-column site-footer-contact-column" data-footer-reveal="column" aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title" className="micro-label">{copy.contactLabel}</h3>
            <a className="site-footer-email" data-footer-reveal="link" href={`mailto:${profile.email}`}>
              <span>{profile.email}</span><ArrowIcon />
            </a>
            <a className="site-footer-column-link" data-footer-reveal="link" href="#contact"><span>{navigation.contact}</span><ArrowIcon /></a>
          </section>

          <nav className="site-footer-column" data-footer-reveal="column" aria-labelledby="footer-services-title">
            <h3 id="footer-services-title" className="micro-label">{copy.servicesLabel}</h3>
            {services.plans.map((service) => <a data-footer-reveal="link" href="#services" key={service.number}><span>{service.title}</span><ArrowIcon /></a>)}
          </nav>

          <nav className="site-footer-column" data-footer-reveal="column" aria-labelledby="footer-navigation-title">
            <h3 id="footer-navigation-title" className="micro-label">{copy.navigationLabel}</h3>
            {footerNavigation.map(([id, key]) => <a data-footer-reveal="link" href={`#${id}`} key={id}><span>{navigation[key]}</span><ArrowIcon /></a>)}
          </nav>

          <nav className="site-footer-column" data-footer-reveal="column" aria-labelledby="footer-social-title">
            <h3 id="footer-social-title" className="micro-label">{copy.socialLabel}</h3>
            <a data-footer-reveal="link" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><ArrowIcon /></a>
            <a data-footer-reveal="link" href={profile.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><ArrowIcon /></a>
            <a data-footer-reveal="link" href={profile.whatsapp} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><ArrowIcon /></a>
            <a data-footer-reveal="link" href={profile.resume} download><span>{copy.resume}</span><ArrowIcon /></a>
          </nav>
        </div>

        <div className="site-footer-legal" data-footer-reveal="bottom">
          <p>© {new Date().getFullYear()} Gabriel Cabalceta. {copy.rights}</p>
          <nav aria-label={`${copy.privacy} · ${copy.terms}`}>
            <SpaLink href={`/${locale}/privacy`} rememberReturn>{copy.privacy}</SpaLink>
            <SpaLink href={`/${locale}/terms`} rememberReturn>{copy.terms}</SpaLink>
          </nav>
        </div>
      </div>
    </footer>
  </FooterMotion>;
}
