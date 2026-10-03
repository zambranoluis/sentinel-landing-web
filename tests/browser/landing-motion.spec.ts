import { expect, test } from "@playwright/test";
import {
  prepareMotion,
  frames,
  count,
  ready,
  position,
  finish,
  active,
  snapshot,
} from "./landing-motion-helpers";

test.beforeEach(async ({ page }) => prepareMotion(page));

test("hero composes heading, copy and action while navigation stays available", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await ready(page);
  const states = await snapshot(page, '[data-motion="hero"]');
  expect(states.map(({ delay }) => delay)).toEqual([0, 90, 180]);
  expect(states.map(({ duration }) => duration)).toEqual([750, 750, 750]);
  expect(
    states.every(
      ({ start, easing }) =>
        start === "0px 48px" && easing === "cubic-bezier(0.16, 1, 0.3, 1)",
    ),
  ).toBe(true);
  await expect(
    page.getByRole("navigation", { name: "Primary", exact: true }),
  ).toBeVisible();
  expect(await active(page, "header [data-motion]")).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("hero-entry.png") });
  await finish(page);
  await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
  await expect(page.locator("#hero-heading")).toHaveCSS("translate", "none");
});

test("deployment replays from above with reversed visual staggering and real intermediate states", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await ready(page);
  await position(page, "#deployment ol", 250);
  const selector = "#deployment li";
  await expect.poll(() => count(page, selector)).toBe(3);
  expect(
    (await snapshot(page, selector)).map(({ index, delay, start }) => [
      index,
      delay,
      start,
    ]),
  ).toEqual([
    [0, 0, "0px 48px"],
    [1, 75, "0px 48px"],
    [2, 150, "0px 48px"],
  ]);
  const intermediate = await page.evaluate(
    (selector) =>
      window.entrances
        .filter(({ element }) => element.matches(selector))
        .map(({ element, animation }) => {
          animation.currentTime =
            (animation.effect!.getTiming().delay ?? 0) + 100;
          const style = getComputedStyle(element);
          return {
            opacity: Number(style.opacity),
            travel: parseFloat(style.translate.split(" ")[1]),
          };
        }),
    selector,
  );
  for (const state of intermediate) {
    expect(state.opacity).toBeGreaterThan(0);
    expect(state.opacity).toBeLessThan(1);
    expect(state.travel).toBeGreaterThan(0);
    expect(state.travel).toBeLessThan(48);
  }
  await page.screenshot({
    path: testInfo.outputPath("deployment-down-intermediate.png"),
  });
  await finish(page);
  await page.screenshot({
    path: testInfo.outputPath("deployment-settled.png"),
  });
  await page
    .locator("#deployment ol")
    .evaluate((element) =>
      window.scrollTo(0, element.getBoundingClientRect().bottom + scrollY + 80),
    );
  await frames(page);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => count(page, selector)).toBe(6);
  expect(
    (await snapshot(page, selector))
      .slice(3)
      .map(({ index, delay, start }) => [index, delay, start]),
  ).toEqual([
    [2, 0, "0px -48px"],
    [1, 75, "0px -48px"],
    [0, 150, "0px -48px"],
  ]);
  await page.screenshot({
    path: testInfo.outputPath("deployment-up-entry.png"),
  });
  await finish(page);
  expect(await active(page, selector)).toBe(0);
});

test("central-band jitter does not rearm before the complete 32px exit buffer", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  const selector = "#deployment li";
  await position(page, "#deployment ol", 910);
  await expect.poll(() => count(page, selector)).toBe(3);
  await finish(page);
  for (const top of [940, 910, 1030, 910]) {
    await position(page, "#deployment ol", top);
    expect(await count(page, selector)).toBe(3);
  }
  await position(page, "#deployment ol", 1040);
  await position(page, "#deployment ol", 910);
  await expect.poll(() => count(page, selector)).toBe(6);
});

test("rapid reversal preserves visible entrances and fast scrolling skips offscreen siblings", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => count(page, "#deployment li")).toBe(3);
  const before = await snapshot(page, "#deployment li");
  for (const top of [200, 300, 220])
    await position(page, "#deployment ol", top);
  expect(await snapshot(page, "#deployment li")).toEqual(before);
  expect(await active(page, "#deployment li")).toBe(3);
  await page
    .locator("#deployment li")
    .evaluateAll((items) =>
      items.forEach((item) => item.getAnimations().forEach((a) => a.play())),
    );
  await expect.poll(() => active(page, "#deployment li")).toBe(0);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await frames(page);
  expect(await count(page, "#plans [data-motion]")).toBe(0);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => count(page, "#deployment li")).toBe(6);
});

