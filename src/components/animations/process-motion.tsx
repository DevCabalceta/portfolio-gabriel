"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function ProcessMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const story = element.querySelector<HTMLElement>(".process-story");
      const stage = element.querySelector<HTMLElement>(".process-stage");
      const workMotion = document.querySelector<HTMLElement>(".projects-motion");
      const work = document.querySelector<HTMLElement>(".work");
      if (!story || !stage) return;

      element.dataset.motion = "true";
      const cleanupTransition = workMotion && work
        ? createCinematicSectionTransition({
          incoming: element,
          outgoing: work,
          desktop,
          pin: { trigger: workMotion, target: workMotion },
          restingTarget: work,
        })
        : undefined;

      const steps = gsap.utils.toArray<HTMLElement>(".process-step", element);
      const firstStep = steps[0];
      const footer = element.querySelector<HTMLElement>(".process-footer");
      gsap.set(steps, { autoAlpha: 0, y: 70, scale: 0.96, filter: "blur(8px)" });
      gsap.set(firstStep, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: stage, start: "top 86%", once: true },
      });
      entrance
        .from(element.querySelector(".process-topline"), { opacity: 0, y: 14, duration: 0.55 })
        .from(element.querySelectorAll("[data-process-title]"), { yPercent: 115, rotate: 3, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.12)
        .from(element.querySelector(".process-cross"), { opacity: 0, scale: 0.3, rotate: -80, duration: 0.8 }, 0.34)
        .from(element.querySelector(".process-introduction"), { opacity: 0, y: 24, filter: "blur(4px)", duration: 0.65 }, 0.52)
        .from(element.querySelector(".process-contact"), { opacity: 0, scaleX: 0.8, transformOrigin: "left", duration: 0.58 }, 0.66)
        .from(element.querySelector(".process-note"), { opacity: 0, x: -12, duration: 0.5 }, 0.76)
        .from(firstStep.querySelector(".process-step-label"), { opacity: 0, x: 24, duration: 0.5 }, 0.42)
        .from(firstStep.querySelector("h3"), { yPercent: 115, duration: 0.8 }, 0.52)
        .from(firstStep.querySelector(".process-step-description"), { opacity: 0, y: 20, filter: "blur(5px)", duration: 0.65 }, 0.68)
        .from(firstStep.querySelector(".process-step-detail"), { opacity: 0, x: 16, duration: 0.48 }, 0.82)
        .from(element.querySelector(".process-meter"), { opacity: 0, scaleX: 0.75, transformOrigin: "left", duration: 0.7 }, 0.72);

      const sequence = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: desktop ? 0.85 : 0.55,
          invalidateOnRefresh: true,
        },
      });
      sequence.to(element.querySelector(".process-progress"), { scaleX: 1, ease: "none", duration: steps.length - 1 }, 0);
      sequence.to(element.querySelector(".process-orbit-outer"), { rotate: 190, scale: 1.08, ease: "none", duration: steps.length - 1 }, 0);
      sequence.to(element.querySelector(".process-orbit-inner"), { rotate: -260, scale: 0.86, ease: "none", duration: steps.length - 1 }, 0);
      sequence.to(element.querySelector(".process-watermark"), { xPercent: -16, ease: "none", duration: steps.length - 1 }, 0);
      sequence.to(element.querySelector(".process-intro"), { y: desktop ? -42 : -18, scale: desktop ? 0.96 : 0.985, opacity: desktop ? 0.58 : 0.42, ease: "none", duration: steps.length - 1 }, 0);

      for (let index = 0; index < steps.length - 1; index++) {
        const current = steps[index];
        const next = steps[index + 1];
        const at = index + 0.64;
        sequence
          .to(current, { autoAlpha: 0, y: -58, scale: 0.975, filter: "blur(9px)", duration: 0.3 }, at)
          .fromTo(next,
            { autoAlpha: 0, y: 78, scale: 0.955, filter: "blur(9px)" },
            { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.34 }, at + 0.04)
          .fromTo(next.querySelector(".process-step-label"), { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.2 }, at + 0.08)
          .fromTo(next.querySelector("h3"), { yPercent: 115 }, { yPercent: 0, duration: 0.3, ease: "power3.out" }, at + 0.12)
          .fromTo(next.querySelector(".process-step-description"), { opacity: 0, y: 24, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.26 }, at + 0.19)
          .fromTo(next.querySelector(".process-step-detail"), { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.2 }, at + 0.26);
      }

      const footerReveal = footer ? createCinematicReveal({
        trigger: footer,
        start: "top 78%",
        steps: [
          { targets: footer.querySelector("[data-process-closing='index']")!, from: { opacity: 0, x: -24 }, to: { duration: 0.5 } },
          { targets: footer.querySelectorAll("[data-process-closing='word']"), from: { yPercent: 118, rotate: 2, opacity: 0 }, to: { duration: 0.72, stagger: 0.055 }, at: 0.08 },
          { targets: footer.querySelector("[data-process-closing='detail']")!, from: { y: 24, opacity: 0, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" }, to: { duration: 0.68 }, at: 0.38 },
          { targets: footer.querySelector("[data-process-closing='cta']")!, from: { x: 30, opacity: 0, filter: "blur(4px)" }, to: { duration: 0.62 }, at: 0.55 },
        ],
      }) : undefined;

      ScrollTrigger.refresh();
      return () => {
        cleanupTransition?.();
        killCinematicReveal(footerReveal);
        delete element.dataset.motion;
        entrance.kill();
        sequence.kill();
        const animatedScenery = element.querySelectorAll(".process-intro, .process-orbit, .process-watermark, .process-progress");
        gsap.set([...steps, ...animatedScenery], { clearProps: "all" });
      };
    }, element);
    return () => media.revert();
  }, []);
  return <div ref={root} className="process-motion">{children}</div>;
}
