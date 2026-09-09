import type { Dictionary } from "@/i18n/dictionaries";
import Image from "next/image";
import { profile } from "@/data/profile";

function AnimatedLetters({ text }: { text: string }) {
  return <span data-about-line aria-hidden="true">{Array.from(text).map((letter, index) => <span className="about-character" data-about-char key={index}>{letter === " " ? "\u00a0" : letter}</span>)}</span>;
}

export function About({ copy }: { copy: Dictionary["about"] }) {
  return (
    <section id="about" className="about" aria-labelledby="about-title" tabIndex={-1} data-chapter-incoming>
      <div className="about-atmosphere" aria-hidden="true" />
      <div className="about-pin"><div className="about-frame">
      <div className="about-topline" data-about-reveal>
        <p className="micro-label"><span className="about-chapter">02 /</span> {copy.label}</p>
        <p className="micro-label about-edition">{copy.eyebrow}</p>
      </div>

      <div className="about-story">
        <div className="about-heading">
          <p className="about-kicker" data-about-reveal>{copy.kicker}</p>
          <h2 id="about-title" className="about-title" aria-label={`${copy.titleFirst} ${copy.titleSecond}.`}>
            <span className="title-mask"><AnimatedLetters text={copy.titleFirst} /></span>
            <span className="title-mask"><AnimatedLetters text={`${copy.titleSecond}.`} /></span>
          </h2>
          <p className="about-statement" data-about-reveal>{copy.statement}</p>
        </div>

        <div className="about-narrative">
          <figure className="about-portrait" data-about-reveal>
            <div className="profile-photo-frame"><Image src={profile.portrait} alt={copy.portraitAlt} fill sizes="(max-width: 899px) 120px, 150px" quality={85} /></div>
            <figcaption className="micro-label">Gabriel Cabalceta<span>Full Stack Developer</span></figcaption>
          </figure>
          <p className="about-lead" data-about-reveal>{copy.introduction}</p>
          <p className="about-description" data-about-reveal>{copy.description}</p>
          <div className="about-signature" data-about-reveal>
            <span className="about-signature-line" aria-hidden="true" />
            <span>{copy.signature}</span>
          </div>
        </div>
      </div>

      <dl className="about-facts" data-about-reveal>
        <div><dt className="micro-label">{copy.currentLabel}</dt><dd>{copy.currentRole}<span>Cedes Don Bosco · 2025 — {copy.present}</span></dd></div>
        <div><dt className="micro-label">{copy.foundationLabel}</dt><dd>{copy.foundation}<span>{copy.foundationDetail}</span></dd></div>
        <div><dt className="micro-label">{copy.approachLabel}</dt><dd>{copy.approach}<span>{copy.approachDetail}</span></dd></div>
      </dl>

      <div className="about-footer" data-about-reveal>
        <span className="micro-label">San José, Costa Rica</span>
      </div>
      </div>
      </div>
    </section>
  );
}
