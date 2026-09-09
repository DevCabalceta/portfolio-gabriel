import type { Project } from "@/types/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ArrowIcon } from "./arrow-icon";

export function ProjectLinks({ project, locale, copy }: { project: Project; locale: Locale; copy: Dictionary["work"] }) {
  const title = project.displayTitle?.[locale] ?? project.title;
  return <div className="project-links">
    {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.visit}: ${title}`}>{copy.visit}<ArrowIcon /></a>}
    {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer" aria-label={`${copy.repository}: ${title}`}>{copy.repository}<ArrowIcon /></a>}
  </div>;
}

export function ProjectDetails({ project, locale, copy }: { project: Project; locale: Locale; copy: Dictionary["work"] }) {
  const study = project.caseStudy;
  return <>
    {project.technologies.length > 0 && <ul className="project-technologies" aria-label={copy.technologies}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
    {study && <details className="project-case">
      <summary>{copy.details}<span aria-hidden="true">+</span></summary>
      <div className="project-case-body">
        <h4>{copy.description}</h4><p>{study.description[locale]}</p>
        <h4>{copy.problem}</h4><p>{study.problem[locale]}</p>
        <h4>{copy.solution}</h4><p>{study.solution[locale]}</p>
        {study.results[locale].length > 0 && <><h4>{copy.results}</h4><ul>{study.results[locale].map((result) => <li key={result}>{result}</li>)}</ul></>}
      </div>
    </details>}
  </>;
}
