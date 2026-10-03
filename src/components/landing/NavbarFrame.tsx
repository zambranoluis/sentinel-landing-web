"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./Navbar.module.css";

export function NavbarFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = ref.current;
    if (!header) return;

    const root = document.documentElement;
    const measure = () => {
      root.style.setProperty(
        "--navbar-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header, { box: "border-box" });

    return () => {
      observer.disconnect();
      root.style.removeProperty("--navbar-height");
    };
  }, []);

  return (
    <header ref={ref} className={styles.header} id="top">
      {children}
    </header>
  );
}
