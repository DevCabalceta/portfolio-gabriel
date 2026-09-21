"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, setupGsap, scheduleScrollRefresh } from "./gsap-runtime";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { mountMotionWhenNear } from "./deferred-motion";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function FooterMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return mountMotionWhenNear(element, () => {
      setupGsap();
      const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const contact = document.querySelector<HTMLElement>(".contact");
      const cleanupTransition = contact ? createCinematicSectionTransition({
        incoming: element,
        outgoing: contact,
        desktop: Boolean(context.conditions?.desktop),
        restingTarget: contact,
      }) : undefined;
      const timeline = createCinematicReveal({
        trigger: element,
        start: "top 84%",
        steps: [
          { targets: element.querySelector("[data-footer-reveal='top']")!, from: { opacity: 0, y: 18 }, to: { duration: 0.5 } },
          { targets: element.querySelector("[data-footer-reveal='pretitle']")!, from: { opacity: 0, x: -22, filter: "blur(4px)" }, to: { duration: 0.55 }, at: 0.15 },
          { targets: element.querySelectorAll("[data-footer-reveal='title']"), from: { opacity: 0, yPercent: 110, rotate: 2 }, to: { duration: 0.9, stagger: 0.14 }, at: 0.22 },
          { targets: element.querySelector("[data-footer-reveal='description']")!, from: { opacity: 0, y: 24, filter: "blur(6px)" }, to: { duration: 0.7 }, at: 0.65 },
          { targets: element.querySelectorAll("[data-footer-reveal='column']"), from: { opacity: 0, y: 28, clipPath: "inset(0% 0% 100% 0%)" }, to: { duration: 0.68, stagger: 0.09 }, at: 0.9 },
          { targets: element.querySelectorAll("[data-footer-reveal='link']"), from: { opacity: 0, x: -12, filter: "blur(3px)" }, to: { duration: 0.42, stagger: 0.035 }, at: 1.12 },
          { targets: element.querySelector("[data-footer-reveal='bottom']")!, from: { opacity: 0, y: 13 }, to: { duration: 0.48 }, at: 1.5 },
        ],
      });
      element.dataset.motion = "true";
      scheduleScrollRefresh();
      return () => {
        cleanupTransition?.();
        killCinematicReveal(timeline);
        delete element.dataset.motion;
      };
    }, element);
      return () => media.revert();
    });
  }, []);

  return <div ref={root} className="site-footer-motion">{children}</div>;
}
