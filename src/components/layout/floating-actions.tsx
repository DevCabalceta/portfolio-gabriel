"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function FloatingActions({ copy }: { copy: Dictionary }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const heroBoundary = document.querySelector(".floating-actions-sentinel");
    const header = document.querySelector(".site-header");
    if (!heroBoundary) return;
    const setVisible = (visible: boolean) => {
      if (root.current) {
        root.current.dataset.visible = String(visible);
        root.current.inert = !visible;
      }
    };
    const headerHeight = header?.getBoundingClientRect().height ?? 72;
    const activationLine = headerHeight + 16;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < activationLine);
    }, { rootMargin: `-${activationLine}px 0px 0px 0px`, threshold: 0 });
    observer.observe(heroBoundary);
    return () => observer.disconnect();
  }, []);

  const backToTop = () => {
    history.replaceState(null, "", "#home");
    document.getElementById("home")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <div ref={root} className="floating-actions" data-visible="false" inert>
      <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={copy.hero.github} title="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
      </a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={copy.hero.linkedin} title="LinkedIn">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.3 9h3.4v12H3.3V9Zm6 0h3.3v1.6c.5-1 1.7-1.9 3.5-1.9 3.5 0 4.2 2.2 4.2 5V21h-3.5v-6.5c0-1.6 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H9.3V9Z" /></svg>
      </a>
      <a href={`mailto:${profile.email}`} aria-label={copy.nav.contact} title={copy.nav.contact}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
      </a>
      <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-4Z" /><path d="m8 7 1.4-.2 1.1 2.5-1.1 1.1a7.5 7.5 0 0 0 3.7 3.7l1.1-1.1 2.5 1.1-.2 1.4c-.1.8-.9 1.3-1.7 1.2-4.5-.7-7.8-4-8.5-8.5C6.2 7.9 7 7.1 8 7Z" /></svg>
      </a>
      <span className="floating-divider" aria-hidden="true" />
      <button type="button" onClick={backToTop} aria-label={copy.about.back} title={copy.about.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V4m-7 7 7-7 7 7" /></svg>
      </button>
    </div>
  );
}
