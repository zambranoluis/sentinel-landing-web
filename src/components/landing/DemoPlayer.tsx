"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionIcon } from "./SectionIcon";
import common from "./Sections.module.css";
import styles from "./ProductDemo.module.css";

const steps = [
  { title: "The event is detected", detail: "Aisle 4 · LIVE" },
  { title: "Sentinel analyses", detail: "Clip + context + alert" },
  { title: "Review the event", detail: "Status: Review required" },
];

function exportReport() {
  const report = new Blob(
    [
      "SENTINEL — ILLUSTRATIVE DEMO REPORT\nSynthetic example only. Not an operational record.\n\nEvent: Potential concealment\nCamera: Aisle 4\nTime: 14:32:07\nStatus: Review required\nConfidence: 88%\n\nThis example demonstrates how context is presented for human review. No real detection, clip or alert was produced.\n",
    ],
    { type: "text/plain;charset=utf-8" },
  );
  const url = URL.createObjectURL(report);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sentinel-illustrative-demo.txt";
  link.click();
  // Download navigation consumes the URL before the next animation frame.
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

export function DemoPlayer() {
  const [step, setStep] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReduced(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        setReady(true);
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

  const active = playing && visible && documentVisible && !reduced;
  function togglePlayback() {
    if (reduced) {
      setStep((current) => (current === 2 ? 0 : current + 1));
      return;
    }
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === 2) setStep(0);
    setPlaying(true);
  }
  function selectStep(index: number) {
    setPlaying(false);
    setStep(index);
  }

  return (
    <div
      ref={root}
      className={styles.player}
      data-step={step}
      data-playing={active}
    >
      <div className={styles.controls}>
        <button
          type="button"
          className={common.button}
          disabled={!ready}
          onClick={togglePlayback}
        >
          <SectionIcon name={playing ? "pause" : "play"} />
          {reduced
            ? step === 2
              ? "Explore demo"
              : "Next demo step"
            : playing
              ? "Pause demo"
              : step === 2
                ? "Play demo"
                : "Resume demo"}
        </button>
        <p>Illustrative demo · not a live feed</p>
      </div>
      <div className={styles.experience}>
        <ol className={styles.steps} aria-label="Demo stages">
          {steps.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                aria-pressed={step === index}
                disabled={!ready}
                onClick={() => selectStep(index)}
                className={styles.step}
              >
                <span className={styles.number}>{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <span className={styles.stepDetail}>{item.detail}</span>
                </span>
              </button>
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
                <div className={styles.analysis}>
                  <SectionIcon name="layers" />
                  <strong>Analysing the detection</strong>
                  <span>Saving the clip and preparing the alert...</span>
                </div>
              )}
            </div>
            <div
              className={styles.details}
              aria-live="polite"
              aria-atomic="true"
            >
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
              <ul className={styles.evidence} data-complete={step === 2}>
                {[
                  "Clip saved",
                  "Screenshot available",
                  "Alert sent to configured recipients",
                ].map((label) => (
                  <li key={label}>
                    <SectionIcon name={step === 2 ? "check" : "document"} />
                    {label}
                  </li>
                ))}
              </ul>
              <p className={styles.exampleNote}>
                Example outcomes shown for demonstration.
              </p>
            </div>
          </div>
          <div className={styles.dashboardFooter}>
            <span>Human review remains central.</span>
            <button
              type="button"
              disabled={!ready || step !== 2}
              onClick={exportReport}
            >
              Export event report <SectionIcon name="arrow" />
            </button>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span
              key={step}
              style={{ animationPlayState: active ? "running" : "paused" }}
              onAnimationEnd={() => {
                if (step < 2) setStep((current) => current + 1);
                else setPlaying(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
