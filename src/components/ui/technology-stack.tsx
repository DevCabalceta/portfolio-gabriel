import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { DiVisualstudio } from "react-icons/di";
import { FaCss3Alt, FaJava } from "react-icons/fa6";
import {
  SiAstro,
  SiBootstrap,
  SiDotnet,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostman,
  SiPython,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { technologies } from "@/data/technologies";

const icons: Record<(typeof technologies)[number]["id"], IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  html: SiHtml5,
  css: FaCss3Alt,
  tailwind: SiTailwindcss,
  bootstrap: SiBootstrap,
  react: SiReact,
  nextjs: SiNextdotjs,
  astro: SiAstro,
  svelte: SiSvelte,
  nodejs: SiNodedotjs,
  python: SiPython,
  java: FaJava,
  php: SiPhp,
  dotnet: SiDotnet,
  mongodb: SiMongodb,
  mysql: SiMysql,
  firebase: SiFirebase,
  figma: SiFigma,
  postman: SiPostman,
  git: SiGit,
  github: SiGithub,
  visualstudio: DiVisualstudio,
};

type TechnologyStyle = CSSProperties & {
  "--technology-color": string;
  "--technology-foreground": string;
  "--technology-order": number;
};

export function TechnologyStack({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="about-stack" data-about-reveal>
      <div className="about-stack-heading">
        <h3>{label}</h3>
        <span>{hint}</span>
      </div>
      <ul className="technology-grid" aria-label={label}>
        {technologies.map((technology, index) => {
          const Icon = icons[technology.id];
          const style: TechnologyStyle = {
            "--technology-color": technology.color,
            "--technology-foreground": technology.foreground,
            "--technology-order": index,
          };

          return (
            <li className="technology-item" key={technology.id} style={style} tabIndex={0} aria-label={technology.name}>
              <Icon aria-hidden="true" focusable="false" />
              <span aria-hidden="true">{technology.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
