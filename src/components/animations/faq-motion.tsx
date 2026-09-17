"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function FaqMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const servicesMotion = document.querySelector<HTMLElement>(".services-motion");
      const services = document.querySelector<HTMLElement>(".services");
      const cleanupTransition = servicesMotion && services ? createCinematicSectionTransition({
        incoming: element,
        outgoing: services,
        desktop,
        pin: { trigger: servicesMotion, target: servicesMotion },
        restingTarget: services,
      }) : undefined;
      const timelines: gsap.core.Timeline[] = [];
      const intro = element.querySelector<HTMLElement>(".faq-intro");
      if (intro) timelines.push(createCinematicReveal({
        trigger: intro,
        start: "top 84%",
        steps: [
          { targets: intro.querySelector("[data-faq-intro='eyebrow']")!, from: { opacity: 0, x: -24, filter: "blur(3px)" }, to: { duration: 0.5 } },
          { targets: intro.querySelectorAll("[data-faq-intro='title']"), from: { yPercent: 112, rotate: 2, opacity: 0 }, to: { duration: 0.88, stagger: 0.12 }, at: 0.1 },
          { targets: intro.querySelector("[data-faq-intro='description']")!, from: { opacity: 0, y: 26, filter: "blur(6px)" }, to: { duration: 0.7 }, at: 0.37 },
          { targets: intro.querySelector("[data-faq-intro='contact']")!, from: { opacity: 0, x: -20, clipPath: "inset(0% 100% 0% 0%)" }, to: { duration: 0.68 }, at: 0.56 },
        ],
      }));
      element.querySelectorAll<HTMLElement>(".faq-item").forEach((item, index) => {
        timelines.push(createCinematicReveal({
          trigger: item,
          start: "top 88%",
          steps: [
            { targets: item, from: { opacity: 0, y: 34, filter: "blur(5px)" }, to: { duration: 0.7, delay: index === 0 ? 0.22 : 0 } },
            { targets: item.querySelector(".faq-question-number")!, from: { opacity: 0, x: -14 }, to: { duration: 0.45 }, at: 0.15 },
            { targets: item.querySelector(".faq-question-toggle")!, from: { opacity: 0, scale: 0.55, rotate: -90 }, to: { duration: 0.55 }, at: 0.31 },
          ],
        }));
      });
      element.dataset.motion = "true";
      ScrollTrigger.refresh();
      return () => {
        cleanupTransition?.();
        timelines.forEach(killCinematicReveal);
        delete element.dataset.motion;
      };
    }, element);
    return () => media.revert();
  }, []);

  return <div ref={root} className="faq-motion">{children}</div>;
}
