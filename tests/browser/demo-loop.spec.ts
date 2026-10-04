import { expect, test, type Locator, type Page } from "@playwright/test";

const progress = (player: Locator) =>
  player.locator('[class*="progress"] > span');
const sample = (player: Locator) =>
  progress(player).evaluate(async (element) => {
    // Wait for the compositor to commit the pause before reading its hold time.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    const animation = element.getAnimations()[0];
    return {
      time: Number(animation?.currentTime ?? 0),
      state: animation?.playState,
      duration: animation?.effect?.getTiming().duration,
      scale: new DOMMatrixReadOnly(getComputedStyle(element).transform).m11,
    };
  });
async function finishPhase(player: Locator) {
  // Check readiness and finish in one browser call so a natural completion cannot race it.
  await expect
    .poll(() =>
      progress(player).evaluate((element) => {
        const animation = element.getAnimations()[0];
        if (!animation) return false;
        animation.finish();
        return true;
      }),
    )
    .toBe(true);
}
async function documentHidden(page: Page, hidden: boolean) {
  // Controlled visibility events exercise the handler, not native OS suspension.
  await page.evaluate((value) => {
    if (value)
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
    else Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}
async function expectSimplifiedDemo(player: Locator) {
  await expect(player.getByRole("button")).toHaveCount(0);
  await expect(
    player.locator("a, [tabindex], [aria-live], [aria-pressed]"),
  ).toHaveCount(0);
  for (const text of [
    "Clip saved",
    "Screenshot available",
    "Alert sent to configured recipients",
    "Example outcomes shown for demonstration.",
    "Human review remains central.",
    "Export event report",
    "Illustrative demo · not a live feed",
  ])
    await expect(player.getByText(text, { exact: true })).toHaveCount(0);
  await expect(
    player.getByRole("list", { name: "Demo stages" }).locator("li"),
  ).toHaveCount(3);
}

test("demo autoplays on entry and repeats with a two-second final hold", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const player = page.locator("#product-demo [data-step]");
  await expect(player).toHaveAttribute("data-playing", "false");
  expect((await sample(player)).time).toBe(0);
  // Record actual completion events so slow host polling cannot miss the short hold.
  // No finish() calls or synthetic events drive these two natural cycles.
  await player.evaluate((element) => {
    type Completion = {
      phase: string;
      elapsed: number;
      at: number;
      step: string;
    };
    const root = element as HTMLElement & { demoCompletions: Completion[] };
    root.demoCompletions = [];
    root.addEventListener(
      "animationend",
      (event) => {
        const animation = event as AnimationEvent;
        if (
          !(animation.target as Element).matches('[class*="progress"] > span')
        )
          return;
        root.demoCompletions.push({
          phase: root.dataset.phase!,
          elapsed: animation.elapsedTime,
          at: performance.now(),
          step: root.dataset.step!,
        });
      },
      true,
    );
  });
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-playing", "true");
  await expect(player).toHaveAttribute("data-step", "0");
  await expectSimplifiedDemo(player);
  await expect
    .poll(
      () =>
        player.evaluate(
          (element) =>
            (element as HTMLElement & { demoCompletions: unknown[] })
              .demoCompletions.length,
        ),
      { timeout: 45_000 },
    )
    .toBe(8);
  const completions = await player.evaluate(
    (element) =>
      (
        element as HTMLElement & {
          demoCompletions: {
            phase: string;
            elapsed: number;
            at: number;
            step: string;
          }[];
        }
      ).demoCompletions,
  );
  expect(completions.map((event) => event.phase)).toEqual([
    "0",
    "1",
    "2",
    "hold",
    "0",
    "1",
    "2",
    "hold",
  ]);
  for (const [index, event] of completions.entries()) {
    expect(event.elapsed).toBeCloseTo(event.phase === "hold" ? 2 : 3.6, 2);
    if (event.phase === "hold") {
      expect(event.step).toBe("2");
      expect(event.at - completions[index - 1].at).toBeGreaterThanOrEqual(1900);
    }
  }
  await expect(player).toHaveAttribute("data-phase", "0");
});

test("stage and final hold suspend offscreen and in hidden documents without resetting", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#product-demo");
  const player = page.locator("#product-demo [data-step]");
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-playing", "true");
  for (const phase of ["0", "hold"]) {
    await expect(player).toHaveAttribute("data-phase", phase);
    await expect
      .poll(() => sample(player).then((s) => s.time))
      .toBeGreaterThan(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(player).toHaveAttribute("data-playing", "false");
    await expect.poll(() => sample(player).then((s) => s.state)).toBe("paused");
    const offscreen = await sample(player);
    await page.waitForTimeout(250);
    // WebKit's compositor can commit one last frame after the CSS pause request.
    expect(Math.abs((await sample(player)).time - offscreen.time)).toBeLessThan(
      25,
    );
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("data-playing", "true");
    await expect
      .poll(() => sample(player).then((s) => s.time))
      .toBeGreaterThan(offscreen.time);

    await documentHidden(page, true);
    await expect(player).toHaveAttribute("data-playing", "false");
    await expect.poll(() => sample(player).then((s) => s.state)).toBe("paused");
    const hidden = await sample(player);
    await page.waitForTimeout(250);
    expect(Math.abs((await sample(player)).time - hidden.time)).toBeLessThan(
      25,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await documentHidden(page, false);
    await expect(player).toHaveAttribute("data-playing", "false");
    expect(Math.abs((await sample(player)).time - hidden.time)).toBeLessThan(
      25,
    );
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("data-playing", "true");
    await expect
      .poll(() => sample(player).then((s) => s.time))
      .toBeGreaterThan(hidden.time);
    if (phase === "0") {
      for (const next of ["1", "2", "hold"]) {
        await finishPhase(player);
        await expect(player).toHaveAttribute("data-phase", next);
      }
    }
  }
  // Let the resumed hold complete naturally; it may already be done on a slow host.
  await expect(player).toHaveAttribute("data-phase", "0");
});

test("reduced motion shows static review and normal motion restarts at stage one", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#product-demo");
  const player = page.locator("#product-demo [data-step]");
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-phase", "static");
  await expect(player).toHaveAttribute("data-step", "2");
  await expect(player).toHaveAttribute("data-playing", "false");
  await expectSimplifiedDemo(player);
  expect(
    await player.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  for (const stopAt of ["1", "hold"]) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(player).toHaveAttribute("data-phase", "0");
    await expect(player).toHaveAttribute("data-playing", "true");
    for (const next of stopAt === "1" ? ["1"] : ["1", "2", "hold"]) {
      await finishPhase(player);
      await expect(player).toHaveAttribute("data-phase", next);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(player).toHaveAttribute("data-phase", "static");
    await expect(player).toHaveAttribute("data-step", "2");
    expect(
      await player.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
  }
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    // Allow the offscreen observer to commit before re-enabling playback.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(player).toHaveAttribute("data-phase", "0");
  await expect(player).toHaveAttribute("data-playing", "false");
  expect((await sample(player)).time).toBe(0);
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-playing", "true");
});

test("desktop and mobile demo preserve imagery and details through every stage", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const player = page.locator("#product-demo [data-step]");
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("data-playing", "true");
    await expectSimplifiedDemo(player);
    for (const phase of ["0", "1", "2", "hold"]) {
      await expect(player).toHaveAttribute("data-phase", phase);
      // Freeze through the real visibility handler while reviewing a known phase.
      // A running two-second hold can complete while screenshot stabilization waits.
      await documentHidden(page, true);
      await expect(player).toHaveAttribute("data-playing", "false");
      await expect
        .poll(() => sample(player).then((s) => s.state))
        .toBe("paused");
      const layout = await player.evaluate((element) => {
        const card = element.querySelector('[class*="dashboard"]')!;
        const bar = card.querySelector('[class*="progress"]')!;
        const header = card.querySelector('[class*="dashboardHeader"]')!;
        const cardBox = card.getBoundingClientRect();
        const barBox = bar.getBoundingClientRect();
        const headerBox = header.getBoundingClientRect();
        return {
          marginTop: getComputedStyle(element).marginTop,
          topInset: barBox.top - cardBox.top,
          borderTop: parseFloat(getComputedStyle(card).borderTopWidth),
          headerGap: headerBox.top - barBox.bottom,
          height: barBox.height,
          width: barBox.width,
          contentWidth:
            cardBox.width -
            parseFloat(getComputedStyle(card).borderLeftWidth) -
            parseFloat(getComputedStyle(card).borderRightWidth),
        };
      });
      expect(layout.marginTop).toBe("40px");
      expect(layout.topInset).toBeCloseTo(layout.borderTop, 1);
      expect(layout.headerGap).toBeCloseTo(0, 1);
      expect(layout.height).toBe(3);
      expect(layout.width).toBeCloseTo(layout.contentWidth, 1);
      const stage = phase === "hold" ? 2 : Number(phase);
      const title = [
        "The event is detected",
        "Sentinel analyses",
        "Review the event",
      ][stage];
      const indicators = player.getByRole("list", { name: "Demo stages" });
      await expect(indicators.locator('li[aria-current="step"]')).toHaveCount(
        1,
      );
      await expect(indicators.locator("li").nth(stage)).toHaveAttribute(
        "aria-current",
        "step",
      );
      await expect(
        player.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(
        player
          .locator("dl")
          .getByText(["Detected", "Analysing", "Review required"][stage], {
            exact: true,
          }),
      ).toBeVisible();
      await expect(player.locator("dl")).toContainText("Potential concealment");
      await expect(player.locator("dl")).toContainText("Aisle 4");
      await expect(player.locator("dl")).toContainText("14:32:07");
      await expect(player.locator("dl")).toContainText("88%");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator("#product-demo").screenshot({
        path: testInfo.outputPath(`demo-${width}-${phase}.png`),
      });
      await documentHidden(page, false);
      await expect(player).toHaveAttribute("data-playing", "true");
      await finishPhase(player);
    }
    await expect(player).toHaveAttribute("data-phase", "0");
  }
});
