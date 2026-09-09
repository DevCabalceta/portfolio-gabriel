"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectMedia as Media } from "@/types/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProjectMedia } from "./project-media";

type GalleryProject = { id: string; title: string; owner?: string; media: Media[] };
type Entry = { project: GalleryProject; media: Media; number: number };
const GalleryContext = createContext<{ isOpen: boolean; open: (projectId: string, trigger: HTMLAnchorElement) => void } | null>(null);
export function useProjectGallery() {
  const value = useContext(GalleryContext);
  if (!value) throw new Error("ProjectGalleryProvider is required");
  return value;
}

export function ProjectGalleryProvider({ projects, locale, copy, children }: { projects: GalleryProject[]; locale: Locale; copy: Dictionary["work"]; children: ReactNode }) {
  const entries = useMemo(() => projects.flatMap((project) => project.media.map((media, number) => ({ project, media, number }))), [projects]);
  const [opened, setOpened] = useState<{ index: number; trigger: HTMLAnchorElement } | null>(null);
  return <GalleryContext.Provider value={{ isOpen: Boolean(opened), open: (id, trigger) => {
    const index = entries.findIndex((entry) => entry.project.id === id);
    if (index >= 0) setOpened({ index, trigger });
  } }}>{children}{opened && <GalleryDialog entries={entries} initialIndex={opened.index} trigger={opened.trigger} locale={locale} copy={copy} onClose={() => setOpened(null)} />}</GalleryContext.Provider>;
}

function GalleryDialog({ entries, initialIndex, trigger, locale, copy, onClose }: { entries: Entry[]; initialIndex: number; trigger: HTMLAnchorElement; locale: Locale; copy: Dictionary["work"]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const id = useId();
  const [index, setIndex] = useState(initialIndex);
  const reduced = useReducedMotion();
  const entry = entries[index];
  const changeImage = (step: number) => setIndex((current) => (current + step + entries.length) % entries.length);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => (current + (event.key === "ArrowRight" ? 1 : -1) + entries.length) % entries.length);
      }
      if (event.key === "Tab") {
        const focusable = element.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], video[controls]');
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    element.addEventListener("keydown", keyboard);
    return () => {
      element.removeEventListener("keydown", keyboard);
      element.close();
      document.body.style.overflow = previousOverflow;
      trigger.focus({ preventScroll: true });
    };
  }, [entries.length, trigger]);

  useEffect(() => {
    const rail = thumbnails.current;
    const thumb = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    const left = thumb.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
    rail.scrollTo({ left: left - (rail.clientWidth - thumb.clientWidth) / 2, behavior: reduced ? "instant" : "smooth" });
  }, [index, reduced]);

  return createPortal(<dialog ref={dialog} className="project-gallery-dialog" aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="gallery-dialog-header"><div aria-live="polite"><h2 id={`${id}-title`}>{entry.project.title}</h2>{entry.project.owner && <p className="project-owner micro-label">{copy.collaboration} · {entry.project.owner}</p>}</div><button type="button" className="gallery-close" onClick={onClose} aria-label={copy.closeGallery}>×</button></div>
    <motion.figure key={index} className="gallery-stage" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
      <ProjectMedia media={entry.media} locale={locale} sizes="100vw" />
    </motion.figure>
    <div className="gallery-dialog-footer">
      <p className="gallery-caption" aria-live="polite" aria-atomic="true"><span>{index + 1} {copy.imageOf} {entries.length} · {entry.number + 1}/{entry.project.media.length}</span>{entry.media.alt[locale]}</p>
      <div className="gallery-controls"><button type="button" aria-label={copy.previousImage} onClick={() => changeImage(-1)}>←</button><button type="button" aria-label={copy.nextImage} onClick={() => changeImage(1)}>→</button></div>
    </div>
    <div ref={thumbnails} className="gallery-thumbnails" role="group" aria-label={copy.allImages}>{entries.map((item, itemIndex) => <button type="button" key={`${item.project.id}-${item.media.src}`} onClick={() => setIndex(itemIndex)}
      aria-label={`${item.project.title}: ${item.media.alt[locale]}`} aria-current={index === itemIndex ? "true" : undefined} title={item.project.title}>
      {item.media.type === "video" ? <span>{item.number + 1}</span> : <ProjectMedia media={item.media} locale={locale} sizes="110px" />}
      <span className="gallery-thumb-title">{item.project.title}</span>
    </button>)}</div>
  </dialog>, document.body);
}

export function ProjectGallery({ projectId, media, title, locale, copy }: { projectId: string; media: Media[]; title: string; locale: Locale; copy: Dictionary["work"] }) {
  const { open } = useProjectGallery();
  const cover = media[0];
  if (!cover) return null;
  return <div className="project-gallery">
    {cover.type === "video" && <ProjectMedia media={cover} locale={locale} />}
    <a className="project-gallery-trigger" href={cover.src} draggable={false} aria-label={`${copy.preview}: ${title}`} aria-haspopup="dialog" onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); open(projectId, event.currentTarget);
    }}>
      {cover.type !== "video" && <ProjectMedia media={cover} locale={locale} />}
      <span className="project-gallery-hint"><span>{copy.preview}</span><span>{String(media.length).padStart(2, "0")} ↗</span></span>
    </a>
  </div>;
}
