import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Toaster } from "sileo";
import "sileo/styles.css";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: meta.title,
    description: meta.description,
    authors: [{ name: "Gabriel Cabalceta" }],
    ...(siteUrl ? { alternates: { canonical: `/${locale}`, languages: { es: "/es", en: "/en", "x-default": "/es" } } } : {}),
    openGraph: { title: meta.title, description: meta.description, type: "website", locale: locale === "es" ? "es_CR" : "en_US", alternateLocale: locale === "es" ? "en_US" : "es_CR", siteName: "Gabriel Cabalceta", ...(siteUrl ? { url: `/${locale}` } : {}) },
    twitter: { card: "summary", title: meta.title, description: meta.description },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body><Toaster position="top-center" offset={{ top: 84 }} options={{ fill: "#211e1b", roundness: 12 }} />{children}</body>
    </html>
  );
}
