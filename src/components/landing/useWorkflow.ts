"use client";

import { useEffect, useReducer, useRef } from "react";

type State = {
  enhanced: boolean;
  stage: number;
  held: number | null;
  hover: number | null;
  focus: number | null;
  paused: boolean;
  visible: boolean;
  hidden: boolean;
  reduced: boolean;
  revision: number;
  spatial: boolean;
};
type Action =
  | { type: "environment"; values: Partial<State> }
  | { type: "preview"; owner: "focus" | "hover"; index: number | null }
  | { type: "hold"; index: number; spatial: boolean }
  | { type: "playback" }
  | { type: "advance" };

function environmentRunning(state: State) {
  return state.enhanced && state.visible && !state.hidden && !state.reduced;
}

function isAutomatic(state: State) {
  return (
    environmentRunning(state) &&
    !state.paused &&
    state.held === null &&
    state.focus === null &&
    state.hover === null
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "environment":
      return { ...state, ...action.values };
    case "preview":
      if (state[action.owner] === action.index) return state;
      return {
        ...state,
        [action.owner]: action.index,
        spatial: action.owner === "hover" && state.focus === null,
      };
    case "hold":
      return {
        ...state,
        held: action.index,
        paused: false,
        revision: state.revision + 1,
        spatial: action.spatial,
      };
    case "playback":
      return state.held !== null || state.paused
        ? {
            ...state,
            stage: state.held ?? state.stage,
            held: null,
            paused: false,
            revision: state.revision + (state.held !== null ? 1 : 0),
          }
        : { ...state, paused: true };
    case "advance":
      // A timeout already queued when a preview/visibility event arrives must
      // not advance the interrupted stage before effect cleanup runs.
      if (!isAutomatic(state)) return state;
      return { ...state, stage: (state.stage + 1) % 5, spatial: true };
  }
}

export function useWorkflow() {
  const root = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    enhanced: false,
    stage: 0,
    held: null,
    hover: null,
    focus: null,
    paused: false,
    visible: false,
    hidden: false,
    reduced: false,
    revision: 0,
    spatial: true,
  });
  const remaining = useRef(2400);
  const clockStage = useRef("");
  const active = state.focus ?? state.hover ?? state.held ?? state.stage;
  const running = environmentRunning(state);
  const automatic = isAutomatic(state);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () =>
      dispatch({
        type: "environment",
        values: { enhanced: true, reduced: preference.matches },
      });
    const updateVisibility = () =>
      dispatch({
        type: "environment",
        values: { hidden: document.hidden },
      });
    updatePreference();
    updateVisibility();
    // Observe the rows individually: a tall mobile list can be partly visible
    // even when its cube and the first row have left the viewport.
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      dispatch({ type: "environment", values: { visible: visible.size > 0 } });
    });
    root.current
      ?.querySelectorAll("li")
      .forEach((row) => observer.observe(row));
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const key = `${state.stage}:${state.revision}`;
    if (clockStage.current !== key) {
      clockStage.current = key;
      remaining.current = 2400;
    }
    if (!automatic) return;
    const started = performance.now();
    const timer = setTimeout(
      () => dispatch({ type: "advance" }),
      remaining.current,
    );
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - started),
      );
    };
  }, [automatic, state.stage, state.revision]);

  return { root, state, dispatch, active, automatic, running };
}
