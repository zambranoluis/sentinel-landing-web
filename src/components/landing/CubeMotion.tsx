"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./CubeMotion.module.css";

export function CubeMotion({ children }: { children: ReactNode }) {
  const cube = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      if (preference.matches && document.activeElement === control.current) {
        cube.current
          ?.closest<HTMLElement>("section")
          ?.focus({ preventScroll: true });
      }
      setCanAnimate(!preference.matches);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    let intersecting = false;
    const updateVisibility = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisibility();
    });
    if (cube.current) observer.observe(cube.current);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <div
      className={styles.motion}
      data-running={canAnimate && visible && !paused}
    >
      <div ref={cube} className={styles.cube}>
        {children}
      </div>
      {canAnimate && (
        <button
          ref={control}
          className={styles.control}
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          {paused ? "Resume animation" : "Pause animation"}
        </button>
      )}
    </div>
  );
}
