"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, setupGsap, scheduleScrollRefresh } from "./gsap-runtime";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { mountMotionWhenNear } from "./deferred-motion";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function ProjectsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return mountMotionWhenNear(element, () => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const about = document.querySelector<HTMLElement>(".about-frame");
      const aboutSection = document.querySelector<HTMLElement>("#about");
      const aboutPin = document.querySelector<HTMLElement>(".about-pin");
      const cleanupTransition = about && aboutSection && aboutPin
        ? createCinematicSectionTransition({ incoming: element, outgoing: about, desktop, pin: { trigger: aboutSection, target: aboutPin }, restingTarget: about })
        : undefined;
      const revealTimelines: gsap.core.Timeline[] = [];
      const intro = element.querySelector<HTMLElement>(".work-intro");
      if (intro) revealTimelines.push(createCinematicReveal({
        trigger: intro,
        start: "top 84%",
        steps: [
          { targets: intro.querySelector(".work-topline")!, from: { opacity: 0, x: -24 }, to: { duration: 0.5 } },
          { targets: intro.querySelectorAll("[data-work-char]"), from: { yPercent: 110, opacity: 0, rotate: 5 }, to: { duration: 0.9, stagger: 0.045 }, at: 0.1 },
          { targets: intro.querySelector(".work-introduction")!, from: { y: desktop ? 32 : 18, opacity: 0 }, to: { duration: 0.8 }, at: 0.52 },
        ],
      }));
      const footer = element.querySelector<HTMLElement>(".work-footer");
      if (footer) revealTimelines.push(createCinematicReveal({
        trigger: footer,
        start: "top 94%",
        steps: [{ targets: footer, from: { y: desktop ? 32 : 18, opacity: 0 }, to: { duration: 0.8 } }],
      }));
      gsap.from(element.querySelector(".project-carousel"), { y: 48, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: element.querySelector(".project-carousel"), start: "top 92%", once: true },
      });
      scheduleScrollRefresh();
      // Embla owns the track/slide transforms; animate their inner content only.
      gsap.from(element.querySelectorAll(".project-composition"), { y: 32, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: element.querySelector(".carousel-viewport"), start: "top 88%", once: true },
      });
      return () => {
        cleanupTransition?.();
        revealTimelines.forEach(killCinematicReveal);
      };
    }, element);
    const refresh = () => scheduleScrollRefresh();
    element.addEventListener("toggle", refresh, true);
    return () => {
      element.removeEventListener("toggle", refresh, true);
      media.revert();
    };
    });
  }, []);
  return <div ref={root} className="projects-motion">{children}</div>;
}
