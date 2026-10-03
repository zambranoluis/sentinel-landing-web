import { expect, test } from "@playwright/test";
import { prepareMotion, frames, ready, active } from "./landing-motion-helpers";

test.use({ video: { mode: "on", size: { width: 1440, height: 1000 } } });

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test.describe(`visual scroll pass at ${viewport.width}px`, () => {
    // Create the context at its final viewport; Firefox recordings retain the
    // original capture surface when the page is resized after creation.
    test.use({ viewport });
    test.beforeEach(async ({ page }) => prepareMotion(page, false, viewport));
    test("complete downward and upward pass preserves settled content", async ({
      page,
    }, testInfo) => {
      test.setTimeout(180_000);
      await page.goto("/");
      await ready(page);
      await page.evaluate(async () => {
        await Promise.all(
          document
            .getAnimations()
            .filter((a) => a.id.startsWith("sentinel-"))
            .map((a) => a.finished.catch(() => {})),
        );
      });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const maximum = await page.evaluate(
        () => document.documentElement.scrollHeight - innerHeight,
      );
      const step = viewport.height * 0.65;
      for (const direction of [1, -1]) {
        for (let offset = 0; offset <= maximum + step; offset += step) {
          const y =
            direction === 1
              ? Math.min(offset, maximum)
              : Math.max(maximum - offset, 0);
          await page.evaluate(
            (y) => window.scrollTo({ top: y, behavior: "smooth" }),
            y,
          );
          // Native scroll limits can round by a pixel as composition settles.
          await page.waitForFunction(
            (y) =>
              Math.abs(
                scrollY -
                  Math.min(
                    y,
                    document.documentElement.scrollHeight - innerHeight,
                  ),
              ) <= 2,
            y,
            { timeout: 10_000 },
          );
          await frames(page);
          await page.evaluate(async () => {
            await Promise.all(
              document
                .getAnimations()
                .filter((a) => a.id.startsWith("sentinel-"))
                .map((a) => a.finished.catch(() => {})),
            );
          });
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
        }
        expect(
          await page.evaluate(
            () => new Set(window.entrances.map(({ element }) => element)).size,
          ),
        ).toBe(await page.locator("[data-motion]").count());
        await page.screenshot({
          path: testInfo.outputPath(
            direction === 1 ? "down-pass-end.png" : "up-pass-end.png",
          ),
        });
      }
      expect(errors).toEqual([]);
      await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
      expect(await active(page, "[data-motion]")).toBe(0);
    });
  });
}
