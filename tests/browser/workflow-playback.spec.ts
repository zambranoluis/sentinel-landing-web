import { expect, test, type Locator, type Page } from "@playwright/test";

const stages = ["observe", "interpret", "flag", "review", "respond"];

async function seek(workflow: Locator, time: number) {
  await workflow.evaluate((element, time) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      if (animation.id.startsWith("workflow-")) animation.currentTime = time;
    }
  }, time);
}

async function clock(workflow: Locator) {
  return workflow.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find((a) => a.id === "workflow-clock")!;
    return {
      time: Number(animation.currentTime),
      duration: Number(animation.effect!.getTiming().duration),
      state: animation.playState,
    };
  });
}

async function ready(page: Page, width = 1440, start = false) {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Hold visibility during hydration so slower hosts cannot advance before
  // the test starts observing. Release it before all native playback checks.
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
  });
  await page.goto("/#how-it-works");
  const workflow = page.locator("[data-workflow]");
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await expect(workflow).toHaveAttribute("data-sequence-running", "false");
  await workflow.getByRole("button", { name: "Pause sequence" }).click();
  await page.mouse.move(0, 0);
  await seek(workflow, 0);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  if (start) {
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    await page.mouse.move(0, 0);
  }
  return workflow;
}

async function frozenPose(workflow: Locator, time: number) {
  if ((await workflow.getAttribute("data-sequence-running")) === "true")
    await workflow.getByRole("button", { name: "Pause sequence" }).click();
  await expect(workflow).toHaveAttribute("data-sequence-running", "false");
  await seek(workflow, time);
}

async function nextFrames(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

for (const width of [390, 720, 721, 834, 1440]) {
  test(`automatic workflow full cycle and native timing at ${width}px`, async ({
    page,
  }) => {
    const workflow = await ready(page, width);
    const interval = width <= 720 ? 1200 : 2400;
    expect((await clock(workflow)).duration).toBe(interval);
    await workflow.evaluate((element) => {
      const records: { name: string | null; at: number }[] = [];
      (window as unknown as { workflowStages: typeof records }).workflowStages =
        records;
      new MutationObserver(() => {
        const name = element.getAttribute("data-active-step");
        if (
          element.getAttribute("data-sequence-running") === "true" &&
          name !== records.at(-1)?.name
        )
          records.push({ name, at: performance.now() });
      }).observe(element, {
        attributes: true,
        attributeFilter: ["data-active-step", "data-sequence-running"],
      });
    });
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    await page.mouse.move(0, 0);
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              (window as unknown as { workflowStages: unknown[] })
                .workflowStages.length,
          ),
        { timeout: 18_000 },
      )
      .toBeGreaterThanOrEqual(6);
    const records = await page.evaluate(() =>
      (
        window as unknown as { workflowStages: { name: string; at: number }[] }
      ).workflowStages.slice(0, 6),
    );
    expect(records.map((r) => r.name)).toEqual([...stages, "observe"]);
    for (let index = 1; index < records.length; index++) {
      expect(records[index].at - records[index - 1].at).toBeGreaterThan(
        interval - 350,
      );
      expect(records[index].at - records[index - 1].at).toBeLessThan(
        interval + 500,
      );
    }
    await expect(workflow.locator("[aria-pressed], [aria-live]")).toHaveCount(
      0,
    );
  });
}

test("radial workflow uses clockwise slots and identity-keyed outward connectors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#how-it-works");
  for (const width of [721, 834, 1279, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const workflow = page.locator("[data-workflow]");
    const boxes = await workflow.locator("li").evaluateAll((rows) =>
      rows.map((row) => {
        const box = row.getBoundingClientRect();
        return {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
          width: box.width,
          height: box.height,
        };
      }),
    );
    const [observe, interpret, flag, review, respond] = boxes;
    expect(observe.y).toBeLessThan(interpret.y);
    expect(interpret.x).toBeGreaterThan(flag.x);
    expect(flag.y).toBeGreaterThan(interpret.y);
    expect(flag.x).toBeGreaterThan(review.x);
    expect(review.y).toBeCloseTo(flag.y);
    expect(respond.x).toBeLessThan(review.x);
    expect(respond.y).toBeCloseTo(interpret.y);
    for (const box of boxes) {
      expect(box.width).toBeCloseTo(observe.width);
      expect(box.height).toBeCloseTo(observe.height);
    }
    const paths = await workflow
      .locator("[data-trace]")
      .evaluateAll((traces) =>
        Object.fromEntries(
          traces.map((trace) => [
            trace.getAttribute("data-trace"),
            trace.getAttribute("d"),
          ]),
        ),
      );
    expect(paths).toEqual({
      observe: "M410 265V180",
      interpret: "M526 355 620 335",
      flag: "M483 462 530 514",
      review: "M335 462 290 514",
      respond: "M294 355 200 335",
    });
    await expect(workflow.locator("li")).toHaveText([
      "Observe.",
      "Interpret.",
      "Flag.",
      "Review.",
      "Respond.",
    ]);
  }
});

