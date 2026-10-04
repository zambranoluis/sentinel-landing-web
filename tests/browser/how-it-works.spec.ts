import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const headline =
  "More visibility into what is happening More precision on where to act";
const labels = ["Observe.", "Interpret.", "Flag.", "Review.", "Respond."];

test("workflow composition, assets and accessibility across responsive boundaries", async ({
  page,
}, testInfo) => {
  // Nine responsive navigations, captures and axe share one serial test.
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 720, 721, 834, 1279, 1280, 1440, 1910]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#how-it-works");
    const section = page.locator("#how-it-works");
    await expect(
      section.getByRole("heading", { name: headline }),
    ).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveText(labels);
    await expect(section.getByRole("button")).toHaveCount(5);
    await expect(section.getByText(/^(Pause|Resume) sequence$/)).toHaveCount(0);
    expect(
      await section
        .locator("[data-workflow]")
        .evaluate(
          (element) =>
            element.getBoundingClientRect().height -
            element.firstElementChild!.getBoundingClientRect().height,
        ),
    ).toBeCloseTo(0);
    expect(
      await section.locator("li span[aria-hidden]").evaluateAll((icons) =>
        icons.map((icon) => ({
          color: getComputedStyle(icon).color,
          ring: getComputedStyle(icon).borderTopColor,
          stroke: getComputedStyle(icon.querySelector("svg")!).stroke,
        })),
      ),
    ).toEqual(
      Array(5).fill({
        color: "rgb(5, 221, 241)",
        ring: "rgb(5, 221, 241)",
        stroke: "rgb(5, 221, 241)",
      }),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const items = await section.getByRole("listitem").evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return {
          x: box.x,
          right: box.right,
          y: box.y,
          bottom: box.bottom,
          fits:
            element.scrollWidth <= element.clientWidth &&
            element.scrollHeight <= element.clientHeight,
        };
      }),
    );
    expect(
      items.every((item) => item.x >= 0 && item.right <= width && item.fits),
    ).toBe(true);
    for (let i = 0; i < items.length; i++)
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i],
          b = items[j];
        expect(
          a.right <= b.x ||
            b.right <= a.x ||
            a.bottom <= b.y ||
            b.bottom <= a.y,
        ).toBe(true);
      }
    if ([390, 834, 1440, 1910].includes(width)) {
      await page.evaluate(() => document.fonts.ready);
      await section.screenshot({
        path: testInfo.outputPath(`section-${width}.png`),
      });
    }
  }
  expect(
    await page
      .locator("#how-it-works img")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .include("#how-it-works")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("cube automatically pauses in place offscreen and on hidden-document notifications", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#how-it-works");
  const section = page.locator("#how-it-works");
  const cube = page.locator("#how-cubeWrap");
  await expect(section.getByRole("button")).toHaveCount(5);
  const playState = () =>
    cube.evaluate((element) => getComputedStyle(element).animationPlayState);
  const time = () =>
    cube.evaluate(
      (element) => element.getAnimations()[0].currentTime as number,
    );
  await expect.poll(playState).toBe("running");
  const initial = await time();
  await expect.poll(time).toBeGreaterThan(initial + 50);

  for (const reason of ["offscreen", "hidden"] as const) {
    if (reason === "offscreen")
      await page.evaluate(() => window.scrollTo(0, 0));
    else
      await page.evaluate(() => {
        // Controlled visibility delivery exercises the browser-independent listener.
        Object.defineProperty(document, "hidden", {
          configurable: true,
          value: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await expect.poll(playState).toBe("paused");
    const paused = await section
      .locator('svg[class*="artwork"]')
      .evaluate(async (element) => {
        const animations = element.getAnimations({ subtree: true });
        await Promise.all(animations.map((animation) => animation.ready));
        return animations.map((animation) => animation.currentTime);
      });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    expect(
      await section
        .locator('svg[class*="artwork"]')
        .evaluate((element) =>
          element
            .getAnimations({ subtree: true })
            .map((animation) => animation.currentTime),
        ),
    ).toEqual(paused);
    const pausedAt = await time();
    if (reason === "offscreen") await section.scrollIntoViewIfNeeded();
    else
      await page.evaluate(() => {
        Reflect.deleteProperty(document, "hidden");
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await expect.poll(playState).toBe("running");
    await expect.poll(time).toBeGreaterThan(pausedAt);
  }
});

test("bottom halo follows lower propagation across two cycles and stays centered behind the faces", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#how-it-works");
  await expect(page.locator("#how-cubeWrap")).toHaveCSS(
    "animation-play-state",
    "running",
  );
  const section = page.locator("#how-it-works");
  const halo = page.locator("#how-halo");
  await expect(halo).toHaveCSS("animation-duration", "5.2s");
  await expect(halo).toHaveCSS("animation-delay", "0.7s");
  await expect(
    page.locator('#how-cubeWrap path[style*="lower-propagation-delay"]'),
  ).toHaveCount(2);
  expect(
    await halo.evaluate((element) => {
      const group = element.parentElement!;
      const wrap = document.querySelector("#how-cubeWrap")!;
      return {
        parent: group.parentElement?.id,
        mask: group.getAttribute("mask"),
        first: wrap.firstElementChild === group,
      };
    }),
  ).toEqual({
    parent: "how-cubeWrap",
    mask: "url(#how-haloMask)",
    first: true,
  });

  for (const cycle of [0, 5200]) {
    for (const [time, opacity] of [
      [0, 0],
      [700, 0],
      [1040, 0],
      [1220, 0],
      [1350, null],
      [1480, 0.18],
      [1740, 0.48],
      [2052, 0.16],
      [2468, 0],
      [5000, 0],
    ] as const) {
      await section.evaluate(async (element, time) => {
        const animations = element.getAnimations({ subtree: true });
        for (const animation of animations) animation.pause();
        await Promise.all(animations.map((animation) => animation.ready));
        for (const animation of animations) animation.currentTime = time;
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
      }, cycle + time);
      const sample = await halo.evaluate((element: SVGEllipseElement) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const center = new DOMPoint(450, 502).matrixTransform(
          (element.parentElement as unknown as SVGGElement).getScreenCTM()!,
        );
        const lower = document.querySelector(
          '#how-cubeWrap path[style*="lower-propagation-delay"]',
        )!;
        return {
          opacity: Number(style.opacity),
          lowerOpacity: Number(getComputedStyle(lower).opacity),
          dx: Math.abs(box.x + box.width / 2 - center.x),
          dy: Math.abs(box.y + box.height / 2 - center.y),
        };
      });
      if (opacity === null) {
        expect(sample.opacity).toBeGreaterThan(0);
        expect(sample.opacity).toBeLessThan(0.18);
        expect(sample.lowerOpacity).toBeGreaterThan(0);
      } else expect(sample.opacity).toBeCloseTo(opacity, 3);
      expect(sample.dx).toBeLessThan(0.5);
      expect(sample.dy).toBeLessThan(0.5);
      if (time === 1740) expect(sample.lowerOpacity).toBeCloseTo(1, 3);
      if (
        (cycle === 0 && [1040, 1350, 1740, 2052].includes(time)) ||
        (cycle === 5200 && time === 1740)
      )
        await section.screenshot({
          path: testInfo.outputPath(`halo-${cycle + time}.png`),
        });
    }
  }
});

test("reduced motion is static and preference changes preserve section focus with workflow controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#how-it-works");
  const section = page.locator("#how-it-works");
  const artwork = section.locator('svg[class*="artwork"]');
  expect(
    await artwork.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(section.getByRole("button")).toHaveCount(5);
  await section.focus();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#how-cubeWrap")).toHaveCSS(
    "animation-play-state",
    "running",
  );
  await expect(section.getByRole("button")).toHaveCount(5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).toBeFocused();
  expect(
    await artwork.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(section.getByRole("button")).toHaveCount(5);
});

test("mobile and footer links reach the section with keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const link = page
    .getByRole("navigation", { name: "Primary mobile", exact: true })
    .getByRole("link", { name: "How it works" });
  await link.focus();
  await link.press("Enter");
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.locator("#mobile-navigation")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator("#how-it-works")).toBeFocused();
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "How it works" })
    .click();
  await expect(page.locator("#how-it-works")).toBeInViewport();
});

