import type { Locale } from "./config";

const es = {
  work: {
    label: "Proyectos", eyebrow: "Del concepto a la pantalla",
    titleFirst: "Código en", titleSecond: "acción",
    introduction: "Plataformas que resuelven. Experiencias que conectan. Una selección de lo que he construido.",
    selected: "Todos los proyectos", explore: "Explorar los proyectos", index: "Más proyectos",
    carousel: "carrusel", browse: "Explora los proyectos", previousProject: "Proyecto anterior", nextProject: "Proyecto siguiente",
    drag: "Arrastra para explorar", goToProject: "Ir al proyecto", pauseCarousel: "Pausar carrusel", playCarousel: "Reanudar carrusel", allImages: "Capturas de todos los proyectos",
    indexDescription: "Sistemas institucionales, productos en desarrollo y exploraciones frontend.",
    professional: "Profesional", personal: "Personal", published: "Publicado", development: "En desarrollo",
    visit: "Visitar proyecto", repository: "Ver código", details: "Explorar el proyecto", gallery: "Más imágenes",
    description: "El proyecto", problem: "El reto", solution: "La solución", results: "Resultados",
    technologies: "Tecnologías", closing: "¿Construimos lo siguiente?", contact: "Hablemos de tu proyecto",
    collaboration: "Colaboración", ownership: "Colaboré en este proyecto. Pertenece a", preview: "Ver capturas", closeGallery: "Cerrar galería", previousImage: "Imagen anterior", nextImage: "Imagen siguiente", imageOf: "de",
  },
  about: {
    label: "Sobre mí", eyebrow: "La persona detrás de la pantalla",
    kicker: "Soy Gabriel. Esto es lo que me mueve.",
    titleFirst: "Detrás del", titleSecond: "código",
    statement: "Entender el sistema. Cuidar la experiencia. Construir con intención.",
    introduction: "Soy desarrollador full stack en Costa Rica. Conecto la lógica de un sistema con la experiencia de quienes lo usan.",
    description: "En Cedes Don Bosco desarrollo y mantengo plataformas web, sistemas de matrícula, admisiones e intranets. Mi recorrido en infraestructura y soporte me ayuda a entender el producto completo, desde la base de datos hasta la interfaz.",
    signature: "Una mirada frontend. Una base full stack.",
    currentLabel: "Actualmente", currentRole: "Full Stack Developer", present: "Actualidad",
    foundationLabel: "Mi punto de partida", foundation: "Infraestructura & soporte",
    foundationDetail: "Redes, servidores y personas · 2022–2025",
    approachLabel: "Cómo construyo", approach: "De la interfaz a los datos",
    approachDetail: "Experiencias web · APIs REST · SQL",
    back: "Volver al inicio",
    portraitAlt: "Retrato de Gabriel Cabalceta sobre un fondo naranja",
  },
  meta: {
    title: "Gabriel Cabalceta — Full Stack Developer",
    description: "Desarrollador full stack en Costa Rica. Desarrollo plataformas web, sistemas y experiencias digitales con especial atención al frontend y a cada detalle.",
  },
  nav: {
    label: "Navegación principal", home: "Inicio", about: "Sobre mí", work: "Proyectos",
    experience: "Experiencia", stack: "Tecnologías", contact: "Hablemos", resume: "Mi CV",
    open: "Abrir menú", close: "Cerrar menú", menu: "Explorar", language: "Seleccionar idioma",
  },
  hero: {
    eyebrow: "Desarrollo & experiencias digitales",
    role: "Full Stack Developer",
    introduction: "De la lógica a la experiencia.",
    description: "Desarrollo plataformas, sistemas y experiencias web. Con una mirada frontend y atención a cada detalle.",
    contact: "Hablemos de tu próximo proyecto", resume: "Descargar CV",
    location: "San José, Costa Rica", locationLabel: "Desde Costa Rica, para el mundo",
    focusLabel: "Mi enfoque", focus: "Código sólido. Experiencias memorables.",
    portraitAlt: "Retrato de Gabriel Cabalceta sobre un fondo naranja",
    chapter: "La introducción", portfolio: "Portfolio personal", skip: "Saltar al contenido",
    linkedin: "Visitar mi perfil de LinkedIn", github: "Visitar mi perfil de GitHub",
    pauseGallery: "Pausar galería de fondo", playGallery: "Reanudar galería de fondo",
    robot: { label: "Robot 3D interactivo", loading: "Cargando robot", error: "El robot no pudo cargar", retry: "Reintentar", pause: "Pausar robot", play: "Animar robot" },
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  work: {
    label: "Work", eyebrow: "From concept to screen",
    titleFirst: "Code in", titleSecond: "action",
    introduction: "Platforms that solve problems. Experiences that connect. A selection of what I've built.",
    selected: "All projects", explore: "Explore the projects", index: "More projects",
    carousel: "carousel", browse: "Browse the projects", previousProject: "Previous project", nextProject: "Next project",
    drag: "Drag to explore", goToProject: "Go to project", pauseCarousel: "Pause carousel", playCarousel: "Resume carousel", allImages: "Screenshots of all projects",
    indexDescription: "Institutional systems, products in development and frontend explorations.",
    professional: "Professional", personal: "Personal", published: "Published", development: "In development",
    visit: "Visit project", repository: "View code", details: "Explore the project", gallery: "More images",
    description: "The project", problem: "The challenge", solution: "The solution", results: "Results",
    technologies: "Technologies", closing: "What shall we build next?", contact: "Let's talk about your project",
    collaboration: "Collaboration", ownership: "I collaborated on this project. It belongs to", preview: "View screenshots", closeGallery: "Close gallery", previousImage: "Previous image", nextImage: "Next image", imageOf: "of",
  },
  about: {
    label: "About me", eyebrow: "The person behind the screen",
    kicker: "I'm Gabriel. Here's what drives me.",
    titleFirst: "Behind the", titleSecond: "code",
    statement: "Understand the system. Care for the experience. Build with intention.",
    introduction: "I'm a full stack developer based in Costa Rica. I connect a system's logic with the experience of the people who use it.",
    description: "At Cedes Don Bosco, I develop and maintain web platforms, enrollment and admissions systems, and intranets. My background in infrastructure and technical support helps me see the whole product, from the database to the interface.",
    signature: "A frontend perspective. A full stack foundation.",
    currentLabel: "Currently", currentRole: "Full Stack Developer", present: "Present",
    foundationLabel: "Where I started", foundation: "Infrastructure & support",
    foundationDetail: "Networks, servers and people · 2022–2025",
    approachLabel: "How I build", approach: "From interface to data",
    approachDetail: "Web experiences · REST APIs · SQL",
    back: "Back to the top",
    portraitAlt: "Portrait of Gabriel Cabalceta against an orange background",
  },
  meta: {
    title: "Gabriel Cabalceta — Full Stack Developer",
    description: "Full stack developer based in Costa Rica. Building web platforms, systems and digital experiences with a frontend perspective and attention to detail.",
  },
  nav: {
    label: "Main navigation", home: "Home", about: "About", work: "Work",
    experience: "Experience", stack: "Stack", contact: "Let's talk", resume: "My CV",
    open: "Open menu", close: "Close menu", menu: "Explore", language: "Select language",
  },
  hero: {
    eyebrow: "Development & digital experiences",
    role: "Full Stack Developer",
    introduction: "From logic to experience.",
    description: "I build platforms, systems and web experiences. With a frontend perspective and attention to every detail.",
    contact: "Let's talk about your next project", resume: "Download CV",
    location: "San José, Costa Rica", locationLabel: "From Costa Rica, to the world",
    focusLabel: "My focus", focus: "Solid code. Memorable experiences.",
    portraitAlt: "Portrait of Gabriel Cabalceta against an orange background",
    chapter: "The introduction", portfolio: "Personal portfolio", skip: "Skip to content",
    linkedin: "Visit my LinkedIn profile", github: "Visit my GitHub profile",
    pauseGallery: "Pause background gallery", playGallery: "Resume background gallery",
    robot: { label: "Interactive 3D robot", loading: "Loading robot", error: "The robot could not load", retry: "Retry", pause: "Pause robot", play: "Animate robot" },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : es;
}
