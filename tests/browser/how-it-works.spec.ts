import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const headline =
  "More visibility into what is happening More precision on where to act";
const labels = ["Observe.", "Interpret.", "Flag.", "Review.", "Respond."];

async function controlledWorkflow(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Install before navigation so no native workflow timeout survives switching
  // to the controlled clock. Pause in the future to avoid a WebKit clock race.
  const now = new Date("2030-01-01T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 10_000));
  await page.goto("/#how-it-works");
  await page.clock.runFor(100);
  const workflow = page.locator("[data-workflow]");
  await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  await workflow.getByRole("button", { name: "Observe.", exact: true }).click();
  await page.mouse.move(0, 0);
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await page.mouse.move(0, 0);
  await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  return workflow;
}

test("automatic sequence follows all five stages with real reading holds", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  await workflow.getByRole("button", { name: "Observe.", exact: true }).click();
  await page.mouse.move(0, 0);
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await page.mouse.move(0, 0);
  await workflow.evaluate((el) => {
    const stages = [
      { name: el.getAttribute("data-active-step"), at: performance.now() },
    ];
    (window as unknown as { workflowStages: typeof stages }).workflowStages =
      stages;
    new MutationObserver(() => {
      const name = el.getAttribute("data-active-step");
      if (name !== stages.at(-1)?.name)
        stages.push({ name, at: performance.now() });
    }).observe(el, { attributes: true, attributeFilter: ["data-active-step"] });
  });
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (window as unknown as { workflowStages: unknown[] }).workflowStages
              .length,
        ),
      { timeout: 20_000 },
    )
    .toBeGreaterThanOrEqual(6);
  const stages = await page.evaluate(() =>
    (
      window as unknown as { workflowStages: { name: string; at: number }[] }
    ).workflowStages.slice(0, 6),
  );
  expect(stages.map((stage) => stage.name)).toEqual([
    "observe",
    "interpret",
    "flag",
    "review",
    "respond",
    "observe",
  ]);
  // Native browser time verifies the visible reading holds, allowing for input
  // setup and render latency rather than coupling React effects to fake frames.
  for (let index = 1; index < stages.length; index++) {
    expect(stages[index].at - stages[index - 1].at).toBeGreaterThan(2100);
    expect(stages[index].at - stages[index - 1].at).toBeLessThan(3000);
  }
});

