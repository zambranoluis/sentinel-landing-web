import { expect, test } from "@playwright/test";
import { expectFirstScreen } from "./hero-geometry";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tall-desktop", width: 1440, height: 1400 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tall-mobile", width: 390, height: 1200 },
  ...[720, 721, 1279, 1280].map((width) => ({
    name: `boundary-${width}`,
    width,
    height: 1000,
  })),
];

for (const viewport of viewports) {
  test(`navbar and hero fill the first screen at ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const geometry = await expectFirstScreen(page);
    expect(geometry.hero.bottom).toBeCloseTo(viewport.height, 0);
    await page
      .locator("section[aria-labelledby='hero-heading'] img")
      .evaluate((image: HTMLImageElement) => image.decode());
    await testInfo.attach("first-screen-geometry", {
      body: JSON.stringify(geometry, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({ path: testInfo.outputPath("first-screen.png") });
  });
}

for (const viewport of [
  { name: "short-landscape-mobile", width: 667, height: 375 },
  { name: "short-landscape-tablet", width: 1024, height: 600 },
  { name: "enlarged-mobile", width: 320, height: 640, fontSize: "200%" },
  { name: "enlarged-desktop", width: 1440, height: 900, fontSize: "200%" },
]) {
  test(`hero allows readable scrolling at ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    if ("fontSize" in viewport)
      await page.addStyleTag({
        content: `html { font-size: ${viewport.fontSize}; }`,
      });
    const geometry = await expectFirstScreen(page);
    expect(geometry.hero.bottom).toBeGreaterThan(viewport.height);
    const action = page
      .locator("section[aria-labelledby='hero-heading']")
      .getByRole("button", { name: "Request a Site Assessment" });
    await action.scrollIntoViewIfNeeded();
    await expect(action).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath("readable-action.png") });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath("readable-entry.png") });
  });
}

test("first screen tracks navbar size, resizing and mobile disclosure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1200 });
  await page.goto("/");
  const before = await expectFirstScreen(page);
  // A border-only change must be observed as well as a content-size change.
  await page.addStyleTag({ content: "#top { border-bottom-width: 9px; }" });
  const bordered = await expectFirstScreen(page);
  expect(bordered.navbar.height).toBeCloseTo(before.navbar.height + 8, 0);
  expect(bordered.hero.bottom).toBeCloseTo(1200, 0);
  await page.addStyleTag({ content: "#top { padding-bottom: 32px; }" });
  const padded = await expectFirstScreen(page);
  expect(padded.navbar.height).toBeCloseTo(bordered.navbar.height + 32, 0);
  expect(padded.hero.bottom).toBeCloseTo(1200, 0);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  const open = await expectFirstScreen(page);
  expect(open.navbar.height).toBeCloseTo(padded.navbar.height, 0);
  expect(open.hero.bottom).toBeCloseTo(1200, 0);
  const panelMax = await page
    .locator("#mobile-navigation")
    .evaluate((element) => parseFloat(getComputedStyle(element).maxHeight));
  expect(panelMax).toBeCloseTo(1200 - open.navbar.height, 0);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeFocused();
  for (const viewport of [
    { width: 1280, height: 1000 },
    { width: 721, height: 1112 },
    { width: 720, height: 1200 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    const resized = await expectFirstScreen(page);
    expect(resized.hero.bottom).toBeCloseTo(viewport.height, 0);
  }
});

for (const viewport of [viewports[0], viewports[2], viewports[4]]) {
  test(`first screen stays readable without JavaScript at ${viewport.name}`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport,
    });
    try {
      const page = await context.newPage();
      await page.goto(testInfo.project.use.baseURL!);
      const geometry = await expectFirstScreen(page, false);
      expect(geometry.hero.bottom).toBeLessThan(viewport.height + 1);
      expect(
        await page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--navbar-height")
            .trim(),
        ),
      ).toBe("81px");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath("no-javascript.png") });
    } finally {
      await context.close();
    }
  });
}
