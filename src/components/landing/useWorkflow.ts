"use client";

import { useEffect, useReducer, useRef } from "react";

type State = {
  enhanced: boolean;
  stage: number;
  hover: number | null;
  focus: number | null;
  pressed: number | null;
  pressVersion: number;
  paused: boolean;
  visible: boolean;
  hidden: boolean;
  reduced: boolean;
  mobile: boolean;
  geometry: number;
  arrived: boolean;
};
type Action =
  | { type: "environment"; values: Partial<State> }
  | { type: "emphasis"; owner: "focus" | "hover"; index: number | null }
  | { type: "press"; index: number }
  | { type: "release"; version: number }
  | { type: "resize" }
  | { type: "playback" }
  | { type: "advance" };

function isAutomatic(state: State) {
  return (
    state.enhanced &&
    state.visible &&
    !state.hidden &&
    !state.reduced &&
    !state.paused
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "environment":
      return { ...state, ...action.values };
    case "emphasis":
      return { ...state, [action.owner]: action.index };
    case "press":
      return {
        ...state,
        pressed: action.index,
        pressVersion: state.pressVersion + 1,
      };
    case "release":
      return action.version === state.pressVersion
        ? { ...state, pressed: null }
        : state;
    case "resize":
      return { ...state, geometry: state.geometry + 1 };
    case "playback":
      return { ...state, paused: !state.paused };
    case "advance":
      return isAutomatic(state)
        ? { ...state, stage: (state.stage + 1) % 5, arrived: true }
        : state;
  }
}

type CreateEffects = (
  element: HTMLDivElement,
  stage: number,
  mobile: boolean,
  animate: boolean,
  arrived: boolean,
) => Animation[];

function synchronizePlayback(
  animations: Animation[],
  elapsed: number,
  running: boolean,
) {
  const startTime = Number(document.timeline.currentTime) - elapsed;
  for (const animation of animations) {
    if (running) {
      animation.play();
      animation.startTime = startTime;
    } else {
      animation.pause();
      animation.currentTime = elapsed;
    }
  }
}

export function useWorkflow(createEffects: CreateEffects) {
  const root = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    enhanced: false,
    stage: 0,
    hover: null,
    focus: null,
    pressed: null,
    pressVersion: 0,
    paused: false,
    visible: false,
    hidden: false,
    reduced: false,
    mobile: false,
    geometry: 0,
    arrived: false,
  });
  const timeline = useRef<{ clock: Animation; animations: Animation[] } | null>(
    null,
  );
  const progress = useRef({ stage: 0, fraction: 0, settled: false });
  const automatic = isAutomatic(state);
  const interaction = state.focus ?? state.hover ?? state.pressed;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const breakpoint = matchMedia("(max-width: 720px)");
    const updateEnvironment = () =>
      dispatch({
        type: "environment",
        values: {
          enhanced: true,
          reduced: preference.matches,
          mobile: breakpoint.matches,
        },
      });
    const updateVisibility = () =>
      dispatch({
        type: "environment",
        values: { hidden: document.hidden },
      });
    updateEnvironment();
    updateVisibility();
    // Each mobile row can keep playback visible after the cube has left.
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      dispatch({ type: "environment", values: { visible: visible.size > 0 } });
    });
    const element = root.current!;
    element.querySelectorAll("li").forEach((row) => observer.observe(row));
    let width = element.clientWidth;
    let height = element.clientHeight;
    const resize = new ResizeObserver(() => {
      if (width === element.clientWidth && height === element.clientHeight)
        return;
      width = element.clientWidth;
      height = element.clientHeight;
      dispatch({ type: "resize" });
    });
    resize.observe(element);
    preference.addEventListener("change", updateEnvironment);
    breakpoint.addEventListener("change", updateEnvironment);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener("change", updateEnvironment);
      breakpoint.removeEventListener("change", updateEnvironment);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const version = state.pressVersion;
    if (!version) return;
    const timer = setTimeout(() => dispatch({ type: "release", version }), 600);
    return () => clearTimeout(timer);
  }, [state.pressVersion]);

  useEffect(() => {
    const saved = progress.current;
    const sameStage = saved.stage === state.stage;
    const fraction = sameStage ? saved.fraction : 0;
    const duration = state.mobile ? 1200 : 2400;
    const effects = createEffects(
      root.current!,
      state.stage,
      state.mobile,
      state.enhanced && !state.reduced && !(sameStage && saved.settled),
      state.arrived && !sameStage,
    );
    if (!state.enhanced || state.reduced) return;
    // This inert animation is the single playback clock. All decorative
    // effects share its duration/start time; its completion advances the list.
    const clock = root.current!.animate([{}], { duration });
    clock.id = "workflow-clock";
    const animations = [clock, ...effects];
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = fraction * duration;
    }
    timeline.current = { clock, animations };
    clock.onfinish = () => dispatch({ type: "advance" });
    return () => {
      progress.current = {
        stage: state.stage,
        fraction: Math.min(1, Number(clock.currentTime ?? 0) / duration),
        // A rebuild of the same stage means changed geometry or preference.
        // Preserve interval progress, settle artwork, then rearm next stage.
        settled: true,
      };
      clock.onfinish = null;
      animations.forEach((animation) => animation.cancel());
      timeline.current = null;
    };
  }, [
    createEffects,
    state.stage,
    state.enhanced,
    state.reduced,
    state.mobile,
    state.geometry,
    state.arrived,
  ]);

  useEffect(() => {
    const current = timeline.current;
    if (!current) return;
    const elapsed = Number(current.clock.currentTime ?? 0);
    synchronizePlayback(current.animations, elapsed, automatic);
  }, [
    automatic,
    state.stage,
    state.enhanced,
    state.reduced,
    state.mobile,
    state.geometry,
    state.arrived,
  ]);

  return { root, state, dispatch, automatic, interaction };
}
