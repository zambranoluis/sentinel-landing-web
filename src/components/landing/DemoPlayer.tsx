"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionIcon } from "./SectionIcon";
import styles from "./ProductDemo.module.css";

const steps = [
  { title: "The event is detected", detail: "Aisle 4 · LIVE" },
  { title: "Sentinel analyses", detail: "Clip + context + alert" },
  { title: "Review the event", detail: "Status: Review required" },
];

type Phase = 0 | 1 | 2 | "hold" | "static";

export function DemoPlayer() {
  // Server rendering and reduced motion retain the complete review view.
  const [phase, setPhase] = useState<Phase>("static");
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPhase(preference.matches ? "static" : 0);
    };
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.1);
      },
      { threshold: 0.1 },
    );
    if (root.current) observer.observe(root.current);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const step = typeof phase === "number" ? phase : 2;
  const active = phase !== "static" && visible && documentVisible;

  return (
    <div
      ref={root}
      className={styles.player}
      data-motion="unit"
      data-step={step}
      data-phase={phase}
      data-playing={active}
    >
      <p className={styles.disclaimer}>Illustrative demo · not a live feed</p>
      <div className={styles.experience}>
        <ol className={styles.steps} aria-label="Demo stages">
          {steps.map((item, index) => (
            <li
              key={item.title}
              aria-current={step === index ? "step" : undefined}
            >
              <div className={styles.step}>
                <span className={styles.number}>{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <span className={styles.stepDetail}>{item.detail}</span>
                </span>
              </div>
              <div className={styles.stepPreview} aria-hidden="true">
                {index === 2 ? (
                  <SectionIcon name="document" />
                ) : (
                  <Image
                    src="/images/capabilities-retail.webp"
                    alt=""
                    width={1672}
                    height={941}
                    sizes="120px"
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.dashboard}>
          <div className={styles.dashboardHeader}>
            <span>
              <SectionIcon name="camera" /> Sentinel · Event review
            </span>
            <span className={styles.timestamp}>Aisle 4 · 14:32:07</span>
          </div>
          <div className={styles.workspace}>
            <div className={styles.feed}>
              <Image
                src="/images/capabilities-retail.webp"
                alt="Illustrative retail aisle used to explain event review"
                fill
                sizes="(max-width: 720px) 90vw, 45vw"
              />
              <span className={styles.feedLabel}>Aisle 4 · Example feed</span>
              <div className={styles.detection}>
                <span>Potential concealment · 88%</span>
              </div>
              <div className={styles.feedCaption}>
                Potential concealment event detected · 88%
              </div>
              {step === 1 && (
                <div
                  className={styles.analysis}
                  style={{ animationPlayState: active ? "running" : "paused" }}
                >
                  <SectionIcon name="layers" />
                  <strong>Analysing the detection</strong>
                  <span>Saving the clip and preparing the alert...</span>
                </div>
              )}
            </div>
            <div className={styles.details}>
              <h3>{steps[step].title}</h3>
              <dl>
                <div>
                  <dt>Event</dt>
                  <dd>Potential concealment</dd>
                </div>
                <div>
                  <dt>Camera</dt>
                  <dd>Aisle 4</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>14:32:07</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {step === 0
                      ? "Detected"
                      : step === 1
                        ? "Analysing"
                        : "Review required"}
                  </dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>88%</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span
              key={phase}
              style={{ animationPlayState: active ? "running" : "paused" }}
              onAnimationEnd={() => {
                setPhase((current) => {
                  if (current === "static") return current;
                  if (current === "hold") return 0;
                  if (current === 2) return "hold";
                  return current === 0 ? 1 : 2;
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