test("desktop handoff holds, sweeps clockwise, traces the destination, then highlights and pulses including wrap", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  const workflow = await ready(page);
  const ring = workflow.locator("[data-ring-accent]").first();
  for (let index = 0; index < stages.length; index++) {
    const current = stages[index];
    const destination = stages[(index + 1) % stages.length];
    const trace = workflow.locator(`[data-trace="${destination}"]`);
    await frozenPose(workflow, 1600);
    await expect(workflow).toHaveAttribute("data-active-step", current);
    await expect(ring).toHaveCSS("opacity", "0");
    await expect(trace).toHaveCSS("opacity", "0");
    await seek(workflow, 1850);
    await expect(ring).toHaveCSS("opacity", "0.8");
    if (index === 0)
      await workflow.screenshot({
        path: testInfo.outputPath("workflow-ring-sweep-desktop.png"),
      });
    const offset = await ring.evaluate((el) =>
      parseFloat(getComputedStyle(el).strokeDashoffset),
    );
    await seek(workflow, 2000);
    expect(
      await ring.evaluate((el) =>
        parseFloat(getComputedStyle(el).strokeDashoffset),
      ),
    ).toBeLessThan(offset);
    await expect(trace).toHaveCSS("opacity", "0");
    await seek(workflow, 2225);
    await expect(ring).toHaveCSS("opacity", "0");
    await expect(trace).toHaveCSS("opacity", "1");
    expect(
      await trace.evaluate((el) =>
        parseFloat(getComputedStyle(el).strokeDashoffset),
      ),
    ).toBeCloseTo(0.5);
    await expect(
      workflow.locator(`[data-step="${destination}"]`),
    ).toHaveAttribute("data-active", "false");
    if (index === 0)
      await workflow.screenshot({
        path: testInfo.outputPath("workflow-intermediate-desktop.png"),
      });
    await seek(workflow, 2399);
    await expect(workflow).toHaveAttribute("data-active-step", current);
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    await expect(workflow).toHaveAttribute("data-active-step", destination);
    await frozenPose(workflow, 100);
    const pulse = await workflow
      .locator(`[data-endpoint="${destination}"]`)
      .evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a,
      );
    expect(pulse).toBeCloseTo(1.65);
    if (index === 0)
      await workflow.screenshot({
        path: testInfo.outputPath("workflow-arrival-desktop.png"),
      });
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
  }
});

