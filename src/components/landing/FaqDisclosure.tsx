"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import styles from "./Faq.module.css";

export function FaqDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDetailsElement>(null);
  const animation = useRef<Animation | null>(null);
  const expanded = useRef(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => animation.current?.finish();
    preference.addEventListener("change", finish);
    return () => {
      preference.removeEventListener("change", finish);
      animation.current?.cancel();
    };
  }, []);

  function toggle(event: MouseEvent<HTMLElement>) {
    const element = root.current;
    if (!element) return;
    event.preventDefault();
    const start = element.getBoundingClientRect().height;
    animation.current?.cancel();
    expanded.current = !expanded.current;
    element.dataset.expanded = String(expanded.current);
    element.open = true;
    const summary = element.querySelector("summary")!;
    const content = element.querySelector<HTMLDivElement>("[data-answer]")!;
    content.inert = !expanded.current;
    content.setAttribute("aria-hidden", String(!expanded.current));
    const finish = () => {
      element.open = expanded.current;
      animation.current = null;
    };
    if (
      event.detail === 0 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }
    const end = expanded.current
      ? summary.getBoundingClientRect().height +
        content.getBoundingClientRect().height +
        1
      : summary.getBoundingClientRect().height + 1;
    animation.current = element.animate(
      { height: [`${start}px`, `${end}px`] },
      { duration: 240, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    animation.current.onfinish = finish;
  }

  return (
    <details ref={root} className={styles.item}>
      <summary onClick={toggle}>
        {title}
        <span className={styles.plus} aria-hidden="true" />
      </summary>
      <div data-answer className={styles.answer}>
        {children}
      </div>
    </details>
  );
}
