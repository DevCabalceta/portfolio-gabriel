import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { locales } from "@/i18n/config";

const routes = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => locales.map((locale) => ({
    url: `${profile.portfolio}/${locale}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        es: `${profile.portfolio}/es${route.path}`,
        en: `${profile.portfolio}/en${route.path}`,
        "x-default": `${profile.portfolio}/es${route.path}`,
      },
    },
  })));
}
