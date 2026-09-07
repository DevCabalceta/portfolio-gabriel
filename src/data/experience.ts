import type { Experience } from "@/types/content";

export const experience: Experience[] = [
  {
    id: "full-stack", company: "Colegio Técnico Cedes Don Bosco",
    role: { es: "Desarrollador Full Stack", en: "Full Stack Developer" }, start: "2025-01", end: null,
    summary: {
      es: "Desarrollo y mantenimiento de plataformas institucionales, sistemas de matrícula y admisiones, intranet, APIs REST y bases de datos.",
      en: "Development and maintenance of institutional platforms, enrollment and admissions systems, intranet, REST APIs and databases.",
    },
  },
  {
    id: "technical-support", company: "Colegio Técnico Cedes Don Bosco",
    role: { es: "Especialista en soporte técnico", en: "Technical Support Specialist" }, start: "2022-08", end: "2025-01",
    summary: {
      es: "Administración de redes Cisco, infraestructura Windows y Linux, Active Directory y servidores. Instructor de cursos Cisco y Python.",
      en: "Administration of Cisco networks, Windows and Linux infrastructure, Active Directory and servers. Cisco and Python course instructor.",
    },
  },
];
