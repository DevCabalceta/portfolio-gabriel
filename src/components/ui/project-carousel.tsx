"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProjectCarousel({ children, copy }: { children: ReactNode; copy: Dictionary["work"] }) {
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState({ first: 1, last: 3, count: 11, atStart: true, atEnd: false });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const bounds = element.getBoundingClientRect();
      const items = Array.from(element.children);
      const visible = items.map((item, index) => ({ index, box: item.getBoundingClientRect() }))
        .filter(({ box }) => box.left < bounds.right - 4 && box.right > bounds.left + 4);
      setRange({ first: (visible[0]?.index ?? 0) + 1, last: (visible.at(-1)?.index ?? 0) + 1, count: items.length,
        atStart: element.scrollLeft < 2, atEnd: element.scrollLeft >= element.scrollWidth - element.clientWidth - 2 });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    setReady(true);
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);

  const goTo = (index: number) => {
    const element = track.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (!element || !card) return;
    const left = card.getBoundingClientRect().left - element.getBoundingClientRect().left + element.scrollLeft;
    element.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const nearest = Array.from(element.children).reduce((best, item, index, items) =>
      Math.abs(item.getBoundingClientRect().left - element.getBoundingClientRect().left) < Math.abs(items[best].getBoundingClientRect().left - element.getBoundingClientRect().left) ? index : best, 0);
    goTo(Math.max(0, Math.min(element.children.length - 1, nearest + direction)));
  };

  return <div id="selected-projects" className="project-carousel" role="region" aria-label={copy.selected} aria-roledescription={copy.carousel} data-enhanced={ready}>
    <div className="carousel-toolbar">
      <p className="micro-label carousel-instruction">{copy.browse}</p>
      <div className="carousel-navigation">
        <span className="carousel-position micro-label" aria-live="polite" aria-atomic="true">{String(range.first).padStart(2, "0")}–{String(range.last).padStart(2, "0")} / {String(range.count).padStart(2, "0")}</span>
        <button type="button" aria-label={copy.previousProject} aria-controls="project-track" disabled={range.atStart} onClick={() => move(-1)}>←</button>
        <button type="button" aria-label={copy.nextProject} aria-controls="project-track" disabled={range.atEnd} onClick={() => move(1)}>→</button>
      </div>
    </div>
    <div ref={track} id="project-track" className="selected-projects" tabIndex={0} aria-label={copy.selected} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); goTo(event.key === "Home" ? 0 : range.count - 1); }
    }}>{children}</div>
  </div>;
}
