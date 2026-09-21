import { gsap, ScrollTrigger, setupGsap } from "./gsap-runtime";

type CinematicSectionTransitionOptions = {
  incoming: HTMLElement;
  outgoing: HTMLElement;
  desktop: boolean;
  pin?: { trigger: HTMLElement; target: HTMLElement };
  safeViewportStart?: boolean;
  restingTarget?: HTMLElement;
  inertTarget?: HTMLElement;
};

/**
 * Shared depth transition for every chapter boundary. The incoming chapter
 * always rises in normal document flow while the outgoing frame recedes,
 * softens and becomes non-interactive. New sections should use this helper
 * instead of creating an independent transition.
 */
export function createCinematicSectionTransition({
  incoming,
  outgoing,
  desktop,
  pin,
  safeViewportStart = false,
  restingTarget = outgoing,
  inertTarget = outgoing,
}: CinematicSectionTransitionOptions) {
  setupGsap();
  incoming.dataset.sectionTransition = "cinematic";
  outgoing.classList.add("cinematic-outgoing");
  let pinTrigger: ScrollTrigger | undefined;
  if (pin) {
    pinTrigger = ScrollTrigger.create({
      trigger: pin.trigger,
      pin: pin.target,
      pinSpacing: false,
      start: "bottom bottom",
      endTrigger: incoming,
      end: "top top",
      invalidateOnRefresh: true,
      anticipatePin: 1,
      refreshPriority: 2,
    });
  }

  const start = safeViewportStart
    ? () => Math.max(0, incoming.getBoundingClientRect().top + window.scrollY - window.innerHeight)
    : "top bottom";
  let previousResting: boolean | undefined;
  let previousInert: boolean | undefined;
  const sync = (self: ScrollTrigger) => {
    const resting = self.progress <= 0.001;
    const inert = self.progress >= 0.98;
    if (resting !== previousResting) {
      restingTarget.dataset.transitionResting = String(resting);
      previousResting = resting;
    }
    if (inert !== previousInert) {
      inertTarget.inert = inert;
      previousInert = inert;
    }
  };

  const animation = gsap.fromTo(outgoing,
    { scale: 1, opacity: 1, filter: "blur(0px)" },
    {
      scale: desktop ? 0.9 : 0.965,
      opacity: 0.1,
      filter: `blur(${desktop ? 5 : 2.5}px)`,
      force3D: true,
      ease: "none",
      scrollTrigger: {
        trigger: incoming,
        start,
        end: "top top",
        scrub: desktop ? 0.45 : 0.3,
        invalidateOnRefresh: true,
        onUpdate: sync,
        onRefresh: sync,
        onEnter: () => { outgoing.style.willChange = "transform, opacity, filter"; },
        onEnterBack: () => { outgoing.style.willChange = "transform, opacity, filter"; },
        onLeave: () => { outgoing.style.willChange = "auto"; },
        onLeaveBack: () => { outgoing.style.willChange = "auto"; },
      },
    });

  return () => {
    animation.scrollTrigger?.kill();
    animation.kill();
    pinTrigger?.kill();
    inertTarget.inert = false;
    delete incoming.dataset.sectionTransition;
    outgoing.classList.remove("cinematic-outgoing");
    delete restingTarget.dataset.transitionResting;
    gsap.set(outgoing, { clearProps: "transform,opacity,filter,willChange" });
  };
}