test("pause/resume retains the interrupted reading hold", async ({ page }) => {
  const workflow = await controlledWorkflow(page);
  await page.clock.runFor(900);
  await workflow.getByRole("button", { name: "Pause sequence" }).click();
  await page.clock.runFor(10_000);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await page.clock.runFor(1400);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await page.clock.runFor(150);
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await expect(workflow.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(workflow.locator("[aria-live]")).toHaveCount(0);
});

test("focus overrides hover, previews restore held or interrupted automatic selection", async ({
  page,
}) => {
  const workflow = await controlledWorkflow(page);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  const interpret = workflow.getByRole("button", {
    name: "Interpret.",
    exact: true,
  });
  const review = workflow.getByRole("button", { name: "Review.", exact: true });
  await page.clock.runFor(900);
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-active-step", "flag");
  await page.clock.runFor(6000);
  await page.keyboard.press("Tab");
  await interpret.focus();
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await workflow.getByRole("button", { name: "Pause sequence" }).focus();
  await expect(workflow).toHaveAttribute("data-active-step", "flag");
  await page.mouse.move(0, 0);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await page.clock.runFor(1500);
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await review.focus();
  await review.press("Enter");
  await expect(review).toHaveAttribute("aria-pressed", "true");
  await page.clock.runFor(10_000);
  await expect(workflow).toHaveAttribute("data-active-step", "review");
  await interpret.focus();
  await interpret.press("Space");
  await expect(interpret).toHaveAttribute("aria-pressed", "true");
  await expect(review).toHaveAttribute("aria-pressed", "false");
  await workflow.getByRole("button", { name: "Resume sequence" }).focus();
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-active-step", "flag");
  await page.mouse.move(0, 0);
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await page.clock.runFor(2400);
  await expect(workflow).toHaveAttribute("data-active-step", "flag");
});

test("offscreen and controlled hidden-document delivery suspend the remaining hold", async ({
  page,
}) => {
  const workflow = await controlledWorkflow(page);
  await page.clock.runFor(1000);
  for (const reason of ["offscreen", "hidden"] as const) {
    if (reason === "offscreen") await page.evaluate(() => scrollTo(0, 0));
    else
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          value: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await page.clock.runFor(50);
    await expect(workflow).toHaveAttribute("data-sequence-running", "false");
    await page.clock.runFor(10_000);
    await expect(workflow).toHaveAttribute("data-active-step", "observe");
    if (reason === "offscreen") await workflow.scrollIntoViewIfNeeded();
    else
      await page.evaluate(() => {
        Reflect.deleteProperty(document, "hidden");
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await page.clock.runFor(50);
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  }
  await page.clock.runFor(1500);
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
});

test("latest pointer selection cancels obsolete accents, keyboard and reduced motion settle immediately", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const records: { target: Element; animation: Animation }[] = [];
    (window as unknown as { workflowEffects: typeof records }).workflowEffects =
      records;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args);
      if (
        this.matches(
          "[data-trace], [data-dot], [data-ring-accent], [data-rail-accent]",
        ) ||
        this.closest("[data-workflow] li")
      )
        records.push({ target: this, animation });
      return animation;
    };
  });
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  const respond = workflow.getByRole("button", {
    name: "Respond.",
    exact: true,
  });
  await flag.click({ force: true });
  await respond.click({ force: true });
  await page.mouse.move(0, 0);
  await expect(respond).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(() => {
      const records = (
        window as unknown as {
          workflowEffects: { target: Element; animation: Animation }[];
        }
      ).workflowEffects;
      return records
        .filter(({ target }) => target.matches('[data-trace="2"]'))
        .every(({ animation }) => animation.playState === "idle");
    }),
  ).toBe(true);
  const trace = workflow.locator('[data-trace="4"]');
  await expect
    .poll(() => trace.evaluate((el) => el.getAnimations().length))
    .toBe(1);
  const accents = workflow.locator(
    "[data-trace], [data-dot], [data-ring-accent], li span[aria-hidden]",
  );
  await accents.evaluateAll(async (els) => {
    const animations = els.flatMap((el) => el.getAnimations());
    animations.forEach((animation) => animation.pause());
    await Promise.all(animations.map((animation) => animation.ready));
    animations.forEach((animation) => (animation.currentTime = 200));
  });
  const intermediate = await trace.evaluate((el) =>
    parseFloat(getComputedStyle(el).strokeDashoffset),
  );
  expect(intermediate).toBeGreaterThan(0);
  expect(intermediate).toBeLessThan(1);
  await workflow.screenshot({
    path: testInfo.outputPath("workflow-intermediate-desktop.png"),
  });
  await accents.evaluateAll((els) =>
    els
      .flatMap((el) => el.getAnimations())
      .forEach((animation) => animation.finish()),
  );
  await expect(trace).toHaveCSS("stroke-dashoffset", "0px");
  await workflow.screenshot({
    path: testInfo.outputPath("workflow-settled-desktop.png"),
  });
  await page.keyboard.press("Tab");
  await flag.focus();
  await flag.press("Enter");
  await expect(flag).toBeFocused();
  expect(
    await workflow
      .locator("[data-trace], [data-dot], [data-ring-accent]")
      .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
  ).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    workflow.getByRole("button", { name: "Resume sequence" }),
  ).toBeDisabled();
  await expect(flag).toBeFocused();
  await expect(flag).toHaveAttribute("aria-pressed", "true");
  await respond.focus();
  await respond.press("Space");
  await expect(workflow).toHaveAttribute("data-active-step", "respond");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(respond).toBeFocused();
  await expect(respond).toHaveAttribute("aria-pressed", "true");
});

