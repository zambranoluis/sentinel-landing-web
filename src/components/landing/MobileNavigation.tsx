"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Navbar.module.css";

export function MobileNavigation({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    // CSS can blur a hidden trigger before matchMedia dispatches its change.
    // Track focus ownership so the desktop handoff survives either ordering.
    let mobileOwnsFocus = false;
    const trackFocus = (event: FocusEvent) => {
      mobileOwnsFocus =
        event.target === trigger.current ||
        panel.current?.contains(event.target as Node) === true;
    };
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      if (
        mobileOwnsFocus ||
        panel.current?.contains(document.activeElement) ||
        document.activeElement === trigger.current
      ) {
        document
          .querySelector<HTMLAnchorElement>(
            "header a[aria-label='Sentinel home']",
          )
          ?.focus();
      }
      setOpen(false);
    };
    closeOnDesktop();
    document.addEventListener("focusin", trackFocus);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("focusin", trackFocus);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <div className={styles.mobile}>
      <button
        ref={trigger}
        className={styles.toggle}
        type="button"
        aria-label={open ? "Close menu" : "Menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={(event) => {
          event.currentTarget.focus();
          setOpen((current) => !current);
        }}
      >
        <span className={styles.icon} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </span>
      </button>
      <div
        ref={panel}
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        data-open={open}
        className={styles.panel}
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
            "a[href]",
          );
          if (!link?.hash) return;
          const target = document.getElementById(link.hash.slice(1));
          if (!target) return;
          setOpen(false);
          target.focus({ preventScroll: true });
        }}
      >
        {children}
      </div>
    </div>
  );
}
