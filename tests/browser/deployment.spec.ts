import { expect, test, type Page } from "@playwright/test";
import { deployment } from "../../src/components/landing/content";
import { writeFileSync } from "node:fs";
import { launchZoomContext, setBrowserZoom } from "./browser-zoom";
import {
  count,
  finish,
  frames,
  position,
  prepareMotion,
  ready,
} from "./landing-motion-helpers";

test.setTimeout(90_000);

async function loaded(page: Page) {
  // Firefox cannot resolve this page's fonts.ready promise with scripts disabled.
  // Poll the same readiness state through synchronous page evaluations instead.
  await expect
    .poll(() => page.evaluate(() => document.fonts.status))
    .toBe("loaded");
  for (const image of await page.locator("#deployment img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
}

async function geometry(page: Page) {
  return page.locator("#deployment").evaluate((section) => {
    const rect = (element: Element) => {
      const r = element.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    };
    const heading = section.querySelector("h2")!;
    const lead = section.querySelector(":scope > p")!;
    const list = section.querySelector("ol")!;
    return {
      width: innerWidth,
      overflow: document.documentElement.scrollWidth,
      sectionOverflow: getComputedStyle(section).overflowX,
      heading: rect(heading),
      lead: rect(lead),
      list: rect(list),
      items: [...list.children].map((item) => ({
        row: rect(item),
        frame: rect(item.firstElementChild!),
        copy: rect(item.lastElementChild!),
        image: rect(item.querySelector("img")!),
        title: rect(item.querySelector("h3")!),
        body: rect(item.querySelector("p")!),
        number: item.querySelector("span")!.textContent,
        frameOverflowX: getComputedStyle(item.firstElementChild!).overflowX,
        frameOverflowY: getComputedStyle(item.firstElementChild!).overflowY,
      })),
    };
  });
}

function close(actual: number, expected: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);
}

for (const width of [
  320, 390, 720, 721, 834, 1024, 1279, 1280, 1440, 1920, 2560, 3840,
]) {
  test(`deployment illustration layout at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#deployment", { waitUntil: "domcontentloaded" });
    await loaded(page);
    const g = await geometry(page);
    expect(g.overflow).toBeLessThanOrEqual(width);
    expect(g.sectionOverflow).toBe("visible");
    close(g.lead.top - g.heading.bottom, 20);
    close(g.list.top - g.lead.bottom, 32);
    for (const [index, item] of g.items.entries()) {
      expect(item.frame.width / item.frame.height).toBeCloseTo(1.5, 2);
      expect(item.frameOverflowX).toBe("clip");
      expect(item.frameOverflowY).toBe("visible");
      close(item.frame.width, g.items[0].frame.width);
      close(item.image.width, item.frame.width * [1.14, 1.32, 1.22][index]);
      close(
        (item.image.left + item.image.right) / 2,
        (item.frame.left + item.frame.right) / 2,
      );
      close(
        (item.image.top + item.image.bottom) / 2,
        (item.frame.top + item.frame.bottom) / 2,
      );
      expect(item.number).toBe(String(index + 1).padStart(2, "0"));
      await expect(page.locator("#deployment h3").nth(index)).toHaveText(
        deployment[index].title,
      );
      await expect(page.locator("#deployment li p").nth(index)).toHaveText(
        deployment[index].body,
      );
      expect(item.body.bottom).toBeLessThanOrEqual(item.row.bottom + 1);
      expect(item.title.bottom).toBeLessThanOrEqual(item.body.top);
      if (width <= 720) {
        close(item.frame.left, 12);
        close(item.frame.right, width - 12);
        close(item.copy.left, g.heading.left);
        expect(item.copy.top).toBeGreaterThanOrEqual(item.frame.bottom);
      } else if (width < 1280) {
        close(item.copy.left - item.frame.right, 24);
        close(item.frame.width, (g.list.width - 24) * 0.6);
        close(item.copy.width, (g.list.width - 24) * 0.4);
      } else {
        close(item.frame.top, g.items[0].frame.top);
        close(item.frame.width, g.list.width / 3);
      }
      if (index > 0 && width < 1280) {
        expect(item.row.top).toBeGreaterThanOrEqual(
          g.items[index - 1].row.bottom + 47,
        );
      }
    }
    if (width >= 1280) {
      close(g.list.width, Math.min(width, 1920) * 0.92);
      close(g.list.left, (width - g.list.width) / 2);
      close(g.heading.left, (width - Math.min(width, 1920) * 0.8) / 2);
      expect(g.lead.width).toBeLessThanOrEqual(960);
    }
    await testInfo.attach("deployment-geometry", {
      body: JSON.stringify(g, null, 2),
      contentType: "application/json",
    });
    if ([390, 834, 1920, 3840].includes(width)) {
      await page
        .locator("#deployment")
        .screenshot({ path: testInfo.outputPath("deployment.png") });
    }
  });
}

for (const width of [320, 834, 1280]) {
  test(`deployment reflows with 200% text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#deployment", { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await loaded(page);
    const g = await geometry(page);
    expect(g.overflow).toBeLessThanOrEqual(width);
    for (const item of g.items) {
      expect(item.body.bottom).toBeLessThanOrEqual(item.row.bottom + 1);
      expect(item.title.bottom).toBeLessThanOrEqual(item.body.top);
    }
    expect(
      await page
        .locator("#deployment h2, #deployment p, #deployment h3")
        .evaluateAll((elements) =>
          elements.every(
            (e) =>
              e.scrollWidth <= e.clientWidth &&
              getComputedStyle(e).overflowY === "visible",
          ),
        ),
    ).toBe(true);
  });

  test(`deployment remains complete without JavaScript at ${width}px`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      reducedMotion: "reduce",
      viewport: { width, height: 1000 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL}/#deployment`, {
        waitUntil: "domcontentloaded",
      });
      await loaded(page);
      expect((await geometry(page)).overflow).toBeLessThanOrEqual(width);
      for (const step of await page.locator("#deployment li").all()) {
        await step.scrollIntoViewIfNeeded();
        await expect(step).toHaveCSS("opacity", "1");
        await expect(step.locator("h3")).toBeVisible();
        await expect(step.locator("p")).toBeVisible();
      }
    } finally {
      await context.close();
    }
  });

  test(`deployment entrance replay and fragment focus at ${width}px`, async ({
    page,
  }, testInfo) => {
    await prepareMotion(page, true, { width, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await ready(page);
    const first = "#deployment li:first-child";
    await position(page, first, 180);
    await expect.poll(() => count(page, first)).toBe(1);
    await page.locator(first).evaluate((element) => {
      const animation = element
        .getAnimations()
        .find((a) => a.id === "sentinel-entrance")!;
      animation.currentTime = Number(animation.effect!.getTiming().delay) + 200;
    });
    await frames(page);
    await expect(page.locator(first)).not.toHaveCSS("opacity", "1");
    await page.screenshot({
      path: testInfo.outputPath("deployment-intermediate.png"),
    });
    expect((await geometry(page)).overflow).toBeLessThanOrEqual(width);
    await finish(page, first);
    await position(
      page,
      first,
      -((await page.locator(first).boundingBox())!.height + 160),
    );
    await finish(page, first);
    await position(page, first, 180);
    await expect.poll(() => count(page, first)).toBe(2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(first)).toHaveCSS("opacity", "1");
    await expect
      .poll(() => page.locator(first).evaluate((e) => e.getAnimations().length))
      .toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width < 1280) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page
        .locator("#mobile-navigation")
        .getByRole("link", { name: "Deployment", exact: true })
        .press("Enter");
    } else {
      await page
        .locator("header nav[aria-label='Primary']")
        .getByRole("link", { name: "Deployment", exact: true })
        .press("Enter");
    }
    await expect(page.locator("#deployment")).toBeFocused();
    for (const target of await page
      .locator("#deployment [data-motion]")
      .all()) {
      await expect(target).toHaveCSS("opacity", "1");
    }
  });
}

