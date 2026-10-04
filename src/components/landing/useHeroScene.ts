"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { type HeroDetection, sceneSize } from "./heroDetections";

export function useHeroScene() {
  const scene = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLElement | SVGElement | null>(null);
  const grace = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const dismissedAt = useRef<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const selected = pinned ?? focused ?? hovered;

  useLayoutEffect(() => {
    const root = scene.current!;
    const copy = root
      .closest("section")!
      .querySelector<HTMLElement>("[data-hero-copy]")!;
    // Adding the phone detail panel must not take height from the photograph.
    const measure = () =>
      root.style.setProperty(
        "--hero-copy-height",
        `${copy.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    measure();
    return () => observer.disconnect();
  }, []);

  function cancelExit() {
    if (grace.current) clearTimeout(grace.current);
    grace.current = null;
  }
  function hover(id: string, element: SVGElement, x: number, y: number) {
    cancelExit();
    // Removing a callout can expose a target under a stationary pointer.
    // Dismissal stays dismissed until the visitor actually moves again.
    if (dismissedAt.current?.x === x && dismissedAt.current.y === y) return;
    dismissedAt.current = null;
    if (hovered === id) return;
    if (!pinned && !focused) origin.current = element;
    setHovered(id);
  }
  function leave() {
    cancelExit();
    grace.current = setTimeout(() => setHovered(null), 160);
  }
  function clear(restoreFocus = false) {
    cancelExit();
    dismissedAt.current = { ...pointerPosition.current };
    if (restoreFocus) origin.current?.focus({ preventScroll: true });
    setPinned(null);
    setFocused(null);
    setHovered(null);
  }
  function activate(id: string, element: HTMLElement | SVGElement) {
    origin.current = element;
    cancelExit();
    if (pinned === id) clear();
    else setPinned(id);
  }

  useEffect(() => {
    // Readiness is an external DOM lifecycle signal, also gating no-JS controls.
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(frame);
      if (grace.current) clearTimeout(grace.current);
    };
  }, []);

  useEffect(() => {
    const element = artwork.current!;
    const layer = camera.current!;
    const root = scene.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const svg = element.querySelector<SVGSVGElement>('svg[role="group"]')!;
    const waves =
      element.querySelectorAll<SVGAnimationElement>("[data-route-wave]");
    let waveStarted = false;
    const pointer = matchMedia(
      "(min-width: 721px) and (hover: hover) and (pointer: fine)",
    );
    let visible = false;
    let frame = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      layer.style.removeProperty("transform");
    };
    const enabled = () =>
      root.dataset.paused !== "true" &&
      !reduced.matches &&
      visible &&
      !document.hidden;
    const sync = () => {
      root.dataset.running = String(enabled());
      // Native SVG geometry animation also works in engines without CSS d.
      if (reduced.matches && waveStarted) {
        waves.forEach((wave) => wave.endElement());
        waveStarted = false;
      } else if (!reduced.matches && !waveStarted) {
        waves.forEach((wave) => wave.beginElement());
        waveStarted = true;
      }
      if (enabled()) svg.unpauseAnimations();
      else svg.pauseAnimations();
      if (!enabled() || !pointer.matches) reset();
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || !pointer.matches || event.pointerType !== "mouse")
        return;
      const box = element.getBoundingClientRect();
      x = Math.max(
        -6,
        Math.min(6, ((event.clientX - box.left) / box.width - 0.5) * 12),
      );
      y = Math.max(
        -6,
        Math.min(6, ((event.clientY - box.top) / box.height - 0.5) * 12),
      );
      if (!frame)
        frame = requestAnimationFrame(() => {
          // Pixel overscan covers travel even on short, wide viewports.
          const zoom = 1 + 16 / Math.min(box.width, box.height);
          layer.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
          frame = 0;
        });
    };
    const trackPointer = (event: PointerEvent) => {
      pointerPosition.current = { x: event.clientX, y: event.clientY };
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", sync);
    root.addEventListener("hero-playback-change", sync);
    root.addEventListener("pointermove", trackPointer);
    reduced.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    window.addEventListener("resize", reset);
    sync();
    return () => {
      observer.disconnect();
      if (waveStarted) waves.forEach((wave) => wave.endElement());
      reset();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", sync);
      root.removeEventListener("hero-playback-change", sync);
      root.removeEventListener("pointermove", trackPointer);
      reduced.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
      window.removeEventListener("resize", reset);
    };
  }, []);

  useEffect(() => {
    scene.current?.dispatchEvent(new Event("hero-playback-change"));
  }, [paused]);

  return {
    scene,
    artwork,
    camera,
    panel,
    origin,
    selected,
    pinned,
    ready,
    paused,
    setPaused,
    hover,
    leave,
    cancelExit,
    clear,
    activate,
    setFocused,
  };
}

export function useHeroCallout(
  artworkRef: React.RefObject<HTMLDivElement | null>,
  panelRef: React.RefObject<HTMLDivElement | null>,
  target: HeroDetection | undefined,
) {
  useLayoutEffect(() => {
    if (!target || !artworkRef.current || !panelRef.current) return;
    const image = artworkRef.current;
    const detail = panelRef.current;
    const copy = image
      .closest("section")!
      .querySelector<HTMLElement>("[data-hero-copy]")!;
    const place = () => {
      // Match the CSS desktop condition exactly, including fractional widths.
      if (!matchMedia("(min-width: 721px)").matches) {
        detail.removeAttribute("style");
        return;
      }
      const box = image.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const safeLeft = Math.max(16, copyBox.right - box.left + 16);
      const width = Math.min(288, box.width - safeLeft - 16);
      detail.style.width = `${width}px`;
      const scale = Math.max(
        box.width / sceneSize.width,
        box.height / sceneSize.height,
      );
      const y =
        (box.height - sceneSize.height * scale) / 2 + target.anchor[1] * scale;
      const hit = image.querySelector<SVGGraphicsElement>(
        `[data-detection="${target.id}"] path:last-child`,
      )!;
      const bounds = hit.getBBox();
      const offset = (box.width - sceneSize.width * scale) / 2;
      const left =
        offset + (target.route ? target.anchor[0] : bounds.x) * scale;
      const right = target.route ? left : left + bounds.width * scale;
      const preferred =
        right + width + 36 < box.width ? right + 20 : left - width - 20;
      detail.style.left = `${Math.max(safeLeft, Math.min(box.width - width - 16, preferred))}px`;
      detail.style.top = `${Math.max(16, Math.min(box.height - detail.offsetHeight - 76, y - detail.offsetHeight / 2))}px`;
    };
    const observer = new ResizeObserver(place);
    observer.observe(image);
    observer.observe(detail);
    observer.observe(copy);
    place();
    return () => observer.disconnect();
  }, [artworkRef, panelRef, target]);
}
