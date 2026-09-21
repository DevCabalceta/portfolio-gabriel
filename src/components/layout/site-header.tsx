"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { sections } from "@/data/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function SiteHeader({ locale, copy }: { locale: Locale; copy: Dictionary["nav"] }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const sentinel = document.createElement("span");
    sentinel.className = "header-scroll-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(([entry]) => {
      if (header.current) header.current.dataset.scrolled = String(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const links: { href: string; label: string; target?: "_blank" }[] = [
    ...sections.filter((section) => section.ready && section.id !== "contact").map((section) => ({ href: `#${section.id}`, label: copy[section.label] })),
    { href: profile.resume, label: copy.resume, target: "_blank" as const },
    { href: "#contact", label: copy.contact },
  ];

  return (
    <>
      <header ref={header} className="site-header">
        <a className="wordmark" href={`/${locale}#home`} aria-label={`${profile.name} — ${copy.home}`}>gc<span>✳</span></a>
        <nav className="desktop-nav" aria-label={copy.label}>
          {links.map((link, index) => <a key={link.href} href={link.href} target={link.target} rel={link.target ? "noopener noreferrer" : undefined} className={index === links.length - 1 ? "nav-contact" : ""}>{link.label}{index === links.length - 1 && <ArrowIcon />}</a>)}
        </nav>
        <div className="header-controls">
          <LanguageSwitch locale={locale} label={copy.language} />
          <button ref={trigger} type="button" className="menu-toggle" aria-label={copy.open} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "mobile-menu" : undefined} onClick={() => setOpen(true)}><span /><span /></button>
        </div>
      </header>
      {open && <MobileMenu key={locale} locale={locale} copy={copy} links={links} onClose={closeMenu} trigger={trigger} />}
    </>
  );
}