test("focus, hover, click, Enter and Space leave stage and animation targets independent across intervals", async ({
  page,
}) => {
  const workflow = await ready(page);
  await frozenPose(workflow, 1750);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  const review = workflow.getByRole("button", { name: "Review.", exact: true });
  await workflow.evaluate((element) => {
    const effects = element
      .getAnimations({ subtree: true })
      .filter((a) => a.id.startsWith("workflow-"));
    (
      window as unknown as { originalWorkflowEffects: Animation[] }
    ).originalWorkflowEffects = effects;
  });
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-interaction-step", "flag");
  await expect(workflow.locator('[data-step="observe"]')).toHaveAttribute(
    "data-active",
    "true",
  );
  await page.keyboard.press("Tab");
  await review.focus();
  await flag.hover();
  await expect(workflow).toHaveAttribute("data-interaction-step", "review");
  await review.press("Enter");
  await review.press("Space");
  await expect(workflow).toHaveAttribute("data-sequence-running", "false");
  expect(
    await page.evaluate(() =>
      (
        window as unknown as { originalWorkflowEffects: Animation[] }
      ).originalWorkflowEffects.every((a) => a.playState !== "idle"),
    ),
  ).toBe(true);
  expect((await clock(workflow)).time).toBe(1750);
  await expect(workflow.locator('[data-step="observe"]')).toHaveCSS(
    "border-top-color",
    "rgb(5, 221, 241)",
  );
  await expect(workflow.locator('[data-step="review"]')).toHaveCSS(
    "border-top-color",
    "rgb(5, 221, 241)",
  );
  await expect(review).toHaveCSS("outline-style", "solid");
  // Firefox quantizes border/outline widths at this Windows display scale.
  expect(
    await review.evaluate((el) =>
      parseFloat(getComputedStyle(el).outlineWidth),
    ),
  ).toBeGreaterThanOrEqual(2);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await page.keyboard.press("Tab");
  await review.focus();
  await flag.hover();
  await review.press("Enter");
  await review.press("Space");
  await expect(workflow).toHaveAttribute("data-sequence-running", "true");
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await expect(workflow.locator('[data-step="review"]')).toHaveAttribute(
    "data-emphasized",
    "true",
  );
  await expect(workflow).toHaveAttribute("data-active-step", "flag", {
    timeout: 4000,
  });
  await expect(review).toBeFocused();
  await workflow.getByRole("button", { name: "Pause sequence" }).focus();
  await page.mouse.move(0, 0);
  await expect(workflow).not.toHaveAttribute("data-interaction-step");
  await frozenPose(workflow, 2120);
  const before = await clock(workflow);
  await flag.click({ force: true });
  await review.click({ force: true });
  await page.mouse.move(0, 0);
  await expect(workflow.locator('[data-step="review"]')).toHaveAttribute(
    "data-emphasized",
    "true",
  );
  await expect(workflow.locator('[data-step="review"]')).toHaveAttribute(
    "data-emphasized",
    "false",
    { timeout: 1500 },
  );
  expect(await clock(workflow)).toEqual(before);
  await expect(workflow.locator("[aria-pressed]")).toHaveCount(0);
});

for (const pose of [
  { width: 1440, time: 900 },
  { width: 1440, time: 1850 },
  { width: 1440, time: 2200 },
  { width: 390, time: 800 },
]) {
  test(`explicit pause retains interval and effect position at ${pose.width}px / ${pose.time}ms`, async ({
    page,
  }) => {
    const workflow = await ready(page, pose.width);
    await frozenPose(workflow, pose.time);
    const before = await clock(workflow);
    const styles = () =>
      workflow
        .locator("[data-ring-accent], [data-trace], [data-rail-accent]")
        .evaluateAll((els) =>
          els.map((el) => [
            getComputedStyle(el).transform,
            getComputedStyle(el).strokeDashoffset,
            getComputedStyle(el).opacity,
          ]),
        );
    const beforeStyles = await styles();
    await nextFrames(page);
    expect(await clock(workflow)).toEqual(before);
    expect(await styles()).toEqual(beforeStyles);
    await workflow.evaluate((element) => {
      const delivery = { start: 0, elapsed: 0 };
      (
        window as unknown as { workflowResume: typeof delivery }
      ).workflowResume = delivery;
      new MutationObserver((records) => {
        if (
          records.some((r) => r.attributeName === "data-sequence-running") &&
          element.getAttribute("data-sequence-running") === "true"
        )
          delivery.start = performance.now();
        if (
          delivery.start &&
          records.some((r) => r.attributeName === "data-active-step")
        )
          delivery.elapsed = performance.now() - delivery.start;
      }).observe(element, {
        attributes: true,
        attributeFilter: ["data-sequence-running", "data-active-step"],
      });
    });
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    await expect(workflow).toHaveAttribute("data-active-step", "interpret", {
      timeout: 2500,
    });
    const elapsed = await page.evaluate(
      () =>
        (window as unknown as { workflowResume: { elapsed: number } })
          .workflowResume.elapsed,
    );
    expect(elapsed).toBeGreaterThan(before.duration - pose.time - 100);
    // Allow native frame/event delivery on Windows WebKit while keeping the
    // bound below a restarted full interval for every tested pause position.
    expect(elapsed).toBeLessThan(before.duration - pose.time + 400);
  });
}

