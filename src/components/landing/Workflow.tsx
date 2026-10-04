"use client";

import { type ReactNode } from "react";
import styles from "./HowItWorks.module.css";
import { useWorkflow } from "./useWorkflow";

type StepId = "observe" | "interpret" | "flag" | "review" | "respond";
type Step = { name: string; position: StepId; path: string };
// Identity maps each clockwise slot to its original geometry. Paths start
// beside the cube and trace outward to the destination tile.
const connectors = {
  observe: {
    path: "M410 265V180",
    dots: [
      [410, 265],
      [410, 180],
    ],
  },
  interpret: {
    path: "M526 355 620 335",
    dots: [
      [526, 355],
      [620, 335],
    ],
  },
  flag: {
    path: "M483 462 530 514",
    dots: [
      [483, 462],
      [530, 514],
    ],
  },
  review: {
    path: "M335 462 290 514",
    dots: [
      [335, 462],
      [290, 514],
    ],
  },
  respond: {
    path: "M294 355 200 335",
    dots: [
      [294, 355],
      [200, 335],
    ],
  },
} satisfies Record<StepId, { path: string; dots: number[][] }>;

function createEffects(
  element: HTMLDivElement,
  stage: number,
  mobile: boolean,
  enabled: boolean,
  arrived: boolean,
) {
  const rows = element.querySelectorAll<HTMLElement>("li");
  const current = rows[stage];
  const next = rows[(stage + 1) % rows.length];
  const identity = current.dataset.step as StepId;
  const destination = next.dataset.step as StepId;
  const rail = element.querySelector<HTMLElement>("[data-rail-accent]")!;
  const position = (row: HTMLElement) =>
    row.offsetTop + row.offsetHeight / 2 - 12;
  rail.style.transform = `translateY(${position(current)}px)`;
  const effects: Animation[] = [];
  if (!enabled) return effects;
  const duration = mobile ? 1200 : 2400;
  const animate = (target: Element, frames: Keyframe[], id: string) => {
    const animation = target.animate(frames, { duration, fill: "both" });
    animation.id = `workflow-${id}`;
    effects.push(animation);
  };
  if (mobile) {
    animate(
      rail,
      [
        { transform: `translateY(${position(current)}px)`, offset: 0 },
        {
          transform: `translateY(${position(current)}px)`,
          offset: 500 / duration,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
        },
        { transform: `translateY(${position(next)}px)`, offset: 1 },
      ],
      "rail",
    );
  } else {
    const hold = 1700 / duration;
    const sweepEnd = 2050 / duration;
    const angle = (step: StepId) => {
      const [x, y] = connectors[step].dots[1];
      const degrees = (Math.atan2(y - 357, x - 410) * 180) / Math.PI;
      return degrees < -90 ? degrees + 360 : degrees;
    };
    const from = angle(identity);
    const to = angle(destination) + (destination === "observe" ? 360 : 0);
    element.querySelectorAll("[data-ring-accent]").forEach((ring) => {
      animate(
        ring,
        [
          { strokeDashoffset: `${-from / 360}`, opacity: 0, offset: 0 },
          { strokeDashoffset: `${-from / 360}`, opacity: 0, offset: hold },
          { strokeDashoffset: `${-from / 360}`, opacity: 0.8, offset: hold },
          { strokeDashoffset: `${-to / 360}`, opacity: 0.8, offset: sweepEnd },
          { strokeDashoffset: `${-to / 360}`, opacity: 0, offset: sweepEnd },
          { strokeDashoffset: `${-to / 360}`, opacity: 0, offset: 1 },
        ],
        "ring",
      );
    });
    animate(
      element.querySelector(`[data-trace="${destination}"]`)!,
      [
        { strokeDashoffset: "1", opacity: 0, offset: 0 },
        { strokeDashoffset: "1", opacity: 0, offset: sweepEnd },
        { strokeDashoffset: "1", opacity: 1, offset: sweepEnd },
        { strokeDashoffset: "0", opacity: 1, offset: 1 },
      ],
      `trace-${destination}`,
    );
  }
  // Arrival feedback starts only once the connector/rail reaches the tile
  // and the authoritative clock advances to it.
  if (arrived) {
    const pulse = (target: Element, scale: number) =>
      animate(
        target,
        [
          { transform: "scale(1)", offset: 0 },
          { transform: `scale(${scale})`, offset: 100 / duration },
          { transform: "scale(1)", offset: 200 / duration },
          { transform: "scale(1)", offset: 1 },
        ],
        `arrival-${identity}`,
      );
    pulse(current.querySelector(`.${styles.icon}`)!, 1.08);
    if (!mobile)
      pulse(element.querySelector(`[data-endpoint="${identity}"]`)!, 1.65);
  }
  return effects;
}

