"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectMedia as Media } from "@/types/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProjectMedia } from "./project-media";

type Props = { media: Media[]; title: string; locale: Locale; copy: Dictionary["work"] };

function GalleryDialog({ media, title, locale, copy, id, trigger, onClose }: Props & { id: string; trigger: RefObject<HTMLAnchorElement | null>; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const changeImage = (step: number) => setIndex((current) => (current + step + media.length) % media.length);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => (current + (event.key === "ArrowRight" ? 1 : -1) + media.length) % media.length);
      }
      if (event.key === "Tab") {
        const focusable = element.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], video[controls]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    element.addEventListener("keydown", keyboard);
    return () => {
      element.removeEventListener("keydown", keyboard);
      element.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [media.length, trigger]);

  return createPortal(
    <dialog ref={dialog} id={id} className="project-gallery-dialog" aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="gallery-dialog-header"><h2 id={`${id}-title`}>{title}</h2><button type="button" className="gallery-close" onClick={onClose} aria-label={copy.closeGallery}>×</button></div>
      <motion.figure key={index} className="gallery-stage" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
        <ProjectMedia media={media[index]} locale={locale} sizes="100vw" />
      </motion.figure>
      <div className="gallery-dialog-footer">
        <p className="gallery-caption" aria-live="polite" aria-atomic="true"><span>{index + 1} {copy.imageOf} {media.length}</span>{media[index].alt[locale]}</p>
        {media.length > 1 && <div className="gallery-controls"><button type="button" aria-label={copy.previousImage} onClick={() => changeImage(-1)}>←</button><button type="button" aria-label={copy.nextImage} onClick={() => changeImage(1)}>→</button></div>}
      </div>
      {media.length > 1 && <div className="gallery-thumbnails">{media.map((item, itemIndex) => <button type="button" key={item.src} onClick={() => setIndex(itemIndex)} aria-label={`${itemIndex + 1}: ${item.alt[locale]}`} aria-current={index === itemIndex ? "true" : undefined}>
        {item.type === "video" ? <span>{itemIndex + 1}</span> : <ProjectMedia media={item} locale={locale} sizes="80px" />}
      </button>)}</div>}
    </dialog>, document.body,
  );
}

export function ProjectGallery({ media, title, locale, copy }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLAnchorElement>(null);
  const id = useId();
  const cover = media[0];
  if (!cover) return null;
  return <div className="project-gallery">
    {cover.type === "video" && <ProjectMedia media={cover} locale={locale} />}
    <a ref={trigger} className="project-gallery-trigger" href={cover.src} aria-label={`${copy.preview}: ${title}`} aria-haspopup="dialog" aria-controls={open ? id : undefined} onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); setOpen(true);
    }}>
      {cover.type !== "video" && <ProjectMedia media={cover} locale={locale} />}
      <span className="project-gallery-hint"><span>{copy.preview}</span><span>{String(media.length).padStart(2, "0")} ↗</span></span>
    </a>
    {open && <GalleryDialog media={media} title={title} locale={locale} copy={copy} id={id} trigger={trigger} onClose={() => setOpen(false)} />}
  </div>;
}
