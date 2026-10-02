import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const headline =
  "More visibility into what is happening More precision on where to act";
const labels = ["Observe.", "Interpret.", "Flag.", "Review.", "Respond."];

test("workflow composition, assets and accessibility across responsive boundaries", async ({
  page,
}, testInfo) => {
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

test("cube runs, pauses in place, resumes and preserves user pause across reentry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#how-it-works");
  const cube = page.locator("#how-cubeWrap");
  const control = page.getByRole("button", {
    name: "Pause animation",
    exact: true,
  });
  const playState = () =>
    cube.evaluate((element) => getComputedStyle(element).animationPlayState);
  await expect.poll(playState).toBe("running");
  const initial = await cube.evaluate(
    (element) => element.getAnimations()[0].currentTime as number,
  );
  await expect
    .poll(() =>
      cube.evaluate(
        (element) => element.getAnimations()[0].currentTime as number,
      ),
    )
    .toBeGreaterThan(initial + 50);
  await control.focus();
  await control.press("Space");
  await expect.poll(playState).toBe("paused");
  await cube.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.ready),
    );
  });
  const pausedAt = await cube.evaluate(
    (element) => element.getAnimations()[0].currentTime as number,
  );
  await cube.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  expect(
    await cube.evaluate((element) => element.getAnimations()[0].currentTime),
  ).toBe(pausedAt);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect.poll(playState).toBe("paused");
  await page.getByRole("button", { name: "Resume animation" }).press("Enter");
  await expect.poll(playState).toBe("running");
  await expect
    .poll(() =>
      cube.evaluate(
        (element) => element.getAnimations()[0].currentTime as number,
      ),
    )
    .toBeGreaterThan(pausedAt);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(playState).toBe("paused");
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect.poll(playState).toBe("running");
});

test("reduced motion is static and preference changes retain visible focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#how-it-works");
  const section = page.locator("#how-it-works");
  expect(
    await section.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(section.getByRole("button")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await section.getByRole("button", { name: "Pause animation" }).focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).toBeFocused();
  await expect(section.getByRole("button")).toHaveCount(0);
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
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3187/#how-it-works");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  const section = page.locator("#how-it-works");
  await expect(section.getByRole("listitem")).toHaveText(labels);
  await expect(section.locator("svg").first()).toBeAttached();
  await expect(section.getByRole("button")).toHaveCount(0);
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
