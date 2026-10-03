import { expect, type Page } from "@playwright/test";

type Entrance = { element: Element; animation: Animation };
declare global {
  interface Window {
    entrances: Entrance[];
    freezeEntrances: boolean;
  }
}

export async function prepareMotion(
  page: Page,
  freeze = true,
  viewport = { width: 1440, height: 1000 },
) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Record real WAAPI effects; freezing only their clock makes intermediate
  // states deterministic while the production observers and scroll still run.
  await page.addInitScript((freeze) => {
    window.entrances = [];
    window.freezeEntrances = freeze;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (
        Array.isArray(frames) &&
        frames.some((frame) => "translate" in frame)
      ) {
        window.entrances.push({ element: this, animation });
        if (window.freezeEntrances) animation.pause();
      }
      return animation;
    };
  }, freeze);
}

export async function frames(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
export async function count(page: Page, selector: string) {
  return page.evaluate(
    (selector) =>
      window.entrances.filter(
        ({ element, animation }) =>
          animation.id === "sentinel-entrance" && element.matches(selector),
      ).length,
    selector,
  );
}
export async function ready(page: Page) {
  await expect.poll(() => count(page, '[data-motion="hero"]')).toBe(3);
}
export async function position(page: Page, selector: string, top: number) {
  await page.locator(selector).evaluate((element, top) => {
    const travel =
      parseFloat(getComputedStyle(element).translate.split(" ")[1]) || 0;
    window.scrollTo(
      0,
      element.getBoundingClientRect().top - travel + scrollY - top,
    );
  }, top);
  await frames(page);
}
export async function finish(page: Page, selector = "[data-motion]") {
  await page.locator(selector).evaluateAll((elements) => {
    for (const element of elements) {
      for (const animation of element.getAnimations()) {
        if (animation.id.startsWith("sentinel-")) animation.finish();
      }
    }
  });
  await frames(page);
}
export async function active(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluateAll(
      (elements) =>
        elements
          .flatMap((element) => element.getAnimations())
          .filter((a) => a.id === "sentinel-entrance").length,
    );
}
export async function snapshot(page: Page, selector: string) {
  return page.evaluate(
    (selector) =>
      window.entrances
        .filter(
          ({ element, animation }) =>
            animation.id === "sentinel-entrance" && element.matches(selector),
        )
        .map(({ element, animation }) => ({
          index: Array.from(document.querySelectorAll(selector)).indexOf(
            element,
          ),
          delay: animation.effect!.getTiming().delay,
          duration: animation.effect!.getTiming().duration,
          easing: animation.effect!.getTiming().easing,
          start: (animation.effect as KeyframeEffect).getKeyframes()[0]
            .translate,
        })),
    selector,
  );
}