test("touch holds a mobile row without scrolling or changing geometry and preserves focus on resize", async ({
  browser,
  baseURL,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 1000 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/#how-it-works");
    const workflow = page.locator("[data-workflow]");
    const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
    await flag.scrollIntoViewIfNeeded();
    const before = await workflow.locator("li").evaluateAll((els) =>
      els.map((el) => {
        const box = el.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      }),
    );
    const scroll = await page.evaluate(() => scrollY);
    await flag.tap();
    await expect(flag).toHaveAttribute("aria-pressed", "true");
    await expect(workflow).toHaveAttribute("data-active-step", "flag");
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    expect(
      await workflow.locator("li").evaluateAll((els) =>
        els.map((el) => {
          const box = el.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        }),
      ),
    ).toEqual(before);
    await workflow.screenshot({
      path: testInfo.outputPath("workflow-mobile-selected.png"),
    });
    await page.clock.install();
    await page.clock.fastForward(10_000);
    await expect(workflow).toHaveAttribute("data-active-step", "flag");
    await flag.focus();
    for (const width of [720, 721, 1279, 1280, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(flag).toBeFocused();
      await expect(flag).toHaveAttribute("aria-pressed", "true");
      await expect(workflow).toHaveAttribute("data-active-step", "flag");
    }
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await workflow
        .locator("li")
        .evaluateAll((els) =>
          els.every(
            (el) =>
              el.scrollWidth <= el.clientWidth &&
              el.scrollHeight <= el.clientHeight,
          ),
        ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

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
    await expect(section.getByRole("button")).toHaveCount(6);
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
  await expect(section.getByRole("button")).toHaveCount(6);
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
  await expect(section.getByRole("button")).toHaveCount(6);
  await section.focus();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#how-cubeWrap")).toHaveCSS(
    "animation-play-state",
    "running",
  );
  await expect(section.getByRole("button")).toHaveCount(6);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).toBeFocused();
  expect(
    await artwork.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(section.getByRole("button")).toHaveCount(6);
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
    await expect(workflow.getByRole("button")).toHaveCount(6);
    const geometry = await workflow.locator("li").evaluateAll((rows) =>
      rows.map((row) => {
        const control = row.querySelector("button")!;
        const box = row.getBoundingClientRect();
        return {
          label: row.textContent,
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

test("workflow trace pauses in place while hidden and mobile rail has intermediate and settled poses", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  await workflow
    .getByRole("button", { name: "Respond.", exact: true })
    .click({ force: true });
  const trace = workflow.locator('[data-trace="4"]');
  await trace.evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    await animation.ready;
    animation.currentTime = 150;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => trace.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("paused");
  expect(
    await trace.evaluate(async (el) => {
      const animation = el.getAnimations()[0];
      const time = animation.currentTime;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      return animation.currentTime === time;
    }),
  ).toBe(true);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => trace.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("running");
  await expect
    .poll(() =>
      trace.evaluate((el) => el.getAnimations()[0]?.currentTime as number),
    )
    .toBeGreaterThan(150);
  await page.setViewportSize({ width: 390, height: 1000 });
  await workflow.scrollIntoViewIfNeeded();
  // Pointer selection restarts the mobile accent; capture the whole section so
  // its rail in the gutter is included, rather than clipping to the diagram.
  await workflow
    .getByRole("button", { name: "Observe.", exact: true })
    .click({ force: true });
  await workflow
    .getByRole("button", { name: "Review.", exact: true })
    .click({ force: true });
  await page.mouse.move(0, 0);
  const rail = workflow.locator("[data-rail-accent]");
  await rail.evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    await animation.ready;
    animation.currentTime = 200;
  });
  const before = await rail.evaluate((el) => getComputedStyle(el).transform);
  const railFrames = await rail.evaluate((el) =>
    (el.getAnimations()[0].effect as KeyframeEffect).getKeyframes(),
  );
  await page.screenshot({
    path: testInfo.outputPath("workflow-intermediate-mobile.png"),
  });
  await rail.evaluate((el) => el.getAnimations()[0].finish());
  const after = await rail.evaluate((el) => getComputedStyle(el).transform);
  expect(before, JSON.stringify(railFrames)).not.toBe(after);
  expect(
    await rail.evaluate((el) => {
      const accent = el.getBoundingClientRect();
      const row = document
        .querySelector('[data-workflow] li[data-active="true"]')!
        .getBoundingClientRect();
      return Math.abs(accent.y + accent.height / 2 - row.y - row.height / 2);
    }),
  ).toBeLessThan(1);
  await page
    .locator("#how-it-works")
    .screenshot({ path: testInfo.outputPath("workflow-settled-mobile.png") });
});
