"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function GalleryPlayback({ children, pauseLabel, playLabel }: {
  children: ReactNode;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    if (!element) return;
    element.dataset.ready = "true";
    let inView = true;
    const syncPlayback = () => { element.dataset.inactive = String(document.hidden || !inView); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      delete element.dataset.ready;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <div className="hero-gallery" data-paused={paused}>
      <div ref={layer} className="gallery-layer" aria-hidden="true">{children}</div>
      <button type="button" className="gallery-toggle" onClick={() => setPaused(!paused)}
        aria-label={paused ? playLabel : pauseLabel} title={paused ? playLabel : pauseLabel}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          {paused ? <path d="m5 3 8 5-8 5Z" /> : <path d="M4 3h3v10H4zM10 3h3v10h-3z" />}
        </svg>
      </button>
    </div>
  );
}
