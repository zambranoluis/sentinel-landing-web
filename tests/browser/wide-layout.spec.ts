import { test } from "@playwright/test";
import { expectDesktopGeometry, readyForLayout } from "./layout-geometry";

for (const width of [1280, 1440, 1919, 1920, 1921, 2560, 3440, 3840, 7680]) {
  test(`desktop composition remains centered at ${width}px`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await readyForLayout(page);
    const geometry = await expectDesktopGeometry(page);
    await testInfo.attach("layout-geometry", {
      body: JSON.stringify(geometry, null, 2),
      contentType: "application/json",
    });
    if ([1920, 3840].includes(width)) {
      for (const selector of [
        "section[aria-labelledby='hero-heading']",
        "#capabilities",
        "#product-demo",
        "#plans",
        "#faq",
        "footer",
      ]) {
        await page.locator(selector).screenshot({
          path: testInfo.outputPath(
            `${width}-${selector.replace(/[^a-z-]/gi, "")}.png`,
          ),
          animations: "disabled",
        });
      }
    }
  });
}
