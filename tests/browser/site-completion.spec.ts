import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const sections = ["capabilities", "product-demo", "deployment", "plans", "faq"];
const sample = (player: Locator) =>
  player.locator('[class*="progress"] > span').evaluate(async (element) => {
    const animation = element.getAnimations()[0];
    // WebKit resolves a CSS pause asynchronously; sample its committed hold time.
    await animation?.ready;
    return {
      time: Number(animation?.currentTime ?? 0),
      state: animation?.playState,
    };
  });
async function finishStep(player: Locator) {
  await player
    .locator('[class*="progress"] > span')
    .evaluate((element) => element.getAnimations()[0].finish());
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

test("complete supplied content, imagery and responsive section layouts", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [320, 390, 720, 721, 834, 1279, 1280, 1440, 1910]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator("main > section").all()) {
      await section.scrollIntoViewIfNeeded();
      for (const image of await section.locator("img").all()) {
        if (!(await image.isVisible())) continue;
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      await noOverflow(page);
      expect(
        await section
          .locator("h2,h3,p,summary,button")
          .evaluateAll((elements) =>
            elements
              .filter((e) => {
                const box = e.getBoundingClientRect();
                return (
                  box.width > 0 &&
                  (box.left < -1 ||
                    box.right > innerWidth + 1 ||
                    e.scrollWidth > e.clientWidth + 1)
                );
              })
              .map((e) => e.textContent),
          ),
      ).toEqual([]);
      if ([390, 834, 1440].includes(width)) {
        const name = await section.getAttribute("aria-labelledby");
        await section.screenshot({
          path: testInfo.outputPath(`${width}-${name}.png`),
          animations: "disabled",
        });
      }
    }
  }
  // Compare authored prose with the supplied source, not a duplicated fixture.
  const copy = readFileSync("references/web-content.md", "utf8");
  for (const paragraph of copy
    .split(/\r?\n\r?\n/)
    .filter((text) =>
      /^(Sentinel adapts|Identify configured|Extend operational|Support review|Monitor restricted|Monitor high-priority|We review|We deploy|Configured detections|Not necessarily|Sentinel supports deployments|Alert timing|Sentinel can support|Sentinel is designed to support|Where Sentinel|System-health|Commercial terms)/.test(
        text,
      ),
    )) {
    await expect(
      page.getByText(paragraph.replace(/\s+/g, " ").trim(), { exact: true }),
    ).toHaveCount(1);
  }
  await expect(page.locator("#capabilities article")).toHaveCount(5);
  await expect(page.locator("#deployment li")).toHaveCount(3);
  await expect(page.locator("#faq details")).toHaveCount(8);
  await expect(page.locator("#faq details[open]")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("demo plays, pauses in place, resumes offscreen and supports direct step selection", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#product-demo");
  const player = page.locator("[data-step]");
  await page.getByRole("button", { name: "Play demo", exact: true }).click();
  await expect(player).toHaveAttribute("data-step", "0");
  // Sample the visible timeline after fragment/control scrolling settles.
  const progress = player.locator('[class*="progress"]');
  await progress.scrollIntoViewIfNeeded();
  await expect(progress).toBeInViewport();
  await expect
    .poll(() => sample(player).then((s) => s.time))
    .toBeGreaterThan(50);
  // Controlled visibility-event coverage; no claim of native OS tab suspension.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(player).toHaveAttribute("data-playing", "false");
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(player).toHaveAttribute("data-playing", "true");
  await page.getByRole("button", { name: "Pause demo" }).click();
  await expect.poll(() => sample(player).then((s) => s.state)).toBe("paused");
  const paused = await sample(player);
  await page.evaluate(() => window.scrollTo(0, 0));
  await player.scrollIntoViewIfNeeded();
  expect((await sample(player)).time).toBeCloseTo(paused.time, 0);
  await page.getByRole("button", { name: "Resume demo" }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(player).toHaveAttribute("data-playing", "false");
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-playing", "true");
  await finishStep(player);
  await expect(player).toHaveAttribute("data-step", "1");
  await expect(
    page.getByText("Analysing the detection", { exact: true }),
  ).toBeVisible();
  await player.screenshot({ path: testInfo.outputPath("demo-analysis.png") });
  await page.getByRole("button", { name: /3 Review the event/ }).click();
  await expect(player).toHaveAttribute("data-step", "2");
  await expect(player).toHaveAttribute("data-playing", "false");
  await page.getByRole("button", { name: "Play demo", exact: true }).click();
  for (const step of [1, 2]) {
    await finishStep(player);
    await expect(player).toHaveAttribute("data-step", String(step));
  }
  await finishStep(player);
  await expect(
    page.getByRole("button", { name: "Play demo", exact: true }),
  ).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export event report" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("sentinel-illustrative-demo.txt");
  const file = await download.path();
  expect(readFileSync(file!, "utf8")).toContain(
    "Synthetic example only. Not an operational record.",
  );
  await page.getByRole("button", { name: /1 The event is detected/ }).click();
  await expect(
    page.getByRole("button", { name: "Export event report" }),
  ).toBeDisabled();
});

test("FAQ supports keys, pointer reversal, reduced motion and open-state accessibility", async ({
  page,
}, testInfo) => {
  await page.goto("/#faq");
  const details = page.locator("#faq details").first();
  const summary = details.locator("summary");
  await summary.focus();
  await summary.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await expect(details.locator("[data-answer]")).toBeVisible();
  await summary.press("Space");
  await expect(details).not.toHaveAttribute("open");
  const closedHeight = (await details.boundingBox())!.height;
  await summary.click();
  const middle = await details.evaluate((element) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    animation.currentTime = 80;
    return element.getBoundingClientRect().height;
  });
  expect(middle).toBeGreaterThan(closedHeight);
  await details.screenshot({
    path: testInfo.outputPath("faq-mid-opening.png"),
  });
  await summary.click();
  await expect(details).not.toHaveAttribute("open");
  await summary.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(details).toHaveAttribute("open", "");
  await expect
    .poll(() =>
      details.evaluate(
        (element) =>
          element.getAnimations().filter((a) => a.playState === "running")
            .length,
      ),
    )
    .toBe(0);
  const scan = await new AxeBuilder({ page })
    .include("#faq")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("deployment entrance has intermediate motion, finishes on preference change and does not replay", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const section = page.locator("#deployment");
  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(3);
  const offsets = await section.evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      animation.pause();
      animation.currentTime = 100;
      const target = (animation.effect as KeyframeEffect).target!;
      return new DOMMatrixReadOnly(getComputedStyle(target).transform).m42;
    }),
  );
  expect(offsets.some((offset) => offset > 0 && offset < 20)).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await section.scrollIntoViewIfNeeded();
  expect(
    await section.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("new navigation reaches real targets and retains mobile keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const label of ["Capabilities", "Deployment", "Plans", "FAQ"]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    const link = page
      .locator("#mobile-navigation")
      .getByRole("link", { name: label, exact: true });
    const href = await link.getAttribute("href");
    await link.focus();
    await link.press("Enter");
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    await expect(page.locator(href!.slice(1))).toBeFocused();
  }
  const industries = page.getByRole("region", { name: "Industries" });
  for (const link of await industries.getByRole("link").all()) {
    const href = await link.getAttribute("href");
    await link.click();
    await expect(page.locator(href!.slice(1))).toBeInViewport();
  }
  for (const label of ["Discuss the Right Package", "See Add-on Options"]) {
    await expect(page.getByRole("button", { name: label })).toBeDisabled();
  }
});