test("mobile tall groups enter progressively with 28px travel and no parent-child overlaps", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await ready(page);
  await position(page, "#capabilities article:first-child", 100);
  await expect
    .poll(() => count(page, "#capabilities article:first-child"))
    .toBe(1);
  expect(await count(page, "#capabilities article:last-child")).toBe(0);
  expect((await snapshot(page, "#capabilities article"))[0].start).toBe(
    "0px 28px",
  );
  await page.screenshot({
    path: testInfo.outputPath("mobile-progressive-entry.png"),
  });
  await finish(page);
  await position(page, "#capabilities article:last-child", 100);
  await expect
    .poll(() => count(page, "#capabilities article:last-child"))
    .toBe(1);
  expect(await page.locator("[data-motion] [data-motion]").count()).toBe(0);
  await finish(page);
  expect(await active(page, "#capabilities article")).toBe(0);
});

test("footer visual order caps the total delay at 180ms", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  await position(page, "footer", 150);
  const selector = "footer [data-motion=content]";
  await expect.poll(() => count(page, selector)).toBe(5);
  expect((await snapshot(page, selector)).map(({ delay }) => delay)).toEqual([
    0, 75, 150, 180, 180,
  ]);
});

test("prepared footer motion preserves the native document scroll range", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  const preparedHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('footer [data-motion="unit"]')).toHaveCSS(
    "translate",
    "none",
  );
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    preparedHeight,
  );
});

test("resizing across 720px settles active motion without replaying visible targets", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => active(page, "#deployment li")).toBe(3);
  await page.setViewportSize({ width: 720, height: 1000 });
  await expect.poll(() => active(page, "#deployment li")).toBe(0);
  await page.setViewportSize({ width: 721, height: 1000 });
  await frames(page);
  expect(await count(page, "#deployment li")).toBe(3);
});

test("reduced motion at startup and during entry settles content and resumes only after exit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Sentinel home" }).first().focus();
  await frames(page);
  expect(await count(page, "[data-motion]")).toBe(0);
  await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-startup",
    "ready",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await frames(page);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => active(page, "#deployment li")).toBe(3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => active(page, "[data-motion]")).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await frames(page);
  expect(await count(page, "#deployment li")).toBe(3);
  await page.evaluate(() => window.scrollTo(0, 0));
  await frames(page);
  await position(page, "#deployment ol", 250);
  await expect.poll(() => count(page, "#deployment li")).toBe(6);
});

test("initial fragments, focus and fragment navigation immediately settle affected content", async ({
  page,
}) => {
  await page.goto("/#deployment");
  await frames(page);
  expect(await active(page, "#deployment [data-motion]")).toBe(0);
  await page.goto("/");
  await ready(page);
  await position(page, "#capabilities article:first-child", 250);
  await expect
    .poll(() => active(page, "#capabilities article:first-child"))
    .toBe(1);
  await page.locator("#capabilities article:first-child").focus();
  await expect(page.locator("#capabilities article:first-child")).toBeFocused();
  expect(await active(page, "#capabilities article:first-child")).toBe(0);
  await page.locator('footer a[href="/#deployment"]').click();
  await expect(page).toHaveURL(/#deployment$/);
  expect(await active(page, "#deployment [data-motion]")).toBe(0);
  await page.locator("#faq").evaluate((element) => {
    location.hash = element.id;
  });
  await expect.poll(() => active(page, "#faq [data-motion]")).toBe(0);
});

test("restored scroll positions keep visible content settled", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await position(page, "#deployment ol", 250);
  await finish(page);
  const previous = await page.evaluate(() => scrollY);
  await page.goto("/?restore-probe=1");
  await page.goBack();
  // Native history restoration can round by a pixel after compositing.
  await expect
    .poll(() =>
      page
        .evaluate((previous) => Math.abs(scrollY - previous), previous)
        .catch((error: Error) => {
          if (error.message.includes("Execution context was destroyed"))
            return Infinity;
          throw error;
        }),
    )
    .toBeLessThanOrEqual(2);
  await frames(page);
  expect(await active(page, "#deployment [data-motion]")).toBe(0);
});

test("hidden-document notification finishes active entrances", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  // Controlled visibility delivery exercises the listener in all three engines.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(await active(page, "[data-motion]")).toBe(0);
  await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
});