test("offscreen and hidden suspension freeze the shared trace clock and resume in place", async ({
  page,
}) => {
  const workflow = await ready(page);
  for (const reason of ["offscreen", "hidden"]) {
    await frozenPose(workflow, 2200);
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    if (reason === "offscreen") await page.evaluate(() => scrollTo(0, 0));
    else
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          value: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await expect(workflow).toHaveAttribute("data-sequence-running", "false");
    const before = await clock(workflow);
    expect(before.state).toBe("paused");
    await nextFrames(page);
    expect(await clock(workflow)).toEqual(before);
    if (reason === "offscreen") await workflow.scrollIntoViewIfNeeded();
    else
      await page.evaluate(() => {
        Reflect.deleteProperty(document, "hidden");
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
    await expect
      .poll(async () => (await clock(workflow)).state)
      .toBe("running");
    await expect(workflow).toHaveAttribute(
      "data-active-step",
      reason === "offscreen" ? "interpret" : "flag",
    );
  }
});

test("breakpoint changes retain stage, focus and normalized clock progress and rearm at next stage", async ({
  page,
}) => {
  const workflow = await ready(page);
  await frozenPose(workflow, 1800);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  await page.keyboard.press("Tab");
  await flag.focus();
  for (const width of [720, 721, 1279, 1280, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const duration = width <= 720 ? 1200 : 2400;
    await expect
      .poll(async () => (await clock(workflow)).duration)
      .toBe(duration);
    await expect
      .poll(async () => (await clock(workflow)).time)
      .toBeCloseTo(duration * 0.75);
    await expect(flag).toBeFocused();
    await expect(workflow).toHaveAttribute("data-active-step", "observe");
    expect(
      await workflow
        .locator("[data-ring-accent], [data-trace], [data-rail-accent]")
        .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
    ).toBe(0);
  }
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
  await frozenPose(workflow, 800);
  expect(
    await workflow
      .locator("[data-rail-accent]")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(1);
});

test("mobile rail moves only during automatic handoffs and includes Respond to Observe", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  const workflow = await ready(page, 390);
  const rail = workflow.locator("[data-rail-accent]");
  for (let index = 0; index < stages.length; index++) {
    await frozenPose(workflow, 499);
    const position = () =>
      rail.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      );
    const from = await position();
    await seek(workflow, 850);
    const middle = await position();
    expect(middle).not.toBe(from);
    await workflow
      .getByRole("button", { name: "Flag.", exact: true })
      .click({ force: true });
    await page.mouse.move(0, 0);
    expect(await position()).toBe(middle);
    await expect(workflow).toHaveAttribute("data-active-step", stages[index]);
    await seek(workflow, 1199);
    const to = await position();
    expect(Math.abs(middle - from)).toBeLessThan(Math.abs(to - from));
    if (index === 0)
      await page.locator("#how-it-works").screenshot({
        path: testInfo.outputPath("workflow-intermediate-mobile.png"),
      });
    await workflow.getByRole("button", { name: "Resume sequence" }).click();
    await expect(workflow).toHaveAttribute(
      "data-active-step",
      stages[(index + 1) % 5],
    );
  }
  await frozenPose(workflow, 0);
  await page
    .locator("#how-it-works")
    .screenshot({ path: testInfo.outputPath("workflow-settled-mobile.png") });
});

test("touch adds brief emphasis without scrolling, moving rows or holding mobile playback", async ({
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
    const workflow = await ready(page, 390, true);
    const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
    const geometry = () =>
      workflow.locator("li").evaluateAll((rows) =>
        rows.map((row) => {
          const b = row.getBoundingClientRect();
          return [b.x, b.y, b.width, b.height];
        }),
      );
    const before = await geometry();
    const scroll = await page.evaluate(() => scrollY);
    await flag.tap();
    await expect(workflow.locator('[data-step="flag"]')).toHaveAttribute(
      "data-emphasized",
      "true",
    );
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    expect(await geometry()).toEqual(before);
    await workflow.screenshot({
      path: testInfo.outputPath("workflow-mobile-emphasis.png"),
    });
    await expect(workflow.locator('[data-step="flag"]')).toHaveAttribute(
      "data-emphasized",
      "false",
      { timeout: 1500 },
    );
    await expect(workflow).toHaveAttribute("data-active-step", "interpret");
    await expect(workflow).toHaveAttribute("data-active-step", "flag");
    await expect(workflow.locator("[aria-pressed]")).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("activation emphasis lasts 600ms and rapid activation replaces only that emphasis", async ({
  page,
}) => {
  const now = new Date("2030-01-01T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 10_000));
  const workflow = await ready(page);
  await frozenPose(workflow, 2200);
  const before = await clock(workflow);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  const respond = workflow.getByRole("button", {
    name: "Respond.",
    exact: true,
  });
  await flag.click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(500);
  await respond.click();
  await page.mouse.move(0, 0);
  await expect(workflow.locator('[data-step="flag"]')).toHaveAttribute(
    "data-emphasized",
    "false",
  );
  await page.clock.runFor(599);
  await expect(workflow.locator('[data-step="respond"]')).toHaveAttribute(
    "data-emphasized",
    "true",
  );
  await page.clock.runFor(1);
  await expect(workflow.locator('[data-step="respond"]')).toHaveAttribute(
    "data-emphasized",
    "false",
  );
  expect(await clock(workflow)).toEqual(before);
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
});

for (const width of [390, 1440]) {
  test(`click and tap during moving effects retain targets and automatic progress at ${width}px`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      hasTouch: true,
      viewport: { width, height: 1000 },
    });
    try {
      const page = await context.newPage();
      const workflow = await ready(page, width);
      const time = width <= 720 ? 650 : 1800;
      for (const destination of ["interpret", "flag"]) {
        await frozenPose(workflow, time);
        const origin = await workflow.getAttribute("data-active-step");
        await workflow.evaluate((element) => {
          const effects = element
            .getAnimations({ subtree: true })
            .filter((a) => a.id.startsWith("workflow-"));
          (
            window as unknown as { movingWorkflowEffects: Animation[] }
          ).movingWorkflowEffects = effects;
        });
        await workflow.getByRole("button", { name: "Resume sequence" }).click();
        const review = workflow.getByRole("button", {
          name: "Review.",
          exact: true,
        });
        await review.click({ force: true });
        await review.tap({ force: true });
        await expect(workflow).toHaveAttribute("data-sequence-running", "true");
        const advanced =
          (await workflow.getAttribute("data-active-step")) !== origin;
        if (advanced)
          await expect(workflow).toHaveAttribute(
            "data-active-step",
            destination,
          );
        else expect((await clock(workflow)).time).toBeGreaterThanOrEqual(time);
        expect(
          await page.evaluate(() =>
            (
              window as unknown as { movingWorkflowEffects: Animation[] }
            ).movingWorkflowEffects.every((a) => a.playState === "idle"),
          ),
        ).toBe(advanced);
        await expect(workflow).toHaveAttribute("data-active-step", destination);
      }
    } finally {
      await context.close();
    }
  });
}

test("reduced motion settles effects and keeps keyboard emphasis, focus and playback stage", async ({
  page,
}) => {
  const workflow = await ready(page);
  await frozenPose(workflow, 2200);
  const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
  await page.keyboard.press("Tab");
  await flag.focus();
  await flag.press("Enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    workflow.getByRole("button", { name: "Resume sequence" }),
  ).toBeDisabled();
  await expect(flag).toBeFocused();
  await expect(workflow).toHaveAttribute("data-active-step", "observe");
  await expect(workflow.locator('[data-step="flag"]')).toHaveAttribute(
    "data-emphasized",
    "true",
  );
  expect(
    await workflow.evaluate(
      (el) =>
        el
          .getAnimations({ subtree: true })
          .filter((a) => a.id.startsWith("workflow-")).length,
    ),
  ).toBe(0);
  await flag.press("Space");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(flag).toBeFocused();
  await expect(
    workflow.getByRole("button", { name: "Resume sequence" }),
  ).toBeEnabled();
  await expect
    .poll(() =>
      workflow.evaluate((el) =>
        el.getAnimations().some((a) => a.id === "workflow-clock"),
      ),
    )
    .toBe(true);
  expect((await clock(workflow)).time).toBeCloseTo(2200);
  await workflow.getByRole("button", { name: "Resume sequence" }).click();
  await expect(workflow).toHaveAttribute("data-active-step", "interpret");
});
