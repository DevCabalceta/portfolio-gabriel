import { projects, featuredProjectIds } from "@/data/projects";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProjectsMotion } from "@/components/animations/projects-motion";
import { ProjectGallery } from "@/components/ui/project-gallery";
import { ProjectCarousel } from "@/components/ui/project-carousel";
import { ProjectDetails, ProjectLinks } from "@/components/ui/project-details";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function Projects({ locale, copy }: { locale: Locale; copy: Dictionary["work"] }) {
  const featured = projects.filter((project) => project.featured).sort((a, b) => featuredProjectIds.findIndex((id) => id === a.id) - featuredProjectIds.findIndex((id) => id === b.id));
  const collection = [...featured, ...projects.filter((project) => !project.featured)];
  return <ProjectsMotion>
    <section id="work" className="work" aria-labelledby="work-title" tabIndex={-1}>
      <header className="work-intro">
        <div className="work-topline micro-label" data-work-reveal><span><span className="work-accent">03 /</span> {copy.label}</span><span>{copy.eyebrow}</span></div>
        <h2 id="work-title" className="work-title" aria-label={`${copy.titleFirst} ${copy.titleSecond}.`}>
          {[copy.titleFirst, `${copy.titleSecond}.`].map((line) => <span className="title-mask" aria-hidden="true" key={line}><span>{Array.from(line).map((char, index) => <span className="work-character" data-work-char key={index}>{char === " " ? "\u00a0" : char}</span>)}</span></span>)}
        </h2>
        <div className="work-introduction" data-work-reveal><p>{copy.introduction}</p><a href="#selected-projects" className="work-explore"><span className="micro-label">{copy.explore}</span><ArrowIcon /></a></div>
        <span className="work-watermark" aria-hidden="true">03</span>
      </header>

      <ProjectCarousel copy={copy}>
        {collection.map((project, index) => {
          const title = project.displayTitle?.[locale] ?? project.title;
          return <article key={project.id} className="featured-project" data-project={project.id} aria-labelledby={`project-${project.id}`}>
            <div className="project-topline micro-label"><span>{String(index + 1).padStart(2, "0")} / {String(collection.length).padStart(2, "0")}</span><span>{copy[project.category]}{project.year && ` / ${project.year}`}</span></div>
            <div className="project-composition">
              <div className="project-visual">
                {project.media[0] ? <ProjectGallery media={project.media} title={title} locale={locale} copy={copy} /> : <div className="project-cover" aria-hidden="true">{title}</div>}
              </div>
              <div className="project-caption">
                <p className="project-status micro-label"><span />{project.status === "published" ? copy.published : copy.development}</p>
                <h3 id={`project-${project.id}`}>{title}</h3>
                {project.owner && <span className="project-owner micro-label">{copy.collaboration} · {project.owner}</span>}
                <p className="project-description">{project.summary[locale]}</p>
                {project.owner && <p className="project-ownership">{copy.ownership} <strong>{project.owner}</strong>.</p>}
                <ProjectDetails project={project} locale={locale} copy={copy} />
                <ProjectLinks project={project} locale={locale} copy={copy} />
              </div>
            </div>
          </article>;
        })}
      </ProjectCarousel>

      <footer className="work-footer" data-work-reveal><p>{copy.closing}</p><a href={`mailto:${profile.email}`}>{copy.contact}<ArrowIcon /></a></footer>
    </section>
  </ProjectsMotion>;
}
