import type { Localized } from "@/i18n/config";

export interface ProjectMedia {
  type: "image" | "video" | "gif";
  src: string;
  alt: Localized<string>;
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  displayTitle?: Localized<string>;
  featured?: boolean;
  owner?: string;
  category: "professional" | "personal";
  status: "published" | "in-development";
  summary: Localized<string>;
  technologies: string[];
  year?: number;
  media: ProjectMedia[];
  url?: string;
  repository?: string;
  caseStudy?: {
    description: Localized<string>;
    problem: Localized<string>;
    solution: Localized<string>;
    results: Localized<string[]>;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: Localized<string>;
  start: string;
  end: string | null;
  summary: Localized<string>;
}
