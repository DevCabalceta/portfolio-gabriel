import { gsap } from "gsap";

type RevealStep = {
  targets: gsap.TweenTarget;
  from: gsap.TweenVars;
  to?: gsap.TweenVars;
  at?: gsap.Position;
};

type CinematicRevealOptions = {
  trigger: Element;
  steps: RevealStep[];
  start?: string;
  once?: boolean;
};

/**
 * Shared viewport reveal used by chapter intros and closing statements.
 * Each sequence keeps the same easing and blur-to-focus rhythm while letting
 * a section choose its own masks, directions and timing.
 */
export function createCinematicReveal({
  trigger,
  steps,
  start = "top 84%",
  once = true,
}: CinematicRevealOptions) {
  const timeline = gsap.timeline({
    defaults: { duration: 0.78, ease: "power3.out" },
    scrollTrigger: {
      trigger,
      start,
      once,
      toggleActions: once ? "play none none none" : "play none none reverse",
    },
  });

  steps.forEach(({ targets, from, to, at }) => {
    timeline.fromTo(
      targets,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        ...to,
      },
      at,
    );
  });

  return timeline;
}

export function killCinematicReveal(timeline: gsap.core.Timeline | undefined) {
  timeline?.scrollTrigger?.kill();
  timeline?.kill();
}
