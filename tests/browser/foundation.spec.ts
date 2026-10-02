import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const description =
  "Sentinel detects relevant events and directs your team’s attention where it is needed most.";

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`public entry at ${viewport.name}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("requestfailed", (request) => failedRequests.push(request.url()));
    page.on("response", (response) => {
      if (
        response.url().startsWith("http://127.0.0.1:") &&
        response.status() >= 400
      ) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.setViewportSize(viewport);
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Sentinel | Operational intelligence");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Sentinel", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(description, { exact: true })).toBeVisible();
    const logo = page.getByRole("img", { name: "Sentinel", exact: true });
    await expect(logo).toBeVisible();
    await expect
      .poll(() =>
        logo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    const font = await page.evaluate(async () => {
      const faces = await document.fonts.load("400 16px Roboto");
      await document.fonts.ready;
      return {
        count: faces.length,
        family: getComputedStyle(document.body).fontFamily,
      };
    });
    expect(font.count).toBeGreaterThan(0);
    expect(font.family).toMatch(/^Roboto/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${viewport.name}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}

test("narrow reflow with enlarged text and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.getByText(description, { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
