import type { Dictionary } from "@/i18n/dictionaries";
import Image from "next/image";
import { profile } from "@/data/profile";
import { TechnologyStack } from "@/components/ui/technology-stack";

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
          <div className="about-profile" data-about-reveal>
            <figure className="about-portrait">
              <div className="profile-photo-frame"><Image src={profile.portrait} alt={copy.portraitAlt} fill sizes="(max-width: 899px) 108px, 126px" quality={85} /></div>
              <figcaption className="micro-label">Gabriel Cabalceta<span>Full Stack Developer</span></figcaption>
            </figure>
            <p className="about-lead">{copy.introduction}</p>
          </div>
          <p className="about-description" data-about-reveal>{copy.description}</p>
          <TechnologyStack label={copy.technologyLabel} hint={copy.technologyHint} />
        </div>
      </div>

      <dl className="about-facts" data-about-reveal>
        <div><dt className="micro-label">{copy.currentLabel}</dt><dd>{copy.currentRole}<span>{copy.currentDetail}</span></dd></div>
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
