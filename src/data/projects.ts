import type { Project, ProjectMedia } from "@/types/content";

const screenshot = (file: string, es: string, en: string): ProjectMedia => ({ type: "image", src: `/images/projects/${file}`, alt: { es, en } });
export const featuredProjectIds = ["upgrade", "fan-de-maiz", "spotify", "gif-search", "todo"] as const;

// Sources: supplied CV, Gabriel's corrections and six supplied Upgrade/ToDo images.
// Other images are public entry-page captures. Do not infer project metrics or stacks.
export const projects: Project[] = [
  {
    id: "enrollment", title: "Online Enrollment System", category: "professional", status: "published",
    displayTitle: { es: "Matrícula en línea", en: "Online Enrollment" }, owner: "CEDES Don Bosco",
    summary: { es: "Plataforma de matrícula con formularios por etapas, documentos, firma digital y seguimiento de requisitos.", en: "Enrollment platform with multi-step forms, document uploads, digital signature and requirement tracking." },
    technologies: [], media: [{ type: "image", src: "/images/projects/enrollment.jpg", alt: { es: "Página pública de matrícula de CEDES Don Bosco", en: "CEDES Don Bosco public enrollment page" } }], url: "https://cedesdonbosco.ed.cr/matricula/",
  },
  {
    id: "intranet", title: "Institutional Intranet", category: "professional", status: "published",
    displayTitle: { es: "Intranet institucional", en: "Institutional Intranet" },
    owner: "CEDES Don Bosco",
    summary: { es: "Portal interno para el personal y las operaciones académicas de la institución.", en: "Internal portal supporting staff and academic operations." },
    technologies: [], media: [screenshot("intranet.jpg", "Acceso público a la intranet de CEDES Don Bosco", "CEDES Don Bosco intranet public sign-in page")], url: "https://intranet.cedesdonbosco.ed.cr/",
  },
  {
    id: "cdc", title: "CDC — Centro de Desarrollo de Competencias", category: "professional", status: "published",
    owner: "CEDES Don Bosco",
    summary: { es: "Sitio institucional de formación, producción e investigación, con noticias y catálogo de cursos.", en: "Institutional site for training, production and R&D, with news and a course catalog." },
    technologies: [], media: [screenshot("cdc.jpg", "Sitio del Centro de Desarrollo de Competencias", "Competency Development Center website")], url: "https://cedesdonbosco.ed.cr/cdc/",
  },
  {
    id: "expotec", title: "EXPOTEC 2026", category: "professional", status: "published",
    owner: "CEDES Don Bosco",
    summary: { es: "Landing con cuenta regresiva y portal administrativo para la feria tecnológica institucional.", en: "Countdown landing page and administrative portal for the institution's technology fair." },
    technologies: [], media: [{ type: "image", src: "/images/projects/expotec.jpg", alt: { es: "Página pública de la feria tecnológica EXPOTEC", en: "EXPOTEC technology fair public website" } }], url: "https://cedesdonbosco.ed.cr/expotec/",
  },
  {
    id: "bosconet", title: "BoscoNet", category: "professional", status: "published", owner: "CEDES Don Bosco",
    summary: { es: "Portal para familias de la institución.", en: "Portal for the institution's families." },
    technologies: [], media: [screenshot("bosnet.jpg", "Acceso público a BosNet para familias", "BosNet public family sign-in page")], url: "https://bosconet.cedesdonbosco.ed.cr/v1/",
  },
  {
    id: "upgrade", title: "Upgrade! Comunicación y Entretenimiento", category: "personal", status: "in-development",
    featured: true,
    summary: { es: "Sistema full stack para Upgrade! Comunicación y Entretenimiento.", en: "Full-stack system for Upgrade! Comunicación y Entretenimiento." },
    technologies: [], media: [
      screenshot("upgrade-1.png", "Upgrade: presentación de servicios audiovisuales", "Upgrade: audiovisual services homepage"),
      screenshot("upgrade-2.png", "Upgrade: acceso a la plataforma ERP", "Upgrade: ERP sign-in screen"),
      screenshot("upgrade-3.png", "Upgrade: panel de gestión de operaciones", "Upgrade: operations dashboard"),
    ],
  },
  {
    id: "todo", title: "Academic ToDo", category: "personal", status: "in-development", featured: true,
    summary: { es: "Aplicación para organizar materias, tareas y apuntes, con calendario y un panel de seguimiento académico.", en: "An app to organize subjects, tasks and notes, with a calendar and an academic progress dashboard." },
    technologies: [], media: [
      screenshot("todo-1.png", "Academic ToDo: página de presentación", "Academic ToDo: homepage"),
      screenshot("todo-2.png", "Academic ToDo: inicio de sesión", "Academic ToDo: sign-in screen"),
      screenshot("todo-3.png", "Academic ToDo: panel de tareas y notas", "Academic ToDo: tasks and notes dashboard"),
    ],
  },
  {
    id: "fan-de-maiz", title: "Fan de Maíz", category: "personal", status: "published",
    featured: true,
    summary: { es: "Sitio comercial para una panadería costarricense con catálogo e integración de WhatsApp y redes sociales.", en: "Website for a Costa Rican bakery with a product catalog and WhatsApp/social media integration." },
    technologies: [], media: [{ type: "image", src: "/images/projects/fan-de-maiz.jpg", alt: { es: "Página principal de la panadería Fan de Maíz", en: "Fan de Maíz bakery homepage" } }], url: "https://fandemaiz.com/",
  },
  {
    id: "spotify", title: "Spotify Clone", category: "personal", status: "published",
    featured: true,
    summary: { es: "Recreación frontend de Spotify desarrollada con Astro.", en: "Frontend recreation of Spotify built with Astro." },
    technologies: ["Astro"], media: [screenshot("spotify.jpg", "Interfaz del clon de Spotify", "Spotify clone interface")], url: "https://spotify-clone-silk-chi.vercel.app/",
  },
  {
    id: "tesla", title: "Tesla Landing Page Clone", category: "personal", status: "published",
    summary: { es: "Recreación de la landing de Tesla desarrollada con Astro.", en: "Recreation of the Tesla landing page built with Astro." },
    technologies: ["Astro"], media: [screenshot("tesla.jpg", "Página del clon de Tesla", "Tesla landing page clone")], url: "https://gabriel-tesla-landing.netlify.app/",
  },
  {
    id: "gif-search", title: "GIF Search App", category: "personal", status: "published",
    featured: true,
    summary: { es: "Aplicación interactiva para buscar y explorar GIFs.", en: "Interactive application for searching and browsing GIFs." },
    technologies: [], media: [screenshot("gif-search.jpg", "Buscador de GIFs", "GIF search application")], url: "https://gabriel-gifs-app.netlify.app/",
  },
];
