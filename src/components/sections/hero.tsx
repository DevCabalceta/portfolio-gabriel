import Image from "next/image";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroMotion } from "@/components/animations/hero-motion";
import { ActionLink } from "@/components/ui/action-link";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { HeroGallery } from "./hero-gallery";

export function Hero({ copy }: { copy: Dictionary["hero"] }) {
  return (
    <HeroMotion>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <HeroGallery copy={copy} />
        <div className="hero-topline" data-hero-reveal>
          <span className="micro-label"><span className="accent-cross">+</span>{copy.eyebrow}</span>
          <span className="micro-label hero-edition">{copy.portfolio} / 2026</span>
        </div>
        <div className="hero-content">
          <div className="hero-intro">
            <p className="hero-role micro-label" data-hero-reveal><span className="status-dot" />{copy.role}</p>
            <figure className="hero-visual">
              <div className="hero-photo-frame">
                <div className="hero-portrait" data-hero-portrait>
                  <Image src={profile.portrait} alt={copy.portraitAlt} fill sizes="(max-width: 899px) 72px, (max-width: 1100px) 24vw, 320px" preload quality={85} />
                </div>
              </div>
              <figcaption className="portrait-caption micro-label" data-hero-reveal><span className="caption-line" />{copy.locationLabel}</figcaption>
            </figure>
          </div>
          <h1 id="hero-title" className="hero-title" aria-label={profile.name}>
            <span className="title-mask"><span data-hero-line>GABRIEL</span></span>
            <span className="title-mask"><span data-hero-line>CABALCETA<span className="name-period">.</span></span></span>
          </h1>
          <div className="hero-description" data-hero-reveal>
            <p className="hero-introduction">{copy.introduction}</p>
            <p>{copy.description}</p>
          </div>
          <div className="hero-actions" data-hero-reveal>
            <ActionLink href={`mailto:${profile.email}`} primary>{copy.contact}</ActionLink>
            <ActionLink href={profile.resume} download>{copy.resume}</ActionLink>
          </div>
        </div>
        <footer className="hero-footer" data-hero-reveal>
          <div className="chapter-mark"><span className="chapter-number">01</span><span className="micro-label">{copy.chapter}</span></div>
          <div className="hero-location"><span className="location-symbol" aria-hidden="true">⊕</span><span>{copy.location}<small>UTC −06:00</small></span></div>
          <a className="social-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={copy.linkedin}>LinkedIn <ArrowIcon /></a>
          {profile.github && <a className="social-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={copy.github}>GitHub <ArrowIcon /></a>}
        </footer>
      </section>
    </HeroMotion>
  );
}
