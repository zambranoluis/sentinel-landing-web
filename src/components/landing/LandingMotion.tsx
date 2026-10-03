"use client";

import { useEffect } from "react";

const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
type Phase = "ready" | "entering" | "settled" | "exiting" | "exited";
type Target = {
  element: HTMLElement;
  phase: Phase;
  armed: boolean;
  protected: boolean;
  original: { opacity: string; translate: string };
  animation?: Animation;
};

export function LandingMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 720px)");
    const targets: Target[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion]"),
    ).map((element) => ({
      element,
      phase: "ready",
      armed: true,
      protected: false,
      original: {
        opacity: element.style.opacity,
        translate: element.style.translate,
      },
    }));
    const byElement = new Map(
      targets.map((target) => [target.element, target]),
    );
    let previousY = scrollY;
    let direction = 1;
    let entryObserver: IntersectionObserver;
    let departureObserver: IntersectionObserver;
    const pendingExit = new Set<Target>();

    const cancel = (target: Target) => {
      if (!target.animation) return;
      target.animation.onfinish = null;
      target.animation.cancel();
      target.animation = undefined;
    };
    const restoreStyles = ({ element, original }: Target) => {
      element.style.opacity = original.opacity;
      element.style.translate = original.translate;
    };
    const settle = (target: Target) => {
      cancel(target);
      restoreStyles(target);
      target.phase = "settled";
    };
    // Read layout position, excluding our decorative individual translation.
    const bounds = ({ element }: Target) => {
      const rect = element.getBoundingClientRect();
      const offset =
        parseFloat(getComputedStyle(element).translate.split(" ")[1]) || 0;
      return {
        top: rect.top - offset,
        bottom: rect.bottom - offset,
        left: rect.left,
      };
    };
    const visible = (target: Target) => {
      const rect = bounds(target);
      return rect.bottom > 0 && rect.top < innerHeight;
    };
    const distance = () => (mobile.matches ? 28 : 48);
    const prepare = (target: Target) => {
      const rect = bounds(target);
      cancel(target);
      target.element.style.opacity = "0";
      target.element.style.translate = `0 ${rect.bottom <= 0 ? -distance() : distance()}px`;
      target.phase = "ready";
    };
    const focused = ({ element }: Target) => {
      const focus = document.activeElement;
      return (
        !!focus?.matches(":focus-visible") &&
        (element.contains(focus) || focus.contains(element))
      );
    };
    const blocked = (target: Target) =>
      preference.matches ||
      document.hidden ||
      target.protected ||
      focused(target);

    const animate = (
      target: Target,
      frames: Keyframe[],
      duration: number,
      delay: number,
      phase: Phase,
      id: string,
    ) => {
      cancel(target);
      target.phase = phase;
      const animation = target.element.animate(frames, {
        duration,
        delay,
        easing: phase === "exiting" ? "cubic-bezier(0.4, 0, 1, 1)" : easing,
        fill: "both",
      });
      animation.id = id;
      target.animation = animation;
      animation.onfinish = () => {
        if (phase === "exiting") {
          target.phase = "exited";
          const end = frames[frames.length - 1];
          target.element.style.opacity = String(end.opacity);
          target.element.style.translate = String(end.translate);
          cancel(target);
        } else settle(target);
      };
    };
    const recover = (target: Target) => {
      if (blocked(target)) {
        settle(target);
        return;
      }
      const style = getComputedStyle(target.element);
      const start = { translate: style.translate, opacity: style.opacity };
      animate(
        target,
        [start, { translate: "0 0", opacity: 1 }],
        320,
        0,
        "entering",
        "sentinel-recover",
      );
    };
    const depart = (target: Target) => {
      if (
        blocked(target) ||
        target.phase === "ready" ||
        target.phase === "exiting" ||
        target.phase === "exited"
      )
        return;
      const style = getComputedStyle(target.element);
      animate(
        target,
        [
          { translate: style.translate, opacity: style.opacity },
          {
            translate: `0 ${-direction * (mobile.matches ? 18 : 32)}px`,
            opacity: 0,
          },
        ],
        280,
        0,
        "exiting",
        "sentinel-exit",
      );
    };
    const trackDirection = () => {
      const nextY = scrollY;
      if (nextY !== previousY) {
        const nextDirection = nextY > previousY ? 1 : -1;
        if (nextDirection !== direction) {
          direction = nextDirection;
          targets.forEach((target) => {
            if (
              (target.phase === "exiting" || target.phase === "exited") &&
              visible(target)
            )
              recover(target);
          });
        }
      }
      previousY = nextY;
      pendingExit.forEach(rearm);
    };
    const rearm = (target: Target) => {
      const rect = bounds(target);
      if (rect.bottom >= -32 && rect.top <= innerHeight + 32) {
        pendingExit.add(target);
        return;
      }
      pendingExit.delete(target);
      target.armed = true;
      target.protected = false;
      if (!preference.matches && !document.hidden) prepare(target);
      else settle(target);
    };
    const enter = (entries: IntersectionObserverEntry[]) => {
      trackDirection();
      const groups = new Map<Element, Target[]>();
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = byElement.get(entry.target as HTMLElement)!;
        if (blocked(target)) {
          settle(target);
          target.armed = false;
          continue;
        }
        if (!target.armed) {
          if (target.phase === "exiting" || target.phase === "exited")
            recover(target);
          continue;
        }
        target.armed = false;
        const element = target.element;
        const group =
          element.dataset.motion === "unit"
            ? element
            : (element.closest("[data-motion-group]") ?? element);
        const siblings = groups.get(group) ?? [];
        siblings.push(target);
        groups.set(group, siblings);
      }
      for (const siblings of groups.values()) {
        const ordered = siblings
          .map((target) => ({ target, rect: bounds(target) }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
        if (direction < 0) ordered.reverse();
        ordered.forEach(({ target }, index) => {
          const hero = target.element.dataset.motion === "hero";
          animate(
            target,
            [
              { translate: `0 ${distance() * direction}px`, opacity: 0 },
              { translate: "0 0", opacity: 1 },
            ],
            hero ? 750 : 650,
            Math.min(index * (hero ? 90 : 75), 180),
            "entering",
            "sentinel-entrance",
          );
        });
      }
    };
    const observeBands = () => {
      entryObserver?.disconnect();
      departureObserver?.disconnect();
      // IO percentages resolve against root width, so use viewport-height px.
      // Compensate for the prepared travel so entry uses the layout's 84% band.
      const margin = distance() - innerHeight * 0.08;
      entryObserver = new IntersectionObserver(enter, {
        rootMargin: `${margin}px 0px ${margin}px 0px`,
      });
      const departureInset = innerHeight * 0.18;
      departureObserver = new IntersectionObserver(
        (entries) => {
          trackDirection();
          for (const entry of entries) {
            const target = byElement.get(entry.target as HTMLElement)!;
            if (entry.isIntersecting) {
              if (
                !target.armed &&
                (target.phase === "exiting" || target.phase === "exited")
              )
                recover(target);
            } else {
              const rect = bounds(target);
              if (
                (direction > 0 && rect.bottom <= departureInset) ||
                (direction < 0 && rect.top >= innerHeight - departureInset)
              )
                depart(target);
            }
          }
        },
        { rootMargin: `-${departureInset}px 0px -${departureInset}px 0px` },
      );
      targets.forEach(({ element }) => {
        entryObserver.observe(element);
        departureObserver.observe(element);
      });
    };
    const exitObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const target = byElement.get(entry.target as HTMLElement)!;
          rearm(target);
        }
      },
      { rootMargin: "32px 0px" },
    );

    const settleWithin = (node: Element) =>
      targets.forEach((target) => {
        if (node.contains(target.element) || target.element.contains(node)) {
          settle(target);
          target.armed = false;
          target.protected = true;
        }
      });
    const settleFragment = (hash = location.hash) => {
      try {
        const node = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (node) settleWithin(node);
      } catch {
        /* Malformed fragments have no matching target. */
      }
    };
    const settleEnvironment = () =>
      targets.forEach((target) => {
        settle(target);
        if (visible(target)) {
          target.armed = false;
          target.protected = true;
        } else if (target.armed && !preference.matches && !document.hidden)
          prepare(target);
      });
    const onResize = () => {
      settleEnvironment();
      observeBands();
    };
    const onVisibility = () => settleEnvironment();
    const onFocus = (event: FocusEvent) => {
      // Pointer focus must not move a link between press and release.
      if (
        event.target instanceof Element &&
        event.target.matches(":focus-visible")
      )
        settleWithin(event.target);
    };
    const onHash = () => settleFragment();
    const onFragmentClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        link?.hash &&
        link.origin === location.origin &&
        link.pathname === location.pathname &&
        link.search === location.search &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      )
        settleFragment(link.hash);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted || scrollY > 0) {
        settleEnvironment();
        previousY = scrollY;
      }
      settleFragment();
    };

    targets.forEach((target) => {
      if (!visible(target) && !preference.matches) prepare(target);
      else if (scrollY > 0 || preference.matches) {
        settle(target);
        target.armed = false;
        target.protected = true;
      }
    });
    settleFragment();
    if (document.activeElement?.matches(":focus-visible"))
      settleWithin(document.activeElement);
    observeBands();
    targets.forEach(({ element }) => exitObserver.observe(element));
    preference.addEventListener("change", settleEnvironment);
    window.addEventListener("scroll", trackDirection, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onFragmentClick, true);
    return () => {
      entryObserver.disconnect();
      departureObserver.disconnect();
      exitObserver.disconnect();
      preference.removeEventListener("change", settleEnvironment);
      window.removeEventListener("scroll", trackDirection);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onFragmentClick, true);
      targets.forEach((target) => {
        cancel(target);
        restoreStyles(target);
      });
    };
  }, []);
  return null;
}
