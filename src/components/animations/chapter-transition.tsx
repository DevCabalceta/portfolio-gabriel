"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ChapterTransition({ id, previous, children }: { id: string; previous: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const outgoing = element.querySelector<HTMLElement>(".chapter-outgoing");
    const frame = element.querySelector<HTMLElement>(".chapter-frame");
    const incoming = element.querySelector<HTMLElement>("[data-chapter-incoming]");
    if (!outgoing || !frame || !incoming) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      element.dataset.motion = desktop ? "desktop" : "mobile";

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: incoming,
          start: "top bottom",
          end: "top top",
          scrub: desktop ? 0.5 : 0.25,
          invalidateOnRefresh: true,
          onUpdate: (self) => { outgoing.inert = self.progress >= 0.98; },
        },
      });
      timeline.fromTo(frame,
        { scale: 1, opacity: 1 },
        { scale: desktop ? 0.84 : 0.96, opacity: 0.08, ease: "none", duration: 1 }, 0);
      timeline.fromTo(incoming.querySelectorAll("[data-about-line]"),
        { yPercent: desktop ? 55 : 20, opacity: 0.3 },
        { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: "power2.out" }, 0.18);
      timeline.fromTo(incoming.querySelectorAll("[data-about-reveal]"),
        { y: desktop ? 38 : 16, opacity: 0.25 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.55, ease: "power2.out" }, 0.3);

      return () => {
        delete element.dataset.motion;
        outgoing.inert = false;
      };
    }, element);

    return () => media.revert();
  }, []);

  return (
    <div ref={root} id={id} className="chapter-transition" tabIndex={-1}>
      <div className="chapter-outgoing"><div className="chapter-frame">{previous}</div></div>
      {children}
    </div>
  );
}
