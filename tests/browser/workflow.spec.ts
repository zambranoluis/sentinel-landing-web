import { expect, test, type Page, type Locator } from "@playwright/test";

const stages = ["observe", "interpret", "flag", "review", "respond"];
const motion =
  "[data-ring-accent], [data-trace], [data-dot], [data-card-accent], [data-step-icon], [data-rail-accent]";

async function controlledWorkflow(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const now = new Date("2030-01-01T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 10_000));
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  await expect(workflow).toHaveAttribute("data-phase", "hold");
  return workflow;
}

async function freeze(workflow: Locator) {
  await workflow.locator(motion).evaluateAll(async (elements) => {
    const animations = elements.flatMap((element) => element.getAnimations());
    animations.forEach((animation) => animation.pause());
    await Promise.all(animations.map((animation) => animation.ready));
    animations.forEach((animation) => {
      animation.currentTime = 150;
    });
  });
}

async function finish(workflow: Locator, next: string) {
  await workflow.locator(motion).evaluateAll((elements) => {
    elements
      .flatMap((element) => element.getAnimations())
      .forEach((animation) => animation.finish());
  });
  await expect(workflow).toHaveAttribute("data-phase", next);
}

for (const width of [834, 1440]) {
  test(`workflow native five-card loop and reading holds at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      const records: { stage: string; phase: string; at: number }[] = [];
      (window as unknown as { phases: typeof records }).phases = records;
      new MutationObserver(() => {
        const root = document.querySelector<HTMLElement>("[data-workflow]");
        if (!root?.dataset.activeStep) return;
        const { activeStep: stage, phase } = root.dataset;
        if (
          !phase ||
          (records.at(-1)?.stage === stage && records.at(-1)?.phase === phase)
        )
          return;
        records.push({ stage, phase, at: performance.now() });
      }).observe(document, {
        subtree: true,
        attributes: true,
        childList: true,
        attributeFilter: ["data-active-step", "data-phase"],
      });
    });
    await page.goto("/#how-it-works");
    await expect
      .poll(
        () =>
          page.evaluate(
            () => (window as unknown as { phases: unknown[] }).phases.length,
          ),
        { timeout: 20_000 },
      )
      .toBeGreaterThanOrEqual(21);
    const records = await page.evaluate(() =>
      (
        window as unknown as {
          phases: { stage: string; phase: string; at: number }[];
        }
      ).phases.slice(0, 21),
    );
    expect(
      records
        .filter((record) => record.phase === "hold")
        .map((record) => record.stage),
    ).toEqual([...stages, "observe"]);
    expect(records.map((record) => record.phase)).toEqual([
      "hold",
      ...Array(5).fill(["circles", "connector", "card", "hold"]).flat(),
    ]);
    for (let index = 1; index < records.length; index++) {
      const previous = records[index - 1];
      const duration = { hold: 1000, circles: 700, connector: 500, card: 200 }[
        previous.phase
      ]!;
      // The first hold begins only when visibility is delivered after hydration.
      expect(records[index].at - previous.at).toBeGreaterThan(duration - 80);
      expect(records[index].at - previous.at).toBeLessThan(duration + 500);
    }
  });

  test(`workflow circles align with each outward connector before card feedback at ${width}px`, async ({
    page,
  }, testInfo) => {
    const workflow = await controlledWorkflow(page, width);
    await expect(workflow).toHaveAttribute("data-active-step", "observe");
    await page.clock.runFor(900);
    await expect(workflow).toHaveAttribute("data-phase", "hold");
    await page.clock.runFor(150);
    for (const index of [1, 2, 3, 4, 0]) {
      await expect(workflow).toHaveAttribute("data-phase", "circles");
      await freeze(workflow);
      await expect(workflow).toHaveAttribute(
        "data-active-step",
        stages[(index + 4) % 5],
      );
      const geometry = await workflow.evaluate((root, index) => {
        const path = root.querySelector<SVGPathElement>(
          `[data-trace="${index}"]`,
        )!;
        const start = path.getPointAtLength(0);
        const end = path.getPointAtLength(path.getTotalLength());
        const angle = Math.atan2(end.y - 357, end.x - 410) / (2 * Math.PI);
        const rings = Array.from(
          root.querySelectorAll("[data-ring-accent]"),
        ).map((ring) => {
          const effect = ring.getAnimations()[0].effect as KeyframeEffect;
          const frames = effect.getKeyframes();
          return {
            offset: parseFloat(String(frames[1].strokeDashoffset)),
            duration: effect.getTiming().duration,
          };
        });
        return {
          rings,
          angle,
          startDistance: Math.hypot(start.x - 410, start.y - 357),
          endDistance: Math.hypot(end.x - 410, end.y - 357),
          traces: root
            .querySelectorAll(`[data-trace="${index}"]`)[0]
            .getAnimations().length,
        };
      }, index);
      expect(geometry.endDistance).toBeGreaterThan(geometry.startDistance);
      expect(geometry.traces).toBe(0);
      for (const ring of geometry.rings) {
        expect(ring.duration).toBe(700);
        expect(-ring.offset + 0.03).toBeCloseTo(geometry.angle, 5);
      }
      if (index === 1) {
        await workflow.locator("[data-ring-accent]").evaluateAll((rings) => {
          rings.forEach((ring) => {
            ring.getAnimations()[0].currentTime = 385;
          });
        });
        for (const ring of await workflow.locator("[data-ring-accent]").all()) {
          await expect(ring).toHaveCSS("opacity", "0.8");
        }
        await workflow.screenshot({
          path: testInfo.outputPath(`circles-${width}.png`),
        });
      }
      await finish(workflow, "connector");
      await freeze(workflow);
      const trace = workflow.locator(`[data-trace="${index}"]`);
      const sample = await trace.evaluate((element) => ({
        offset: parseFloat(getComputedStyle(element).strokeDashoffset),
        duration: element.getAnimations()[0].effect!.getTiming().duration,
      }));
      expect(sample.duration).toBe(500);
      expect(sample.offset).toBeGreaterThan(0);
      expect(sample.offset).toBeLessThan(1);
      await expect(workflow).toHaveAttribute(
        "data-active-step",
        stages[(index + 4) % 5],
      );
      if (index === 1)
        await workflow.screenshot({
          path: testInfo.outputPath(`connector-${width}.png`),
        });
      await finish(workflow, "card");
      await freeze(workflow);
      await expect(workflow).toHaveAttribute("data-active-step", stages[index]);
      const card = workflow
        .locator("li")
        .nth(index)
        .locator("[data-card-accent]");
      expect(
        await card.evaluate(
          (element) => element.getAnimations()[0].effect!.getTiming().duration,
        ),
      ).toBe(200);
      await finish(workflow, "hold");
      await expect(card).toHaveCSS("opacity", "1");
      if (index === 1)
        await workflow.screenshot({
          path: testInfo.outputPath(`card-${width}.png`),
        });
      await page.clock.runFor(900);
      await expect(workflow).toHaveAttribute("data-phase", "hold");
      await page.clock.runFor(150);
    }
  });
}

test("workflow hover remains additive across multiple automatic transitions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  const respond = workflow.getByRole("button", {
    name: "Respond.",
    exact: true,
  });
  await respond.hover();
  for (const stage of ["interpret", "flag", "review"]) {
    await expect(workflow).toHaveAttribute("data-active-step", stage, {
      timeout: 5000,
    });
    await expect(workflow).toHaveAttribute("data-feedback-step", "respond");
    await expect(workflow.locator('[data-feedback-trace="4"]')).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(
      workflow.locator("li[data-active=true] [data-card-accent]"),
    ).toHaveCSS("opacity", "1");
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  }
  await page.mouse.move(0, 0);
  await expect(workflow).not.toHaveAttribute("data-feedback-step");
  await expect(workflow.locator('[data-feedback-trace="4"]')).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(
    workflow.locator("li[data-active=true] [data-card-accent]"),
  ).toHaveCSS("opacity", "1");
});

test("workflow focus precedence, rapid pointers and 700ms activation never replace automatic effects", async ({
  page,
}) => {
  const workflow = await controlledWorkflow(page);
  await page.clock.runFor(1050);
  await expect(workflow).toHaveAttribute("data-phase", "circles");
  await freeze(workflow);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  const review = workflow.getByRole("button", { name: "Review.", exact: true });
  await workflow.locator("[data-ring-accent]").evaluateAll((elements) => {
    (window as unknown as { automaticEffects: Animation[] }).automaticEffects =
      elements.flatMap((element) => element.getAnimations());
  });
  for (const control of [flag, review, flag]) await control.hover();
  await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
  await page.keyboard.press("Tab");
  await review.focus();
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-feedback-step", "review");
  await review.click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(750);
  await expect(workflow).not.toHaveAttribute("data-feedback-step");
  await flag.hover();
  await review.press("Enter");
  await expect(workflow).toHaveAttribute("data-activation-step", "review");
  await page.clock.runFor(600);
  await expect(workflow).toHaveAttribute("data-activation-step", "review");
  await review.press("Space");
  await page.clock.runFor(600);
  await expect(workflow).toHaveAttribute("data-activation-step", "review");
  await page.clock.runFor(150);
  await expect(workflow).not.toHaveAttribute("data-activation-step");
  await expect(workflow).toHaveAttribute("data-feedback-step", "review");
  expect(
    await workflow.locator("[data-ring-accent]").evaluateAll((elements) => {
      const original = (window as unknown as { automaticEffects: Animation[] })
        .automaticEffects;
      return elements
        .flatMap((element) => element.getAnimations())
        .every(
          (animation, index) =>
            animation === original[index] && animation.currentTime === 150,
        );
    }),
  ).toBe(true);
  await page.locator("#how-it-works").focus();
  await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
  await page.mouse.move(0, 0);
  await expect(workflow).not.toHaveAttribute("data-feedback-step");
  await flag.click();
  await page.mouse.move(0, 0);
  await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
  await page.clock.runFor(750);
  await expect(workflow).not.toHaveAttribute("data-feedback-step");
  await flag.press("Space");
  await expect(workflow).toHaveAttribute("data-activation-step", "flag");
  const keyboardVisible = await flag.evaluate((element) =>
    element.matches(":focus-visible"),
  );
  await page.clock.runFor(750);
  await expect(workflow).not.toHaveAttribute("data-activation-step");
  if (keyboardVisible)
    await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
  else await expect(workflow).not.toHaveAttribute("data-feedback-step");
  await expect(workflow.locator("[aria-pressed], [aria-live]")).toHaveCount(0);
  await expect(workflow.getByRole("button")).toHaveCount(5);
  await finish(workflow, "connector");
  await finish(workflow, "card");
  await finish(workflow, "hold");
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
});

async function hidden(page: Page, value: boolean) {
  await page.evaluate((value) => {
    if (value)
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
    else Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  }, value);
}

test("workflow offscreen and hidden suspension retain reading time and all motion phases", async ({
  page,
}) => {
  const workflow = await controlledWorkflow(page);
  await page.clock.runFor(600);
  for (const reason of ["offscreen", "hidden"]) {
    if (reason === "offscreen") await page.evaluate(() => scrollTo(0, 0));
    else await hidden(page, true);
    await expect(workflow).toHaveAttribute("data-sequence-running", "false");
    await page.clock.runFor(10000);
    await expect(workflow).toHaveAttribute("data-phase", "hold");
    if (reason === "offscreen") await workflow.scrollIntoViewIfNeeded();
    else await hidden(page, false);
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  }
  await page.clock.runFor(300);
  await expect(workflow).toHaveAttribute("data-phase", "hold");
  await page.clock.runFor(150);
  for (const [phase, next] of [
    ["circles", "connector"],
    ["connector", "card"],
    ["card", "hold"],
  ]) {
    await expect(workflow).toHaveAttribute("data-phase", phase);
    await freeze(workflow);
    await hidden(page, true);
    await expect(workflow).toHaveAttribute("data-sequence-running", "false");
    const times = await workflow.locator(motion).evaluateAll((elements) =>
      elements
        .flatMap((element) => element.getAnimations())
        .map((animation) => ({
          state: animation.playState,
          time: animation.currentTime,
        })),
    );
    expect(times.every((sample) => sample.state === "paused")).toBe(true);
    await page.clock.runFor(10000);
    expect(
      await workflow.locator(motion).evaluateAll((elements) =>
        elements
          .flatMap((element) => element.getAnimations())
          .map((animation) => ({
            state: animation.playState,
            time: animation.currentTime,
          })),
      ),
    ).toEqual(times);
    await hidden(page, false);
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
    await finish(workflow, next);
  }
});

test("workflow mobile rail moves automatically while taps add temporary feedback, with stable resize focus", async ({
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
    const workflow = await controlledWorkflow(page, 390);
    const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
    const geometry = () =>
      workflow.locator("li").evaluateAll((rows) =>
        rows.map((row) => {
          const box = row.getBoundingClientRect();
          return [box.x, box.y, box.width, box.height];
        }),
      );
    const before = await geometry();
    const scroll = await page.evaluate(() => scrollY);
    await flag.tap();
    await expect(workflow).toHaveAttribute("data-activation-step", "flag");
    await expect(workflow).toHaveAttribute("data-active-step", "observe");
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    expect(await geometry()).toEqual(before);
    await page.clock.runFor(750);
    await expect(workflow).not.toHaveAttribute("data-activation-step");
    await page.clock.runFor(300);
    await expect(workflow).toHaveAttribute("data-phase", "circles");
    await freeze(workflow);
    const rail = workflow.locator("[data-rail-accent]");
    const beforeRail = await rail.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await page
      .locator("#how-it-works")
      .screenshot({ path: testInfo.outputPath("rail-intermediate.png") });
    await finish(workflow, "card");
    expect(
      await rail.evaluate((element) => getComputedStyle(element).transform),
    ).not.toBe(beforeRail);
    expect(
      await workflow.evaluate((root) => {
        const rail = root
          .querySelector("[data-rail-accent]")!
          .getBoundingClientRect();
        const row = root
          .querySelector('li[data-active="true"]')!
          .getBoundingClientRect();
        return Math.abs(rail.y + rail.height / 2 - row.y - row.height / 2);
      }),
    ).toBeLessThan(1);
    await finish(workflow, "hold");
    await page
      .locator("#how-it-works")
      .screenshot({ path: testInfo.outputPath("rail-settled.png") });
    await page.keyboard.press("Tab");
    await flag.focus();
    for (const width of [720, 721, 1279, 1280, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(flag).toBeFocused();
      await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
      await expect(workflow).toHaveAttribute("data-active-step", "interpret");
    }
    for (const stage of ["flag", "review", "respond", "observe"]) {
      await page.clock.runFor(1050);
      await expect(workflow).toHaveAttribute("data-phase", "circles");
      await finish(workflow, "card");
      await finish(workflow, "hold");
      await expect(workflow).toHaveAttribute("data-active-step", stage);
      await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
    }
  } finally {
    await context.close();
  }
});

test("workflow resize retains phase progress and reduced motion settles without losing keyboard focus", async ({
  page,
}) => {
  const workflow = await controlledWorkflow(page);
  await page.clock.runFor(1050);
  await expect(workflow).toHaveAttribute("data-phase", "circles");
  await freeze(workflow);
  await hidden(page, true);
  for (const width of [834, 720, 721, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(workflow).toHaveAttribute("data-phase", "circles");
    await expect
      .poll(() =>
        workflow
          .locator(motion)
          .evaluateAll((elements) =>
            elements
              .flatMap((element) => element.getAnimations())
              .map((animation) => animation.currentTime),
          ),
      )
      .toEqual(width <= 720 ? [150] : [150, 150, 150]);
  }
  await hidden(page, false);
  await freeze(workflow);
  await page.keyboard.press("Tab");
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  await flag.focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(workflow).toHaveAttribute("data-phase", "hold");
  await expect(workflow).toHaveAttribute("data-sequence-running", "false");
  await expect(flag).toBeFocused();
  expect(
    await workflow
      .locator(motion)
      .evaluateAll(
        (elements) =>
          elements.flatMap((element) => element.getAnimations()).length,
      ),
  ).toBe(0);
  await page.clock.runFor(10000);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await flag.press("Space");
  await expect(workflow).toHaveAttribute("data-feedback-step", "flag");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  await expect(flag).toBeFocused();
  await page.clock.runFor(1050);
  await expect(workflow).toHaveAttribute("data-phase", "circles");
});
