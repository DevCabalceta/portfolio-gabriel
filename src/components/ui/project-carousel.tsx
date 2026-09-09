"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import { useProjectGallery } from "./project-gallery";

export function ProjectCarousel({ children, titles, copy }: { children: ReactNode; titles: string[]; copy: Dictionary["work"] }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [viewport, api] = useEmblaCarousel({ loop: true, align: "start", duration: 30 });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const { isOpen } = useProjectGallery();
  const playing = Boolean(api && visible && !hidden && !hovered && !focused && !dragging && !paused && !reduced && !isOpen);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    update();
    api.on("select", update).on("reInit", update).on("pointerDown", down).on("pointerUp", up);
    return () => { api.off("select", update).off("reInit", update).off("pointerDown", down).off("pointerUp", up); };
  }, [api]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(element);
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!playing || !api) return;
    const timer = window.setInterval(() => api.scrollNext(), 3000);
    return () => window.clearInterval(timer);
  }, [api, playing]);

  return <div ref={root} id="selected-projects" className="project-carousel" role="region" aria-label={copy.selected} aria-roledescription={copy.carousel}
    data-enhanced={Boolean(api)} data-selected={selected} data-playing={playing} data-dragging={dragging}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="carousel-toolbar">
      <p className="micro-label carousel-instruction">{copy.drag}</p>
      <div className="carousel-navigation">
        <span className="carousel-position micro-label" aria-live={playing ? "off" : "polite"} aria-atomic="true">{String(selected + 1).padStart(2, "0")} / {String(titles.length).padStart(2, "0")}</span>
        <button type="button" aria-label={copy.previousProject} aria-controls="project-track" onClick={() => api?.scrollPrev(Boolean(reduced))}>←</button>
        <button type="button" aria-label={copy.nextProject} aria-controls="project-track" onClick={() => api?.scrollNext(Boolean(reduced))}>→</button>
      </div>
    </div>
    <div ref={viewport} className="carousel-viewport" tabIndex={0} aria-label={copy.selected} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); if (event.key === "ArrowRight") api?.scrollNext(Boolean(reduced)); else api?.scrollPrev(Boolean(reduced)); }
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); api?.scrollTo(event.key === "Home" ? 0 : titles.length - 1, Boolean(reduced)); }
    }}><div id="project-track" className="selected-projects">{children}</div></div>
    <div className="carousel-footer">
      <div className="carousel-dots" role="group" aria-label={copy.selected}>{titles.map((title, index) => <button type="button" key={title}
        aria-label={`${copy.goToProject}: ${title}`} aria-current={selected === index ? "true" : undefined} aria-controls="project-track"
        onClick={() => api?.scrollTo(index, Boolean(reduced))}><span /></button>)}</div>
      <button type="button" className="carousel-play" onClick={() => setPaused((value) => !value)} aria-label={paused ? copy.playCarousel : copy.pauseCarousel} aria-pressed={paused}>{paused ? "▷" : "Ⅱ"}</button>
    </div>
  </div>;
}
