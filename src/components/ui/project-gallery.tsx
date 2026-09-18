"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
  const id = useId();
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const entry = entries[index];
  const changeImage = (step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + entries.length) % entries.length);
  };

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setDirection(event.key === "ArrowRight" ? 1 : -1);
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

  return createPortal(<dialog ref={dialog} className="project-gallery-dialog" aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <button type="button" className="gallery-close" onClick={onClose} aria-label={copy.closeGallery}>×</button>
    <div className="gallery-viewer">
      <button type="button" className="gallery-arrow gallery-previous" aria-label={copy.previousImage} onClick={() => changeImage(-1)}>←</button>
      <div className="gallery-content">
        <figure className="gallery-stage">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div key={index} className="gallery-image-frame" custom={direction}
              variants={{ enter: (step: number) => ({ opacity: 0, x: reduced ? 0 : step * 28, scale: reduced ? 1 : 0.98 }), visible: { opacity: 1, x: 0, scale: 1 }, exit: (step: number) => ({ opacity: 0, x: reduced ? 0 : step * -20, scale: reduced ? 1 : 0.99 }) }}
              initial="enter" animate="visible" exit="exit" transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}>
              {entry.media.type === "video" ? <ProjectMedia media={entry.media} locale={locale} /> : <Image src={entry.media.src} alt={entry.media.alt[locale]} width={1920} height={1080} sizes="(max-width: 699px) 95vw, 80vw" quality={85} unoptimized={entry.media.type === "gif"} />}
            </motion.div>
          </AnimatePresence>
          <figcaption className="gallery-caption" aria-live="polite" aria-atomic="true">
            {entry.project.owner && <p className="project-owner micro-label">{copy.collaboration} · {entry.project.owner}</p>}
            <h2 id={`${id}-title`}>{entry.project.title}</h2>
            <p className="gallery-description">{entry.media.alt[locale]}</p>
            <p className="gallery-counter">{index + 1} {copy.imageOf} {entries.length} · {entry.number + 1}/{entry.project.media.length}</p>
          </figcaption>
        </figure>
      </div>
      <button type="button" className="gallery-arrow gallery-next" aria-label={copy.nextImage} onClick={() => changeImage(1)}>→</button>
    </div>
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