test("no-JavaScript landing targets retain complete static content", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const incomplete = await page
      .locator("[data-motion]")
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = getComputedStyle(element);
            return (
              style.opacity !== "1" ||
              style.translate !== "none" ||
              style.visibility !== "visible"
            );
          })
          .map((element) => element.textContent),
      );
    expect(incomplete).toEqual([]);
    await page.locator("#faq summary").first().click();
    await expect(page.locator("#faq details").first()).toHaveAttribute(
      "open",
      "",
    );
  } finally {
    await context.close();
  }
});

test("introductions use 650ms and 75ms spacing; coherent artwork preserves the mosaic transform", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await ready(page);
  await position(page, "#deployment", 100);
  await expect
    .poll(() => count(page, '#deployment [data-motion="intro"]'))
    .toBe(2);
  const introduction = await snapshot(
    page,
    '#deployment [data-motion="intro"]',
  );
  expect(introduction.map(({ duration, delay }) => [duration, delay])).toEqual([
    [650, 0],
    [650, 75],
  ]);
  await position(page, "#capabilities", 100);
  const mosaic = page.locator('#capabilities [data-motion="unit"]');
  await expect
    .poll(() => active(page, '#capabilities [data-motion="unit"]'))
    .toBe(1);
  const transform = await mosaic.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(
    await mosaic.evaluate(
      (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).b,
    ),
  ).not.toBe(0);
  await page.screenshot({ path: testInfo.outputPath("mosaic-entry.png") });
  await finish(page);
  await expect(mosaic).toHaveCSS("transform", transform);
  await expect(mosaic).toHaveCSS("translate", "none");
});

test("offscreen arrival is prepared before entry without a visible offset jump", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  const target = page.locator("#deployment li").first();
  await expect(target).toHaveCSS("opacity", "0");
  await expect(target).toHaveCSS("translate", "0px 48px");
  await position(page, "#deployment ol", 930);
  expect(await count(page, "#deployment li")).toBe(0);
  await position(page, "#deployment ol", 910);
  await expect.poll(() => count(page, "#deployment li")).toBe(3);
  await expect(target).toHaveCSS("translate", "0px 48px");
  await expect(target).toHaveCSS("opacity", "0");
});

test("short landscape viewports initialize normal motion without observer errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const viewport of [
    { width: 667, height: 375 },
    { width: 1024, height: 320 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect.poll(() => count(page, "#hero-heading")).toBe(1);
    await position(page, "#deployment ol", 100);
    await expect.poll(() => count(page, "#deployment li:first-child")).toBe(1);
  }
  expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
  test(`departing-edge exit at ${width}px fades out and recovers continuously on reversal`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await ready(page);
    const selector = "#deployment li:first-child";
    await position(page, "#deployment ol", 250);
    await expect.poll(() => count(page, selector)).toBe(1);
    await finish(page);
    const height = await page
      .locator(selector)
      .evaluate((element) => element.getBoundingClientRect().height);
    await position(page, "#deployment ol", 120 - height);
    await expect
      .poll(() =>
        page
          .locator(selector)
          .evaluate((element) =>
            element.getAnimations().some((a) => a.id === "sentinel-exit"),
          ),
      )
      .toBe(true);
    const middle = await page.locator(selector).evaluate((element) => {
      const animation = element
        .getAnimations()
        .find((a) => a.id === "sentinel-exit")!;
      animation.currentTime = 140;
      const style = getComputedStyle(element);
      const end = (animation.effect as KeyframeEffect).getKeyframes().at(-1)!;
      return {
        opacity: Number(style.opacity),
        translate: style.translate,
        end: end.translate,
        easing: animation.effect!.getTiming().easing,
      };
    });
    expect(middle.opacity).toBeGreaterThan(0);
    expect(middle.opacity).toBeLessThan(1);
    expect(middle.end).toBe(width === 390 ? "0px -18px" : "0px -32px");
    expect(middle.easing).toBe("cubic-bezier(0.4, 0, 1, 1)");
    await page.screenshot({
      path: testInfo.outputPath("exit-intermediate.png"),
    });
    await page.evaluate(() => window.scrollBy(0, -24));
    await frames(page);
    const recovered = await page.locator(selector).evaluate((element) => {
      const animation = element
        .getAnimations()
        .find((a) => a.id === "sentinel-recover")!;
      const start = (animation.effect as KeyframeEffect).getKeyframes()[0];
      return { opacity: Number(start.opacity), translate: start.translate };
    });
    expect(recovered.opacity).toBeCloseTo(middle.opacity, 3);
    expect(recovered.translate).toBe(middle.translate);
    expect(await count(page, selector)).toBe(1);
    await finish(page);
    await expect(page.locator(selector)).toHaveCSS("opacity", "1");
    await expect(page.locator(selector)).toHaveCSS("translate", "none");
  });
}