export function Workflow({
  children,
  steps,
}: {
  children: ReactNode;
  steps: readonly Step[];
}) {
  const { root, state, dispatch, automatic, interaction } =
    useWorkflow(createEffects);

  return (
    <div
      ref={root}
      className={styles.workflow}
      data-motion="unit"
      data-workflow=""
      data-active-step={
        state.enhanced ? steps[state.stage].position : undefined
      }
      data-interaction-step={
        interaction !== null ? steps[interaction].position : undefined
      }
      data-sequence-running={automatic}
      data-immediate={state.focus !== null || state.reduced}
    >
      <div className={styles.diagram}>
        <svg
          className={styles.connections}
          viewBox="0 0 820 690"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="none" stroke="currentColor">
            {[140, 205, 255].map((radius) => (
              <circle key={radius} cx="410" cy="357" r={radius} />
            ))}
          </g>
          {steps.map((step, index) => {
            const connector = connectors[step.position];
            return (
              <g key={step.position} className={styles.connectors}>
                <path
                  d={connector.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  data-trace={step.position}
                  d={connector.path}
                  pathLength="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={styles.trace}
                  data-active={state.enhanced && state.stage === index}
                />
                {connector.dots.map(([cx, cy], dot) => (
                  <circle
                    key={`${cx}-${cy}`}
                    data-dot={step.position}
                    data-endpoint={dot === 1 ? step.position : undefined}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="currentColor"
                    className={styles.dot}
                  />
                ))}
              </g>
            );
          })}
          <g
            className={styles.ringAccents}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {[140, 205, 255].map((radius) => (
              <circle
                key={radius}
                data-ring-accent=""
                cx="410"
                cy="357"
                r={radius}
                pathLength="1"
              />
            ))}
          </g>
        </svg>
        {children}
        <div className={styles.stepsFrame}>
          <span
            className={styles.railAccent}
            data-rail-accent=""
            aria-hidden="true"
          />
          <ol className={styles.steps} aria-label="How Sentinel works">
            {steps.map((step, index) => {
              const content = (
                <>
                  <span className={styles.icon} aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      focusable="false"
                    >
                      <path d={step.path} />
                    </svg>
                  </span>
                  <span>{step.name}</span>
                </>
              );
              return (
                <li
                  key={step.position}
                  className={`${styles.step} ${styles[step.position]}`}
                  data-step={step.position}
                  data-active={state.enhanced && index === state.stage}
                  data-emphasized={
                    index === interaction || index === state.pressed
                  }
                >
                  {state.enhanced ? (
                    <button
                      type="button"
                      className={styles.stepControl}
                      onPointerEnter={(event) => {
                        if (
                          event.pointerType === "mouse" &&
                          matchMedia("(hover: hover) and (pointer: fine)")
                            .matches
                        )
                          dispatch({ type: "emphasis", owner: "hover", index });
                      }}
                      onPointerLeave={() =>
                        dispatch({
                          type: "emphasis",
                          owner: "hover",
                          index: null,
                        })
                      }
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible"))
                          dispatch({ type: "emphasis", owner: "focus", index });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: "emphasis",
                          owner: "focus",
                          index: null,
                        })
                      }
                      onClick={() =>
                        dispatch({
                          type: "press",
                          index,
                        })
                      }
                    >
                      {content}
                    </button>
                  ) : (
                    <span className={styles.stepControl}>{content}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div className={styles.playback}>
        {state.enhanced && (
          <button
            type="button"
            className={styles.playbackControl}
            disabled={state.reduced}
            title={
              state.reduced
                ? "Sequence motion is disabled by your reduced motion preference"
                : undefined
            }
            onClick={() => dispatch({ type: "playback" })}
          >
            {state.paused || state.reduced
              ? "Resume sequence"
              : "Pause sequence"}
          </button>
        )}
      </div>
    </div>
  );
}
