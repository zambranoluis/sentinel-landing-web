import { expect, test, type Page } from "@playwright/test";
import {
  prepareMotion,
  ready,
  count,
  finish,
  frames,
} from "./landing-motion-helpers";

// These captures intentionally show pending fonts. Playwright's default font
// readiness wait would consume the startup watchdog before taking the image.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

declare global {
  interface Window {
    fontRequests: string[];
    earlyEntrances: string[];
  }
}

async function observeFonts(page: Page) {
  await page.addInitScript(() => {
    window.fontRequests = [];
    window.earlyEntrances = [];
    const load = FontFaceSet.prototype.load;
    FontFaceSet.prototype.load = function (font, text) {
      window.fontRequests.push(font);
      return load.call(this, font, text);
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (
        this.matches("[data-motion]") &&
        [400, 500, 700].some(
          (weight) => !document.fonts.check(`${weight} 16px Roboto`),
        )
      )
        window.earlyEntrances.push(this.textContent ?? "");
      return animate.call(this, frames, options);
    };
  });
}

async function staticContent(page: Page) {
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-startup",
    "static",
  );
  expect(
    await page.locator("[data-motion]").evaluateAll((elements) =>
      elements.every((element) => {
        const style = getComputedStyle(element);
        return style.opacity === "1" && style.translate === "none";
      }),
    ),
  ).toBe(true);
  expect(await count(page, "[data-motion]")).toBe(0);
}

test.beforeEach(async ({ page }) => {
  await prepareMotion(page, true, page.viewportSize()!);
  await observeFonts(page);
});

for (const width of [1440, 390]) {
  test.describe(`startup viewport ${width}px`, () => {
    // Create the capture surface at its final size, including WebKit's 2x DPR.
    test.use({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    test(`delayed hydration keeps information hidden with navigation and artwork visible at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route("**/*", async (route) => {
        if (route.request().resourceType() === "script") await gate;
        await route.continue();
      });
      try {
        await page.goto("/", { waitUntil: "commit" });
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
        expect(
          await page
            .locator("[data-motion]")
            .evaluateAll((elements) =>
              elements.every(
                (element) => getComputedStyle(element).opacity === "0",
              ),
            ),
        ).toBe(true);
        await expect(page.locator("#top")).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Sentinel home" }).first(),
        ).toBeVisible();
        if (width === 390)
          await expect(
            page.getByRole("button", { name: "Menu", exact: true }),
          ).toBeVisible();
        else
          await expect(
            page.getByRole("navigation", { name: "Primary", exact: true }),
          ).toBeVisible();
        await expect(
          page.locator('section[aria-labelledby="hero-heading"] img'),
        ).toBeVisible();
        const height = await page
          .locator("#hero-heading")
          .evaluate((element) => element.getBoundingClientRect().height);
        expect(height).toBeGreaterThan(100);
        await page.screenshot({
          path: testInfo.outputPath("delayed-js-initial.png"),
        });
        release();
        await ready(page);
        expect(await page.evaluate(() => window.earlyEntrances)).toEqual([]);
        await finish(page);
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
      } finally {
        release();
      }
    });

    test(`delayed Roboto prevents entrances at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(/\.woff2?(\?|$)/, async (route) => {
        await gate;
        await route.continue();
      });
      try {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect
          .poll(() => page.evaluate(() => new Set(window.fontRequests).size))
          .toBe(3);
        expect(await page.evaluate(() => window.fontRequests)).toEqual(
          expect.arrayContaining([
            "400 16px Roboto",
            "500 16px Roboto",
            "700 16px Roboto",
          ]),
        );
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
        expect(await count(page, "[data-motion]")).toBe(0);
        await page.screenshot({
          path: testInfo.outputPath("delayed-font-initial.png"),
        });
        release();
        await ready(page);
        expect(await page.evaluate(() => window.earlyEntrances)).toEqual([]);
        await page.evaluate(() => {
          for (const { animation } of window.entrances) {
            animation.currentTime =
              (animation.effect!.getTiming().delay ?? 0) + 100;
          }
        });
        await frames(page);
        const opacity = await page
          .locator("#hero-heading")
          .evaluate((element) => Number(getComputedStyle(element).opacity));
        expect(opacity).toBeGreaterThan(0);
        expect(opacity).toBeLessThan(1);
        await page.screenshot({
          path: testInfo.outputPath("delayed-font-intermediate.png"),
        });
        await finish(page);
        await page.screenshot({
          path: testInfo.outputPath("delayed-font-settled.png"),
        });
      } finally {
        release();
      }
    });

    test(`cold and warm cache startup at ${width}px has no visible handoff frame`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      // Keep network caching enabled. Delay only completion of the native font
      // promises so each real cache path can be captured before controller handoff.
      await page.addInitScript(() => {
        const load = FontFaceSet.prototype.load;
        const gate = new Promise<void>((resolve) =>
          window.addEventListener("test-font-release", () => resolve(), {
            once: true,
          }),
        );
        FontFaceSet.prototype.load = async function (font, text) {
          const faces = await load.call(this, font, text);
          await gate;
          return faces;
        };
      });
      for (const cache of ["cold", "warm"]) {
        if (cache === "cold")
          await page.goto("/", { waitUntil: "domcontentloaded" });
        else await page.reload({ waitUntil: "domcontentloaded" });
        await expect
          .poll(() => page.evaluate(() => new Set(window.fontRequests).size))
          .toBe(3);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
        const layout = await page
          .locator("#hero-heading")
          .evaluate((element) => ({
            top: element.getBoundingClientRect().top,
            height: element.getBoundingClientRect().height,
            scroll: scrollY,
          }));
        await page.screenshot({
          path: testInfo.outputPath(`${cache}-initial.png`),
        });
        await page.evaluate(() =>
          window.dispatchEvent(new Event("test-font-release")),
        );
        await ready(page);
        // Paused entrances retain their first frame after bootstrap CSS is gone.
        await expect(page.locator("html")).toHaveAttribute(
          "data-motion-startup",
          "ready",
        );
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
        await page.evaluate(() =>
          window.entrances.forEach(({ animation }) => {
            animation.currentTime =
              (animation.effect!.getTiming().delay ?? 0) + 100;
          }),
        );
        await frames(page);
        await page.screenshot({
          path: testInfo.outputPath(`${cache}-intermediate.png`),
        });
        await finish(page);
        await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
        const settled = await page
          .locator("#hero-heading")
          .evaluate((element) => ({
            top: element.getBoundingClientRect().top,
            height: element.getBoundingClientRect().height,
            scroll: scrollY,
          }));
        expect(settled).toEqual(layout);
        await page.screenshot({
          path: testInfo.outputPath(`${cache}-settled.png`),
        });
        expect(await page.evaluate(() => window.earlyEntrances)).toEqual([]);
      }
    });
  });
}