test("reduced motion and enlarged text preserve complete demo and section content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  for (const id of sections) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await noOverflow(page);
  }
  await page.getByRole("button", { name: "Explore demo" }).click();
  const player = page.locator("[data-step]");
  await expect(player).toHaveAttribute("data-step", "0");
  await expect(player).toHaveAttribute("data-playing", "false");
  await page.getByRole("button", { name: "Next demo step" }).click();
  await expect(player).toHaveAttribute("data-step", "1");
  await page.getByRole("button", { name: "Next demo step" }).click();
  await expect(player).toHaveAttribute("data-step", "2");
  const label = player.getByText("Potential concealment · 88%", {
    exact: true,
  });
  const box = (await label.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  const scan = await new AxeBuilder({ page })
    .include("#product-demo")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const play = page.getByRole("button", { name: "Play demo", exact: true });
  await play.focus();
  await play.press("Space");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(player).toHaveAttribute("data-playing", "false");
  await expect(
    page.getByRole("button", { name: "Next demo step" }),
  ).toBeFocused();
});

test("phone touch controls open FAQ and select demo stages", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/#faq");
    const first = page.locator("#faq details").first();
    await first.locator("summary").tap();
    await expect(first).toHaveAttribute("open", "");
    await first.locator("summary").tap();
    await expect(first).not.toHaveAttribute("open");
    const step = page.getByRole("button", { name: /1 The event is detected/ });
    await step.scrollIntoViewIfNeeded();
    await step.tap();
    await expect(page.locator("[data-step]")).toHaveAttribute("data-step", "0");
  } finally {
    await context.close();
  }
});

test("all sections and native FAQ remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    for (const id of sections)
      await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Play demo", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Export event report" }),
    ).toBeDisabled();
    const first = page.locator("#faq details").first();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await expect(first.locator("p")).toBeVisible();
    await noOverflow(page);
  } finally {
    await context.close();
  }
});
