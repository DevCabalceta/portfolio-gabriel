"use client";

import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Application } from "@splinetool/runtime";
import type { Dictionary } from "@/i18n/dictionaries";

const Spline = lazy(() => import("@splinetool/react-spline"));
const scene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
type RobotCopy = Dictionary["hero"]["robot"];

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const desktopQuery = "(min-width: 900px)";
function subscribeDesktop(callback: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const getServerSnapshot = () => false;

export function HeroRobot({ copy }: { copy: RobotCopy }) {
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerSnapshot);
  return desktop ? <RobotScene copy={copy} /> : null;
}

function RobotScene({ copy }: { copy: RobotCopy }) {
  const root = useRef<HTMLDivElement>(null);
  const application = useRef<Application | null>(null);
  const active = useRef(true);
  const aboutCovered = useRef(false);
  const reduced = useRef(false);
  const stillFrameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element || interactive) return;
    let activationDelay: ReturnType<typeof setTimeout> | undefined;
    let idle = 0;
    let visible = false;
    const cancelScheduledLoad = () => {
      if (activationDelay) clearTimeout(activationDelay);
      activationDelay = undefined;
      if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      idle = 0;
    };
    const activate = () => { cancelScheduledLoad(); setInteractive(true); };
    const scheduleLoad = () => {
      cancelScheduledLoad();
      if (!visible || document.hidden) return;
      // Keep the initial interaction window free of the WebGL runtime. Pointer
      // interaction loads immediately; otherwise the scene starts later and
      // only if the Hero is still visible.
      activationDelay = setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(activate, { timeout: 2000 });
        else activate();
      }, 12000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) scheduleLoad(); else cancelScheduledLoad();
    }, { threshold: 0.2 });
    observer.observe(element);
    element.addEventListener("pointerenter", activate, { once: true, passive: true });
    element.addEventListener("focusin", activate, { once: true });
    return () => {
      observer.disconnect();
      cancelScheduledLoad();
      element.removeEventListener("pointerenter", activate);
      element.removeEventListener("focusin", activate);
    };
  }, [interactive]);

  useEffect(() => () => {
    if (stillFrameTimer.current) clearTimeout(stillFrameTimer.current);
  }, []);

  const syncPlayback = useCallback(() => {
    const app = application.current;
    if (!app) return;
    const shouldPause = reduced.current || !active.current || document.hidden || aboutCovered.current;
    if (root.current) root.current.dataset.playback = shouldPause ? "paused" : "running";
    if (shouldPause && !app.isStopped) app.stop();
    else if (!shouldPause && app.isStopped) app.play();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { reduced.current = preference.matches; syncPlayback(); };
    updatePreference();
    const observer = new IntersectionObserver(([entry]) => { active.current = entry.isIntersecting; syncPlayback(); }, { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    const aboutObserver = new IntersectionObserver(([entry]) => {
      aboutCovered.current = entry.isIntersecting || entry.boundingClientRect.top < 64;
      syncPlayback();
    }, { rootMargin: "-64px 0px -80% 0px", threshold: 0 });
    const about = document.getElementById("about");
    if (about) aboutObserver.observe(about);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      aboutObserver.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [syncPlayback]);

  const onLoad = useCallback((app: Application) => {
    // This scene starts with the robot outside the camera. Let that introduction
    // finish behind the loader before revealing a static reduced-motion frame.
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      app.removeEventListener("rendered", onRendered);
      if (stillFrameTimer.current) clearTimeout(stillFrameTimer.current);
      stillFrameTimer.current = null;
      application.current = app;
      setReady(true);
      syncPlayback();
    };
    const onRendered = () => {
      if (reduced.current) stillFrameTimer.current = setTimeout(reveal, 2500);
      else reveal();
    };
    app.addEventListener("rendered", onRendered);
    app.requestRender();
    // Some WebGL implementations do not emit another rendered event after
    // onLoad. Never leave the interface trapped behind the loader in that case.
    stillFrameTimer.current = setTimeout(reveal, reduced.current ? 4000 : 2200);
  }, [syncPlayback]);

  return (
    <div ref={root} className="hero-robot" data-ready={ready} data-interactive={interactive}>
      <div className="robot-glow" aria-hidden="true" />
      <SceneBoundary key={attempt} fallback={
        <div className="robot-status robot-error" role="status">
          <span>{copy.error}</span>
          <button type="button" onClick={() => { application.current = null; setReady(false); setAttempt((value) => value + 1); }}>{copy.retry}</button>
        </div>
      }>
        {!ready && <div className="robot-status" role="status"><span className="robot-loader" aria-hidden="true" /><span>{copy.loading}</span></div>}
        {interactive && <Suspense fallback={null}>
          <Spline scene={scene} className="robot-scene" onLoad={onLoad} role="img" aria-label={copy.label} />
        </Suspense>}
      </SceneBoundary>
    </div>
  );
}