test("font failure releases every target as static content", async ({
  page,
}) => {
  await page.route(/\.woff2?(\?|$)/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await staticContent(page);
});

for (const stalled of ["fonts", "scripts"]) {
  test(`${stalled} watchdog releases by four seconds and ignores late completion`, async ({
    page,
  }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/*", async (route) => {
      const type = route.request().resourceType();
      if (type === (stalled === "fonts" ? "font" : "script")) await gate;
      await route.continue();
    });
    try {
      await page.goto("/", { waitUntil: "commit" });
      await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
      await expect(page.locator("html")).toHaveAttribute(
        "data-motion-startup",
        "static",
        { timeout: 4500 },
      );
      expect(await page.evaluate(() => performance.now())).toBeLessThan(5000);
      release();
      await page.waitForLoadState("load");
      await page.evaluate(() => document.fonts.ready);
      await frames(page);
      await staticContent(page);
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      );
      await frames(page);
      await staticContent(page);
    } finally {
      release();
    }
  });
}

test("blocked hydration scripts recover without controller assistance", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    route.request().resourceType() === "script"
      ? route.abort()
      : route.continue(),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
  await staticContent(page);
});

for (const bypass of [
  "reduced motion",
  "keyboard focus",
  "fragment",
  "restored view",
]) {
  test(`${bypass} is immediately visible while fonts are pending`, async ({
    page,
  }) => {
    await page.route(/\.woff2?(\?|$)/, (route) => route.abort());
    // Hold the controller promises so font rejection cannot supply visibility.
    await page.addInitScript(() => {
      FontFaceSet.prototype.load = () => new Promise(() => {});
    });
    if (bypass === "reduced motion")
      await page.emulateMedia({ reducedMotion: "reduce" });
    if (bypass === "restored view")
      await page.addInitScript(() => {
        const entries = performance.getEntriesByType.bind(performance);
        performance.getEntriesByType = (type) =>
          type === "navigation"
            ? [{ type: "back_forward" } as PerformanceNavigationTiming]
            : entries(type);
      });
    await page.goto(bypass === "fragment" ? "/#deployment" : "/", {
      waitUntil: "domcontentloaded",
    });
    if (bypass === "keyboard focus") {
      await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
      await page.keyboard.press("Tab");
    }
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion-startup",
      "bypass",
    );
    expect(await count(page, "[data-motion]")).toBe(0);
    await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
    if (bypass === "fragment")
      await expect(page.locator("#deployment h2")).toHaveCSS("opacity", "1");
  });
}

for (const interaction of ["focus", "reduced motion", "fragment"]) {
  test(`startup ${interaction} bypass cannot replay when fonts complete`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const load = FontFaceSet.prototype.load;
      const gate = new Promise<void>((resolve) =>
        window.addEventListener("test-font-release", () => resolve(), {
          once: true,
        }),
      );
      FontFaceSet.prototype.load = async function (font, text) {
        const faces = await load.call(this, font, text);
        await gate;
        return faces;
      };
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect
      .poll(() => page.evaluate(() => new Set(window.fontRequests).size))
      .toBe(3);
    await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "0");
    if (interaction === "focus") await page.keyboard.press("Tab");
    else if (interaction === "reduced motion")
      await page.emulateMedia({ reducedMotion: "reduce" });
    else
      await page.evaluate(() => {
        location.hash = "deployment";
      });
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion-startup",
      "bypass",
    );
    await page.evaluate(() =>
      window.dispatchEvent(new Event("test-font-release")),
    );
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion-startup",
      "ready",
    );
    await frames(page);
    expect(await count(page, "[data-motion]")).toBe(0);
    const selector =
      interaction === "fragment" ? "#deployment h2" : "#hero-heading";
    await expect(page.locator(selector)).toHaveCSS("opacity", "1");
  });
}