for (const factor of [2, 0.5]) {
  test(`deployment reflows at ${factor * 100}% browser zoom`, async ({
    baseURL,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName !== "chromium",
      "The isolated browser zoom extension uses Chromium.",
    );
    const context = await launchZoomContext(testInfo, 1440);
    try {
      const page = context.pages()[0];
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${baseURL}/#deployment`, {
        waitUntil: "domcontentloaded",
      });
      expect(await setBrowserZoom(context, factor)).toBe(factor);
      await expect
        .poll(() => page.evaluate(() => innerWidth))
        .toBe(1440 / factor);
      await loaded(page);
      const g = await geometry(page);
      expect(g.overflow).toBeLessThanOrEqual(g.width);
      if (factor === 2) {
        for (const item of g.items) {
          close(item.frame.left, 12);
          close(item.frame.right, g.width - 12);
          expect(item.copy.top).toBeGreaterThanOrEqual(item.frame.bottom);
        }
      } else {
        close(g.list.width, 1766.4);
        close(g.list.left, (g.width - 1766.4) / 2);
      }
      await page
        .locator("#deployment")
        .evaluate((element) => element.scrollIntoView({ block: "start" }));
      const session = await context.newCDPSession(page);
      const { data } = await session.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      writeFileSync(
        testInfo.outputPath("deployment-browser-zoom.png"),
        Buffer.from(data, "base64"),
      );
    } finally {
      await context.close();
    }
  });
}
