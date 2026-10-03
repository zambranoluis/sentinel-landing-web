"use client";

import { useEffect, useRef, useState } from "react";
import type { useWorkflow } from "./useWorkflow";

type Workflow = ReturnType<typeof useWorkflow>;
const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

export function useWorkflowMotion({
  root,
  state,
  dispatch,
  running,
  feedback,
}: Workflow) {
  const effects = useRef<Animation[]>([]);
  const elapsed = useRef(0);
  const phaseKey = useRef("");
  const [geometry, setGeometry] = useState(0);

  useEffect(() => {
    const element = root.current!;
    let width = element.clientWidth;
    let height = element.clientHeight;
    const observer = new ResizeObserver(() => {
      if (width === element.clientWidth && height === element.clientHeight)
        return;
      width = element.clientWidth;
      height = element.clientHeight;
      setGeometry((revision) => revision + 1);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [root]);

  useEffect(() => {
    if (feedback === null) return;
    const element = root.current!;
    const row = element.querySelectorAll<HTMLElement>("li")[feedback];
    const rail = element.querySelector<HTMLElement>("[data-feedback-rail]")!;
    rail.style.transform = `translateY(${row.offsetTop + row.offsetHeight / 2 - 12}px)`;
  }, [root, feedback, geometry]);

  useEffect(() => {
    const element = root.current!;
    const mobile = matchMedia("(max-width: 720px)").matches;
    const rail = element.querySelector<HTMLElement>("[data-rail-accent]")!;
    const rows = element.querySelectorAll<HTMLElement>("li");
    const position = (index: number) =>
      rows[index].offsetTop + rows[index].offsetHeight / 2 - 12;
    const destination =
      state.phase === "card" || state.phase === "hold"
        ? state.stage
        : (state.stage + 1) % 5;
    const key = `${state.stage}:${state.phase}`;
    if (phaseKey.current !== key) elapsed.current = 0;
    phaseKey.current = key;
    rail.style.transform = `translateY(${position(state.stage)}px)`;
    if (!state.enhanced || state.reduced || state.phase === "hold") return;

    const animate = (
      target: Element,
      frames: Keyframe[],
      duration: number,
      curve = easing,
    ) => {
      const animation = target.animate(frames, {
        duration,
        easing: curve,
        fill: "backwards",
      });
      animation.pause();
      animation.currentTime = elapsed.current;
      effects.current.push(animation);
    };
    if (mobile && (state.phase === "circles" || state.phase === "connector")) {
      rail.style.transform = `translateY(${position(destination)}px)`;
      animate(
        rail,
        [
          {
            transform: `translateY(${position(state.stage)}px)`,
            opacity: 0.35,
          },
          { transform: `translateY(${position(destination)}px)`, opacity: 1 },
        ],
        state.phase === "circles" ? 700 : 500,
      );
    } else if (state.phase === "circles") {
      const trace = element.querySelector<SVGPathElement>(
        `[data-trace="${destination}"]`,
      )!;
      const endpoint = trace.getPointAtLength(trace.getTotalLength());
      // SVG circles start at three o'clock. Centre each short arc on the ray
      // from the shared ring centre to the destination connector's endpoint.
      const turn =
        Math.atan2(endpoint.y - 357, endpoint.x - 410) / (2 * Math.PI);
      element.querySelectorAll("[data-ring-accent]").forEach((ring) => {
        animate(
          ring,
          [
            { strokeDashoffset: `${-turn + 0.11}`, opacity: 0 },
            { strokeDashoffset: `${-turn + 0.03}`, opacity: 0.8, offset: 0.55 },
            { strokeDashoffset: `${-turn + 0.03}`, opacity: 0.8, offset: 0.85 },
            { strokeDashoffset: `${-turn + 0.03}`, opacity: 0 },
          ],
          700,
          "linear",
        );
      });
    } else if (state.phase === "connector") {
      animate(
        element.querySelector(`[data-trace="${destination}"]`)!,
        [
          { strokeDashoffset: "1", opacity: 1 },
          { strokeDashoffset: "0", opacity: 1 },
        ],
        500,
      );
      element.querySelectorAll(`[data-dot="${destination}"]`).forEach((dot) => {
        animate(
          dot,
          [
            { transform: "scale(1)" },
            { transform: "scale(1.65)", offset: 0.45 },
            { transform: "scale(1)" },
          ],
          500,
        );
      });
    } else if (state.phase === "card") {
      animate(
        rows[destination].querySelector("[data-card-accent]")!,
        [{ opacity: 0 }, { opacity: 1 }],
        200,
      );
      animate(
        rows[destination].querySelector("[data-step-icon]")!,
        [
          { transform: "scale(1)" },
          { transform: "scale(1.08)", offset: 0.45 },
          { transform: "scale(1)" },
        ],
        200,
      );
    }

    let cancelled = false;
    // Completion owns advancement; visibility only pauses these same effects.
    Promise.all(effects.current.map((animation) => animation.finished))
      .then(() => {
        if (!cancelled)
          dispatch({ type: "complete", phase: state.phase, mobile });
      })
      .catch(() => {
        /* Owned cancellation on resize, preference or cleanup. */
      });
    return () => {
      cancelled = true;
      elapsed.current = Number(effects.current[0]?.currentTime ?? 0);
      effects.current.forEach((animation) => animation.cancel());
      effects.current = [];
    };
  }, [
    root,
    dispatch,
    state.phase,
    state.stage,
    state.enhanced,
    state.reduced,
    geometry,
  ]);

  useEffect(() => {
    for (const animation of effects.current) {
      if (animation.playState === "finished") continue;
      if (running) animation.play();
      else animation.pause();
    }
  }, [
    running,
    state.phase,
    state.stage,
    state.enhanced,
    state.reduced,
    geometry,
  ]);
}
