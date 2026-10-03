import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { prepareMotion, ready, frames } from "./landing-motion-helpers";

const sections = ["capabilities", "product-demo", "deployment", "plans", "faq"];
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
  test.setTimeout(Math.max(testInfo.timeout, 180_000));
  // This sweep checks settled geometry and authored content. Native motion is
  // exercised separately in the recorded full downward/upward passes.
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  // Capture the first real pointer effect at creation, before host round trips
  // can consume its 240ms duration. Subsequent reversal runs naturally.
  await details.evaluate((element) => {
    const animate = element.animate;
    element.animate = function (keyframes, options) {
      const animation = animate.call(this, keyframes, options);
      animation.pause();
      Reflect.deleteProperty(this, "animate");
      return animation;
    };
  });
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

test("deployment entrance finishes on preference change and replays after exit", async ({
  page,
}) => {
  await prepareMotion(page);
  await page.goto("/");
  await ready(page);
  const section = page.locator("#deployment ol");
  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(3);
  await section.evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      animation.pause();
      animation.currentTime = (animation.effect!.getTiming().delay ?? 0) + 100;
    }),
  );
  await frames(page);
  const offsets = await section
    .locator("li")
    .evaluateAll((items) =>
      items.map((item) =>
        parseFloat(getComputedStyle(item).translate.split(" ")[1]),
      ),
    );
  expect(offsets.some((offset) => offset > 0 && offset < 48)).toBe(true);
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
  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(3);
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
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  for (const id of sections) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await noOverflow(page);
  }
  const player = page.locator("[data-step]");
  await expect(player).toHaveAttribute("data-step", "2");
  await expect(player).toHaveAttribute("data-phase", "static");
  await expect(player).toHaveAttribute("data-playing", "false");
  await expect(player.getByRole("button")).toHaveCount(0);
  await player.scrollIntoViewIfNeeded();
  const label = player.getByText("Potential concealment · 88%", {
    exact: true,
  });
  const box = (await label.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await page.locator("#product-demo").screenshot({
    path: testInfo.outputPath("demo-enlarged-text.png"),
  });
  const scan = await new AxeBuilder({ page })
    .include("#product-demo")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("phone touch controls open FAQ and demo stages remain indicators", async ({
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
    const stages = page.getByRole("list", { name: "Demo stages" });
    await stages.scrollIntoViewIfNeeded();
    await stages.getByText("The event is detected", { exact: true }).tap();
    await expect(stages.getByRole("button")).toHaveCount(0);
    await expect(stages.locator("li")).toHaveCount(3);
  } finally {
    await context.close();
  }
});

test("all sections and native FAQ remain usable without JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    for (const id of sections)
      await expect(page.locator(`#${id}`)).toBeVisible();
    const player = page.locator("[data-step]");
    await expect(player).toHaveAttribute("data-step", "2");
    await expect(player).toHaveAttribute("data-phase", "static");
    await expect(player.getByRole("button")).toHaveCount(0);
    expect(
      await player.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator("#product-demo").scrollIntoViewIfNeeded();
      await noOverflow(page);
      await page.locator("#product-demo").screenshot({
        path: testInfo.outputPath(`demo-no-js-${width}.png`),
      });
    }
    const first = page.locator("#faq details").first();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await expect(first.locator("p")).toBeVisible();
    await noOverflow(page);
  } finally {
    await context.close();
  }
});
