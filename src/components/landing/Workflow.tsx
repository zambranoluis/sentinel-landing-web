"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HowItWorks.module.css";
import { useWorkflow } from "./useWorkflow";

type Step = { name: string; position: string; path: string };
const connectors = [
  {
    path: "M410 180V265",
    dots: [
      [410, 180],
      [410, 265],
    ],
  },
  {
    path: "M200 335 294 355",
    dots: [
      [200, 335],
      [294, 355],
    ],
  },
  {
    path: "M620 335 526 355",
    dots: [
      [620, 335],
      [526, 355],
    ],
  },
  {
    path: "M290 514 335 462",
    dots: [
      [290, 514],
      [335, 462],
    ],
  },
  {
    path: "M530 514 483 462",
    dots: [
      [530, 514],
      [483, 462],
    ],
  },
];

export function Workflow({
  children,
  steps,
}: {
  children: ReactNode;
  steps: readonly Step[];
}) {
  const { root, state, dispatch, active, automatic, running } = useWorkflow();
  const effects = useRef<Animation[]>([]);
  const railPose = useRef<number | null>(null);

  useEffect(() => {
    const element = root.current!;
    const rail = element.querySelector<HTMLElement>("[data-rail-accent]")!;
    const transform = getComputedStyle(rail).transform;
    // A click can follow a hover while the rail is still travelling. Continue
    // from its rendered pose, rather than restarting from the prior destination.
    const previousPosition =
      railPose.current ??
      (transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42);
    railPose.current = null;
    const cancel = () => {
      effects.current.forEach((animation) => animation.cancel());
      effects.current = [];
    };
    cancel();
    const row = element.querySelectorAll<HTMLElement>("li")[active];
    const position = row.offsetTop + row.offsetHeight / 2 - 12;
    rail.style.transform = `translateY(${position}px)`;
    if (state.enhanced && !state.reduced && state.spatial) {
      const animate = (target: Element, frames: Keyframe[], duration = 700) => {
        effects.current.push(
          target.animate(frames, {
            duration,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "backwards",
          }),
        );
      };
      if (matchMedia("(max-width: 720px)").matches) {
        animate(rail, [
          { transform: `translateY(${previousPosition}px)`, opacity: 0.35 },
          { transform: `translateY(${position}px)`, opacity: 1 },
        ]);
      } else {
        const trace = element.querySelector(`[data-trace="${active}"]`)!;
        animate(trace, [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }]);
        element
          .querySelectorAll(`[data-dot="${active}"]`)
          .forEach((dot) =>
            animate(dot, [
              { transform: "scale(1)" },
              { transform: "scale(1.65)", offset: 0.45 },
              { transform: "scale(1)" },
            ]),
          );
        element.querySelectorAll("[data-ring-accent]").forEach((ring, index) =>
          animate(ring, [
            { strokeDashoffset: `${-active * 0.2 + 0.08}`, opacity: 0 },
            { opacity: 0.8, offset: 0.4 },
            {
              strokeDashoffset: `${-active * 0.2 - 0.08 - index * 0.015}`,
              opacity: 0,
            },
          ]),
        );
      }
      animate(row.querySelector(`.${styles.icon}`)!, [
        { transform: "scale(1)" },
        { transform: "scale(1.08)", offset: 0.45 },
        { transform: "scale(1)" },
      ]);
    }
    // Resize cancels transient geometry before measuring the new rail. The
    // existing controls retain identity, selection and focus across breakpoints.
    const resize = () => {
      cancel();
      const position = row.offsetTop + row.offsetHeight / 2 - 12;
      rail.style.transform = `translateY(${position}px)`;
    };
    window.addEventListener("resize", resize);
    let width = element.clientWidth;
    let height = element.clientHeight;
    const observer = new ResizeObserver(() => {
      if (width === element.clientWidth && height === element.clientHeight)
        return;
      width = element.clientWidth;
      height = element.clientHeight;
      resize();
    });
    observer.observe(element);
    return () => {
      // React runs the old effect's cleanup before the new setup. Capture the
      // animated pose here, before cancellation exposes the inline destination.
      const transform = getComputedStyle(rail).transform;
      railPose.current =
        transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
      cancel();
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [
    active,
    state.revision,
    state.enhanced,
    state.reduced,
    state.spatial,
    root,
  ]);

  useEffect(() => {
    for (const animation of effects.current) {
      if (animation.playState === "finished") continue;
      if (running && !state.paused) animation.play();
      else animation.pause();
    }
  }, [
    active,
    state.revision,
    state.enhanced,
    state.reduced,
    state.spatial,
    running,
    state.paused,
  ]);

  return (
    <div
      ref={root}
      className={styles.workflow}
      data-motion="unit"
      data-workflow=""
      data-active-step={state.enhanced ? steps[active].position : undefined}
      data-sequence-running={automatic}
      data-immediate={!state.spatial}
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
          {connectors.map((connector, index) => (
            <g key={steps[index].position} className={styles.connectors}>
              <path
                d={connector.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                data-trace={index}
                d={connector.path}
                pathLength="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={styles.trace}
                data-active={state.enhanced && active === index}
              />
              {connector.dots.map(([cx, cy]) => (
                <circle
                  key={`${cx}-${cy}`}
                  data-dot={index}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="currentColor"
                  className={styles.dot}
                />
              ))}
            </g>
          ))}
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
                  data-active={state.enhanced && index === active}
                >
                  {state.enhanced ? (
                    <button
                      type="button"
                      className={styles.stepControl}
                      aria-pressed={state.held === index}
                      onPointerEnter={(event) => {
                        if (
                          event.pointerType === "mouse" &&
                          matchMedia("(hover: hover) and (pointer: fine)")
                            .matches
                        )
                          dispatch({ type: "preview", owner: "hover", index });
                      }}
                      onPointerLeave={() =>
                        dispatch({
                          type: "preview",
                          owner: "hover",
                          index: null,
                        })
                      }
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible"))
                          dispatch({ type: "preview", owner: "focus", index });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: "preview",
                          owner: "focus",
                          index: null,
                        })
                      }
                      onClick={(event) =>
                        dispatch({
                          type: "hold",
                          index,
                          spatial: event.detail !== 0,
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
            {state.held !== null || state.paused || state.reduced
              ? "Resume sequence"
              : "Pause sequence"}
          </button>
        )}
      </div>
    </div>
  );
}
