import { chromium, expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

test("200% browser zoom preserves reflow and keyboard navigation", async ({
  baseURL,
}, testInfo) => {
  // The extension exists only in this isolated test profile outside the repository.
  // Chrome's Tabs API changes real browser zoom, unlike CSS zoom or pinch scaling.
  const extension = testInfo.outputPath("zoom-extension");
  mkdirSync(extension, { recursive: true });
  writeFileSync(
    path.join(extension, "manifest.json"),
    JSON.stringify({
      manifest_version: 3,
      name: "Sentinel isolated zoom check",
      version: "1.0.0",
      background: { service_worker: "background.js" },
    }),
  );
  writeFileSync(
    path.join(extension, "background.js"),
    "chrome.runtime.onInstalled.addListener(() => {});",
  );
  const context = await chromium.launchPersistentContext(
    testInfo.outputPath("browser-profile"),
    {
      channel: "chromium",
      viewport: { width: 1440, height: 900 },
      args: [
        `--disable-extensions-except=${extension}`,
        `--load-extension=${extension}`,
      ],
    },
  );
  try {
    const page = context.pages()[0];
    await page.goto(baseURL!);
    const worker =
      context.serviceWorkers()[0] ||
      (await context.waitForEvent("serviceworker"));
    const zoom = await worker.evaluate(async () => {
      const tabs = (
        globalThis as typeof globalThis & {
          chrome: {
            tabs: {
              query: (query: {
                active: boolean;
                currentWindow: boolean;
              }) => Promise<{ id: number }[]>;
              setZoom: (id: number, zoom: number) => Promise<void>;
              getZoom: (id: number) => Promise<number>;
            };
          };
        }
      ).chrome.tabs;
      const [tab] = await tabs.query({ active: true, currentWindow: true });
      await tabs.setZoom(tab.id, 2);
      return tabs.getZoom(tab.id);
    });
    expect(zoom).toBe(2);
    await expect.poll(() => page.evaluate(() => innerWidth)).toBe(720);
    await page.evaluate(() => document.fonts.ready);
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
    await page
      .locator("#how-it-works")
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await capture("browser-zoom-200-workflow.png");
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
