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
  const reduced = useRef(false);
  const stillFrameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => () => {
    if (stillFrameTimer.current) clearTimeout(stillFrameTimer.current);
  }, []);

  const syncPlayback = useCallback(() => {
    const app = application.current;
    if (!app) return;
    const about = document.getElementById("about");
    const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const covered = about ? about.getBoundingClientRect().top <= anchorOffset : false;
    const shouldPause = reduced.current || !active.current || document.hidden || covered;
    if (root.current) root.current.dataset.playback = shouldPause ? "paused" : "running";
    if (shouldPause && !app.isStopped) app.stop();
    else if (!shouldPause && app.isStopped) app.play();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { reduced.current = preference.matches; syncPlayback(); };
    updatePreference();
    const observer = new IntersectionObserver(([entry]) => { active.current = entry.isIntersecting; syncPlayback(); }, { threshold: 0 });
    const hero = root.current?.closest(".hero");
    if (hero) observer.observe(hero);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("scroll", syncPlayback, { passive: true });
    syncPlayback();
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("scroll", syncPlayback);
    };
  }, [syncPlayback]);

  const onLoad = useCallback((app: Application) => {
    // This scene starts with the robot outside the camera. Let that introduction
    // finish behind the loader before revealing a static reduced-motion frame.
    const onRendered = () => {
      app.removeEventListener("rendered", onRendered);
      const reveal = () => {
        application.current = app;
        setReady(true);
        syncPlayback();
      };
      if (reduced.current) stillFrameTimer.current = setTimeout(reveal, 2500);
      else reveal();
    };
    app.addEventListener("rendered", onRendered);
    app.requestRender();
  }, [syncPlayback]);

  return (
    <div ref={root} className="hero-robot" data-ready={ready}>
      <div className="robot-glow" aria-hidden="true" />
      <SceneBoundary key={attempt} fallback={
        <div className="robot-status robot-error" role="status">
          <span>{copy.error}</span>
          <button type="button" onClick={() => { application.current = null; setReady(false); setAttempt((value) => value + 1); }}>{copy.retry}</button>
        </div>
      }>
        {!ready && <div className="robot-status" role="status"><span className="robot-loader" aria-hidden="true" /><span>{copy.loading}</span></div>}
        <Suspense fallback={null}>
          <Spline scene={scene} className="robot-scene" onLoad={onLoad} role="img" aria-label={copy.label} />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
