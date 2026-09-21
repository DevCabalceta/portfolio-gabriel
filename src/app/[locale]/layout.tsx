import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/profile";
import "../globals.css";

const sans = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const display = Anton({ weight: "400", variable: "--font-display", subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { meta } = getDictionary(locale);
  const siteUrl = profile.portfolio;
  const socialImage = {
    url: "/images/portfolio-preview.jpg",
    width: 1200,
    height: 630,
    alt: locale === "es" ? "Portfolio de Gabriel Cabalceta — Full Stack Developer" : "Gabriel Cabalceta's portfolio — Full Stack Developer",
  };
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    authors: [{ name: "Gabriel Cabalceta" }],
    alternates: { canonical: `/${locale}`, languages: { es: "/es", en: "/en", "x-default": "/es" } },
    openGraph: { title: meta.title, description: meta.description, type: "website", locale: locale === "es" ? "es_CR" : "en_US", alternateLocale: locale === "es" ? "en_US" : "es_CR", siteName: "Gabriel Cabalceta", url: `/${locale}`, images: [socialImage] },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [socialImage] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
