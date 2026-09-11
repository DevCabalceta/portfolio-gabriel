"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";

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
      const cleanupTransition = createCinematicSectionTransition({
        incoming, outgoing: frame, desktop, safeViewportStart: true, restingTarget: element, inertTarget: outgoing,
      });

      // Reveal at the title itself, so the letters animate while they are readable.
      gsap.from(incoming.querySelectorAll("[data-about-char]"), {
        yPercent: 110, rotate: 7, opacity: 0, duration: 0.85, stagger: 0.045,
        ease: "power3.out",
        // These elements live inside the pin owned by ProjectsMotion. Account
        // for that offset, and keep revealed content visible on the return trip.
        scrollTrigger: { trigger: incoming.querySelector(".about-title"), pinnedContainer: ".about-pin", start: "top 82%", once: true },
      });
      incoming.querySelectorAll("[data-about-reveal]").forEach((item) => {
        gsap.from(item, {
          y: desktop ? 32 : 20, opacity: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: item, pinnedContainer: ".about-pin", start: "top 90%", once: true },
        });
      });

      return () => {
        cleanupTransition();
        delete element.dataset.motion;
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
