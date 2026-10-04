import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { launchZoomContext, setBrowserZoom } from "./browser-zoom";
import { expectDesktopGeometry, readyForLayout } from "./layout-geometry";
import { expectFirstScreen } from "./hero-geometry";

test("200% browser zoom preserves reflow and keyboard navigation", async ({
  baseURL,
}, testInfo) => {
  const context = await launchZoomContext(testInfo, 1440);
  try {
    const page = context.pages()[0];
    await page.goto(baseURL!);
    const zoom = await setBrowserZoom(context, 2);
    expect(zoom).toBe(2);
    await expect.poll(() => page.evaluate(() => innerWidth)).toBe(720);
    await page.evaluate(() => document.fonts.ready);
    await expectFirstScreen(page);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Operational intelligence for your camera systems",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    await expect(menu).toBeFocused();
    await menu.press("Enter");
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    // Capture the actual viewport without Playwright's CSS-dimension clipping,
    // which miscalculates screenshot bounds on browser-zoomed pages.
    const session = await context.newCDPSession(page);
    const capture = async (filename: string) => {
      const { data } = await session.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      writeFileSync(testInfo.outputPath(filename), Buffer.from(data, "base64"));
    };
    await capture("browser-zoom-200.png");
    await expect.poll(() => page.evaluate(() => innerWidth)).toBe(720);
    await page
      .getByRole("main")
      .getByRole("button", { name: "Request a Site Assessment", exact: true })
      .first()
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await capture("browser-zoom-200-scene.png");
    const heroScene = page.locator("[data-hero-scene]");
    await heroScene.locator("summary").click();
    await heroScene
      .locator("details")
      .getByRole("button", { name: "Forklift operator", exact: true })
      .click();
    await expect(heroScene).toHaveAttribute("data-pinned", "person-driver");
    const detail = heroScene.locator("[data-hero-detail]");
    await expect(detail).toContainText("Illustrative detection");
    expect(
      await detail.evaluate((e) => {
        const panel = e.getBoundingClientRect();
        const image = document
          .querySelector("[data-hero-artwork]")!
          .getBoundingClientRect();
        return panel.top >= image.bottom - 1 && panel.right <= innerWidth;
      }),
    ).toBe(true);
    await detail.scrollIntoViewIfNeeded();
    await capture("browser-zoom-200-detection.png");
    await detail
      .getByRole("button", { name: "Close detection details" })
      .click();
    await page
      .locator("#how-it-works")
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await capture("browser-zoom-200-workflow.png");
    const workflow = page.locator("[data-workflow]");
    const flag = workflow.getByRole("button", { name: "Flag.", exact: true });
    await flag.focus();
    const workflowScroll = await page.evaluate(() => scrollY);
    await flag.press("Enter");
    await expect(workflow.locator('[data-step="flag"]')).toHaveAttribute(
      "data-emphasized",
      "true",
    );
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
    await expect(workflow.locator("[aria-pressed]")).toHaveCount(0);
    await expect(flag).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(workflowScroll);
    expect(
      await workflow
        .locator("li")
        .evaluateAll((rows) =>
          rows.every(
            (row) =>
              row.scrollWidth <= row.clientWidth &&
              row.scrollHeight <= row.clientHeight,
          ),
        ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    const review = workflow.getByRole("button", {
      name: "Review.",
      exact: true,
    });
    await expect(review).toBeFocused();
    await review.press("Space");
    await expect(workflow.locator('[data-step="review"]')).toHaveAttribute(
      "data-emphasized",
      "true",
    );
    await expect(workflow).toHaveAttribute("data-sequence-running", "true");
    await expect(workflow.getByRole("button")).toHaveCount(5);
    await expect(
      workflow.getByRole("button", { name: /^(Pause|Resume) sequence$/ }),
    ).toHaveCount(0);
    await capture("browser-zoom-200-workflow-selected.png");
    for (const id of [
      "capabilities",
      "product-demo",
      "deployment",
      "plans",
      "faq",
    ]) {
      await page
        .locator(`#${id}`)
        .evaluate((element) =>
          element.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await capture(`browser-zoom-200-${id}.png`);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector("footer")!.offsetTop),
    );
    await expect
      .poll(() =>
        page
          .getByRole("contentinfo")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeCloseTo(0, 0);
    await capture("browser-zoom-200-footer.png");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await capture("browser-zoom-200-legal.png");
    await page.evaluate(() => window.scrollTo(0, 0));
  } finally {
    await context.close();
  }
});

for (const width of [1440, 1920]) {
  for (const factor of [0.8, 0.67, 0.5, 0.25]) {
    test(`${factor * 100}% browser zoom keeps the ${width}px composition bounded`, async ({
      baseURL,
    }, testInfo) => {
      test.setTimeout(90_000);
      const context = await launchZoomContext(testInfo, width);
      try {
        const page = context.pages()[0];
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
        const initial = await page.evaluate(() => ({
          width: innerWidth,
          pixelRatio: devicePixelRatio,
        }));
        expect(initial.width).toBe(width);
        const applied = await setBrowserZoom(context, factor);
        expect(applied).toBeCloseTo(factor, 5);
        await expect
          .poll(async () =>
            Math.abs((await page.evaluate(() => innerWidth)) - width / factor),
          )
          .toBeLessThanOrEqual(1);
        expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(
          initial.pixelRatio * factor,
          5,
        );
        await readyForLayout(page);
        const geometry = await expectDesktopGeometry(page);
        await testInfo.attach("zoom-geometry", {
          body: JSON.stringify(
            { initial, requested: factor, applied, geometry },
            null,
            2,
          ),
          contentType: "application/json",
        });
        const session = await context.newCDPSession(page);
        for (const selector of [
          "section[aria-labelledby='hero-heading']",
          "#capabilities",
          "#product-demo",
          "#plans",
          "#faq",
          "footer",
        ]) {
          await page
            .locator(selector)
            .evaluate((element) =>
              element.scrollIntoView({ block: "start", behavior: "instant" }),
            );
          const { data } = await session.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: false,
          });
          writeFileSync(
            testInfo.outputPath(`${selector.replace(/[^a-z-]/gi, "")}.png`),
            Buffer.from(data, "base64"),
          );
        }
      } finally {
        await context.close();
      }
    });
  }
}
