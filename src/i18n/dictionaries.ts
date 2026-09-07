import type { Locale } from "./config";

const es = {
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
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
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
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : es;
}
