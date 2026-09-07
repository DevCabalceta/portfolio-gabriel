import type { Project } from "@/types/content";

// Source: supplied CV. Empty media/technologies are intentional when not specified.
// Populate case studies and verified per-project technologies before their section ships.
export const projects: Project[] = [
  {
    id: "enrollment", title: "Online Enrollment System", category: "professional", status: "published",
    summary: { es: "Plataforma de matrícula con formularios por etapas, documentos, firma digital y seguimiento de requisitos.", en: "Enrollment platform with multi-step forms, document uploads, digital signature and requirement tracking." },
    technologies: [], media: [], url: "https://cedesdonbosco.ed.cr/matricula/",
  },
  {
    id: "intranet", title: "Institutional Intranet", category: "professional", status: "published",
    summary: { es: "Portal interno para el personal y las operaciones académicas de la institución.", en: "Internal portal supporting staff and academic operations." },
    technologies: [], media: [], url: "https://intranet.cedesdonbosco.ed.cr/",
  },
  {
    id: "cdc", title: "CDC — Centro de Desarrollo de Competencias", category: "professional", status: "published",
    summary: { es: "Sitio institucional de formación, producción e investigación, con noticias y catálogo de cursos.", en: "Institutional site for training, production and R&D, with news and a course catalog." },
    technologies: [], media: [], url: "https://cedesdonbosco.ed.cr/cdc/",
  },
  {
    id: "expotec", title: "EXPOTEC 2026", category: "professional", status: "published",
    summary: { es: "Landing con cuenta regresiva y portal administrativo para la feria tecnológica institucional.", en: "Countdown landing page and administrative portal for the institution's technology fair." },
    technologies: [], media: [], url: "http://cedesdonbosco.ed.cr/expotec",
  },
  {
    id: "parent-portal", title: "Parent Portal", category: "professional", status: "in-development",
    summary: { es: "Portal para familias, en desarrollo según el CV.", en: "Parent portal, in development according to the CV." },
    technologies: [], media: [],
  },
  {
    id: "upgrade", title: "Upgrade! Comunicación y Entretenimiento", category: "personal", status: "in-development",
    summary: { es: "Sistema full stack para Upgrade! Comunicación y Entretenimiento.", en: "Full-stack system for Upgrade! Comunicación y Entretenimiento." },
    technologies: [], media: [],
  },
  {
    id: "fan-de-maiz", title: "Fan de Maíz", category: "personal", status: "published",
    summary: { es: "Sitio comercial para una panadería costarricense con catálogo e integración de WhatsApp y redes sociales.", en: "Website for a Costa Rican bakery with a product catalog and WhatsApp/social media integration." },
    technologies: [], media: [], url: "http://fandemaiz.com",
  },
  {
    id: "spotify", title: "Spotify Clone", category: "personal", status: "published",
    summary: { es: "Recreación frontend de Spotify desarrollada con Astro.", en: "Frontend recreation of Spotify built with Astro." },
    technologies: ["Astro"], media: [], url: "https://gabriel-spotify-clone.netlify.app/",
  },
  {
    id: "tesla", title: "Tesla Landing Page Clone", category: "personal", status: "published",
    summary: { es: "Recreación de la landing de Tesla desarrollada con Astro.", en: "Recreation of the Tesla landing page built with Astro." },
    technologies: ["Astro"], media: [], url: "https://gabriel-tesla-landing.netlify.app/",
  },
  {
    id: "gif-search", title: "GIF Search App", category: "personal", status: "published",
    summary: { es: "Aplicación interactiva para buscar y explorar GIFs.", en: "Interactive application for searching and browsing GIFs." },
    technologies: [], media: [], url: "https://gabriel-gifs-app.netlify.app/",
  },
];
