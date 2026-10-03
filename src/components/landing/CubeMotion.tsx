"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./CubeMotion.module.css";

export function CubeMotion({ children }: { children: ReactNode }) {
  const cube = useRef<HTMLDivElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setCanAnimate(!preference.matches);
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
    <div className={styles.motion} data-running={canAnimate && visible}>
      <div ref={cube} className={styles.cube}>
        {children}
      </div>
    </div>
  );
}