test("workflow remains readable without JavaScript and with enlarged text", async ({
  browser,
  baseURL,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("/#how-it-works");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  const section = page.locator("#how-it-works");
  await expect(section.getByRole("listitem")).toHaveText(labels);
  await expect(section.locator("svg").first()).toBeAttached();
  await expect(section.getByRole("button")).toHaveCount(0);
  const artwork = section.locator('svg[class*="artwork"]');
  const times = await artwork.evaluate((element) =>
    element
      .getAnimations({ subtree: true })
      .map((animation) => animation.currentTime),
  );
  // Page-script callbacks are disabled here; capture a later rendered frame
  // before comparing timelines instead of awaiting animation.ready or rAF.
  await section.screenshot({
    path: testInfo.outputPath("static-enlarged-text.png"),
  });
  expect(
    await artwork.evaluate((element, times) => {
      const animations = element.getAnimations({ subtree: true });
      return animations.every(
        (animation, index) =>
          animation.playState === "paused" &&
          animation.currentTime === times[index],
      );
    }, times),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await section
      .getByRole("listitem")
      .evaluateAll((items) =>
        items.every(
          (item) =>
            item.scrollWidth <= item.clientWidth &&
            item.scrollHeight <= item.clientHeight,
        ),
      ),
  ).toBe(true);
  await context.close();
});

test("enlarged workflow text stays inside controls at mobile, tablet and desktop", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#how-it-works");
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  for (const width of [320, 720, 721, 834, 1279, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const workflow = page.locator("[data-workflow]");
    await expect(workflow.getByRole("button")).toHaveCount(5);
    const geometry = await workflow.locator("li").evaluateAll((rows) =>
      rows.map((row) => {
        const control = row.querySelector("button")!;
        const box = row.getBoundingClientRect();
        return {
          label: row.textContent,
          dimensions: [
            row.clientWidth,
            row.scrollWidth,
            row.clientHeight,
            row.scrollHeight,
            control.clientWidth,
            control.scrollWidth,
            control.clientHeight,
            control.scrollHeight,
          ],
          fits:
            row.scrollWidth <= row.clientWidth &&
            row.scrollHeight <= row.clientHeight &&
            control.scrollWidth <= control.clientWidth &&
            control.scrollHeight <= control.clientHeight,
          x: box.x,
          right: box.right,
        };
      }),
    );
    expect(geometry, `enlarged text at ${width}px`).toEqual(
      geometry.map((row) => ({ ...row, fits: true })),
    );
    expect(geometry.every((row) => row.x >= 0 && row.right <= width)).toBe(
      true,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

for (const mode of ["reduced motion", "no JavaScript"] as const) {
  test(`automatic-only workflow has no playback labels or reserved space with ${mode}`, async ({
    browser,
    baseURL,
  }) => {
    test.setTimeout(90_000);
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: mode !== "no JavaScript",
      reducedMotion: mode === "reduced motion" ? "reduce" : "no-preference",
    });
    try {
      const page = await context.newPage();
      for (const width of [320, 390, 720, 721, 834, 1279, 1280, 1440, 1910]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("/#how-it-works");
        const workflow = page.locator("[data-workflow]");
        await expect(workflow.getByRole("listitem")).toHaveText(labels);
        await expect(workflow.getByRole("button")).toHaveCount(
          mode === "no JavaScript" ? 0 : 5,
        );
        await expect(
          workflow.getByText(/^(Pause|Resume) sequence$/),
        ).toHaveCount(0);
        await expect(workflow).toHaveAttribute(
          "data-sequence-running",
          "false",
        );
        expect(
          await workflow.evaluate(
            (element) =>
              element.getBoundingClientRect().height -
              element.firstElementChild!.getBoundingClientRect().height,
          ),
        ).toBeCloseTo(0);
      }
    } finally {
      await context.close();
    }
  });
}
