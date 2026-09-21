type MotionCleanup = void | (() => void);

export function mountMotionWhenNear(
  element: Element,
  setup: () => MotionCleanup,
  rootMargin = "150% 0px",
) {
  let cleanup: MotionCleanup;
  let disposed = false;
  let idleHandle = 0;
  let fallbackHandle: ReturnType<typeof setTimeout> | undefined;

  const cancelPendingSetup = () => {
    if (idleHandle && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
    if (fallbackHandle) clearTimeout(fallbackHandle);
    idleHandle = 0;
    fallbackHandle = undefined;
  };

  const runSetup = () => {
    idleHandle = 0;
    fallbackHandle = undefined;
    if (disposed) return;
    cleanup = setup();
  };

  const scheduleSetup = () => {
    // Building several ScrollTrigger timelines can require layout reads. Keep
    // that work out of an active wheel/touch frame and use the generous
    // prefetch margin to prepare the section before it becomes visible.
    if ("requestIdleCallback" in window) idleHandle = window.requestIdleCallback(runSetup);
    else fallbackHandle = setTimeout(runSetup, 80);
  };

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || disposed) return;
    observer.disconnect();
    scheduleSetup();
  }, { rootMargin, threshold: 0 });
  observer.observe(element);

  return () => {
    disposed = true;
    observer.disconnect();
    cancelPendingSetup();
    cleanup?.();
  };
}
