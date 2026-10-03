"use client";

import { type ReactNode } from "react";
import styles from "./HowItWorks.module.css";
import { useWorkflow } from "./useWorkflow";
import { useWorkflowMotion } from "./useWorkflowMotion";

type Step = { name: string; position: string; path: string };
const connectors = [
  {
    path: "M410 265V180",
    dots: [
      [410, 180],
      [410, 265],
    ],
  },
  {
    path: "M294 355 200 335",
    dots: [
      [200, 335],
      [294, 355],
    ],
  },
  {
    path: "M526 355 620 335",
    dots: [
      [620, 335],
      [526, 355],
    ],
  },
  {
    path: "M335 462 290 514",
    dots: [
      [290, 514],
      [335, 462],
    ],
  },
  {
    path: "M483 462 530 514",
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
  const workflow = useWorkflow();
  const { root, state, dispatch, feedback, running } = workflow;
  useWorkflowMotion(workflow);
  const destination = (state.stage + 1) % steps.length;

  return (
    <div
      ref={root}
      className={styles.workflow}
      data-motion="unit"
      data-workflow=""
      data-active-step={
        state.enhanced ? steps[state.stage].position : undefined
      }
      data-sequence-running={running}
      data-phase={state.phase}
      data-destination={steps[destination].position}
      data-feedback-step={
        feedback === null ? undefined : steps[feedback].position
      }
      data-activation-step={
        state.activation === null ? undefined : steps[state.activation].position
      }
      data-immediate={state.reduced || state.focus !== null}
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
                data-active={state.enhanced && state.stage === index}
              />
              <path
                data-feedback-trace={index}
                d={connector.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={styles.feedbackTrace}
                data-active={state.enhanced && feedback === index}
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
          <span
            className={`${styles.railAccent} ${styles.feedbackRail}`}
            data-feedback-rail=""
            aria-hidden="true"
          />
          <ol className={styles.steps} aria-label="How Sentinel works">
            {steps.map((step, index) => {
              const content = (
                <>
                  <span
                    className={styles.icon}
                    data-step-icon=""
                    aria-hidden="true"
                  >
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
                  data-active={state.enhanced && index === state.stage}
                  data-feedback={state.enhanced && index === feedback}
                >
                  <span
                    className={styles.cardAccent}
                    data-card-accent=""
                    aria-hidden="true"
                  />
                  <span className={styles.feedbackAccent} aria-hidden="true" />
                  {state.enhanced ? (
                    <button
                      type="button"
                      className={styles.stepControl}
                      onPointerDown={() =>
                        dispatch({
                          type: "preview",
                          owner: "focus",
                          index: null,
                        })
                      }
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
                      onKeyDown={(event) => {
                        if (event.currentTarget.matches(":focus-visible"))
                          dispatch({ type: "preview", owner: "focus", index });
                      }}
                      onKeyUp={(event) =>
                        dispatch({
                          type: "preview",
                          owner: "focus",
                          index: event.currentTarget.matches(":focus-visible")
                            ? index
                            : null,
                        })
                      }
                      onClick={() => dispatch({ type: "activate", index })}
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
    </div>
  );
}
