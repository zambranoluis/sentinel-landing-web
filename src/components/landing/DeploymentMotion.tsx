"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function DeploymentMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const finish = () => animations.forEach((animation) => animation.finish());
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || preference.matches) return;
        element.querySelectorAll("li").forEach((item, index) => {
          animations.push(
            item.animate(
              [
                { transform: "translateY(20px)", opacity: 0.65 },
                { transform: "translateY(0)", opacity: 1 },
              ],
              {
                duration: 650,
                delay: index * 100,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              },
            ),
          );
        });
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    preference.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", finish);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
