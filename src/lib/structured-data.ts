import { profile } from "@/data/profile";
import { technologies } from "@/data/technologies";
import type { Locale } from "@/i18n/config";

const localized = {
  es: {
    pageName: "Gabriel Cabalceta | Desarrollador web en Costa Rica",
    description: "Portfolio de Gabriel Cabalceta, desarrollador de software y páginas web en Costa Rica.",
    services: ["Landing pages", "Sitios web", "Proyectos web personalizados"],
  },
  en: {
    pageName: "Gabriel Cabalceta | Full Stack Developer in Costa Rica",
    description: "Portfolio of Gabriel Cabalceta, a software and web developer based in Costa Rica.",
    services: ["Landing pages", "Websites", "Custom web projects"],
  },
} as const;

export function getHomeStructuredData(locale: Locale) {
  const siteUrl = profile.portfolio;
  const pageUrl = `${siteUrl}/${locale}`;
  const copy = localized[locale];
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: "DevCabalceta",
        url: pageUrl,
        image: `${siteUrl}${profile.portrait}`,
        jobTitle: "Full Stack Developer",
        email: `mailto:${profile.email}`,
        telephone: "+50683442305",
        address: {
          "@type": "PostalAddress",
          addressLocality: "San José",
          addressCountry: "CR",
        },
        sameAs: [profile.github, profile.linkedin],
        knowsAbout: technologies.map(({ name }) => name),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: "Gabriel Cabalceta",
        alternateName: "DevCabalceta",
        inLanguage: ["es", "en"],
        creator: { "@id": personId },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: copy.pageName,
        description: copy.description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
      },
      ...copy.services.map((name, index) => ({
        "@type": "Service",
        "@id": `${pageUrl}/#service-${index + 1}`,
        name,
        serviceType: name,
        provider: { "@id": personId },
        areaServed: { "@type": "Country", name: "Costa Rica" },
        url: `${pageUrl}#services`,
      })),
    ],
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
