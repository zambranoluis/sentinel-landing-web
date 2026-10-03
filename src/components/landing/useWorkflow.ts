"use client";

import { useEffect, useReducer, useRef } from "react";

type Phase = "hold" | "circles" | "connector" | "card";
type State = {
  enhanced: boolean;
  stage: number;
  phase: Phase;
  hover: number | null;
  focus: number | null;
  activation: number | null;
  activationRevision: number;
  visible: boolean;
  hidden: boolean;
  reduced: boolean;
};
type Action =
  | { type: "environment"; values: Partial<State> }
  | { type: "preview"; owner: "focus" | "hover"; index: number | null }
  | { type: "activate"; index: number | null }
  | { type: "complete"; phase: Phase; mobile?: boolean };

function isRunning(state: State) {
  return state.enhanced && state.visible && !state.hidden && !state.reduced;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "environment":
      return {
        ...state,
        ...action.values,
        // Preference changes settle motion at the current highlighted card.
        ...(action.values.reduced ? { phase: "hold" as const } : {}),
      };
    case "preview":
      return state[action.owner] === action.index
        ? state
        : { ...state, [action.owner]: action.index };
    case "activate":
      return {
        ...state,
        activation: action.index,
        activationRevision: state.activationRevision + 1,
      };
    case "complete":
      if (state.phase !== action.phase || state.reduced) return state;
      switch (state.phase) {
        case "hold":
          if (!isRunning(state)) return state;
          return { ...state, phase: "circles" };
        case "circles":
          return action.mobile
            ? { ...state, phase: "card", stage: (state.stage + 1) % 5 }
            : { ...state, phase: "connector" };
        case "connector":
          return { ...state, phase: "card", stage: (state.stage + 1) % 5 };
        case "card":
          return { ...state, phase: "hold" };
      }
  }
}

export function useWorkflow() {
  const root = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    enhanced: false,
    stage: 0,
    phase: "hold",
    hover: null,
    focus: null,
    activation: null,
    activationRevision: 0,
    visible: false,
    hidden: false,
    reduced: false,
  });
  const remaining = useRef(1000);
  const running = isRunning(state);
  const feedback = state.focus ?? state.hover ?? state.activation;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () =>
      dispatch({
        type: "environment",
        values: { enhanced: true, reduced: preference.matches },
      });
    const updateVisibility = () =>
      dispatch({ type: "environment", values: { hidden: document.hidden } });
    updatePreference();
    updateVisibility();
    // Individual rows keep a partly visible mobile list playing.
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
    if (state.phase !== "hold") {
      remaining.current = 1000;
      return;
    }
    if (!running) return;
    const started = performance.now();
    const timer = setTimeout(
      () => dispatch({ type: "complete", phase: "hold" }),
      remaining.current,
    );
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - started),
      );
    };
  }, [running, state.phase, state.stage]);

  useEffect(() => {
    if (state.activation === null) return;
    const timer = setTimeout(
      () => dispatch({ type: "activate", index: null }),
      700,
    );
    return () => clearTimeout(timer);
  }, [state.activation, state.activationRevision]);

  return { root, state, dispatch, feedback, running };
}
