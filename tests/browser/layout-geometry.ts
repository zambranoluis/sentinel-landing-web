import { expect, type Page } from "@playwright/test";

export async function readyForLayout(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("main img, footer img").all()) {
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
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function expectDesktopGeometry(page: Page) {
  const geometry = await page.evaluate(() => {
    const box = (selector: string) => {
      const element = document.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    };
    const content = (selector: string) => {
      const element = document.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const left = rect.left + parseFloat(style.paddingLeft);
      const right = rect.right - parseFloat(style.paddingRight);
      return { left, right, width: right - left };
    };
    const span = (selector: string) => {
      const rects = [...document.querySelectorAll(selector)].map((element) =>
        element.getBoundingClientRect(),
      );
      const left = Math.min(...rects.map((rect) => rect.left));
      const right = Math.max(...rects.map((rect) => rect.right));
      return { left, right, width: right - left };
    };
    const style = (selector: string) =>
      getComputedStyle(document.querySelector(selector)!);
    return {
      viewport: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth,
      standard: {
        navigation: content("header > div"),
        navigationItems: span(
          "header > div > a, header [class*='desktop'] > div",
        ),
        workflow: box("#how-it-works > div"),
        demo: box("#product-demo [class*='experience']"),
        deployment: content("#deployment"),
        benefits: box("section[aria-labelledby='benefits-title'] > div"),
        plans: box("#plans > div"),
        addons: box("#plans > article"),
        faq: content("#faq"),
        faqColumns: span("#faq > div"),
        assessment: box("section[aria-labelledby='assessment-title'] > div"),
        footer: box("footer > div:first-child"),
        legal: box("footer > div:last-child"),
      },
      hero: box("#hero-heading"),
      heroCopy: content("section[aria-labelledby='hero-heading'] > div"),
      photo: box("section[aria-labelledby='hero-heading'] img"),
      detections: box("section[aria-labelledby='hero-heading'] svg"),
      capabilities: content("#capabilities"),
      mosaicOffset: parseFloat(
        getComputedStyle(
          document.querySelector("#capabilities [class*='mosaic']")!,
        ).marginLeft,
      ),
      spacing: {
        heroTop: parseFloat(
          style("section[aria-labelledby='hero-heading'] > div").paddingTop,
        ),
        heroType: parseFloat(style("#hero-heading").fontSize),
        workflowTop: parseFloat(style("#how-it-works").paddingTop),
        workflowBottom: parseFloat(style("#how-it-works").paddingBottom),
        capabilityCard: parseFloat(style("#capabilities article").paddingLeft),
        assessment: parseFloat(
          style(
            "section[aria-labelledby='assessment-title'] [class*='content']",
          ).paddingLeft,
        ),
      },
      navMargin: parseFloat(
        getComputedStyle(document.querySelector("header [class*='desktop']")!)
          .marginLeft,
      ),
      navGap: parseFloat(
        getComputedStyle(
          document.querySelector("header nav[aria-label='Primary'] ul")!,
        ).gap,
      ),
    };
  });
  const frame = Math.min(geometry.viewport, 1920);
  const offset = Math.max(0, (geometry.viewport - 1920) / 2);
  const gutter = offset + frame * 0.1;
  const close = (actual: number, expected: number, label: string) =>
    expect(Math.abs(actual - expected), label).toBeLessThanOrEqual(1);

  for (const [name, rect] of Object.entries(geometry.standard)) {
    close(rect.width, frame * 0.8, `${name}: bounded content width`);
    close(rect.left, gutter, `${name}: shared left boundary`);
    close(
      rect.right,
      geometry.viewport - gutter,
      `${name}: shared right boundary`,
    );
    close(
      rect.left,
      geometry.viewport - rect.right,
      `${name}: balanced margins`,
    );
  }
  close(geometry.hero.left, gutter, "hero: aligned copy");
  close(geometry.heroCopy.width, frame * 0.35, "hero: bounded copy width");
  close(geometry.photo.width, geometry.viewport, "hero: full-width photo");
  close(
    geometry.detections.width,
    geometry.photo.width,
    "hero: artwork alignment",
  );
  close(geometry.detections.left, geometry.photo.left, "hero: artwork origin");
  // Capabilities deliberately spans 88% of the reference frame with 7%/5% gutters.
  close(
    geometry.capabilities.width,
    frame * 0.88,
    "capabilities: bounded exception",
  );
  close(
    geometry.capabilities.left,
    offset + frame * 0.07,
    "capabilities: left gutter",
  );
  close(
    geometry.capabilities.right,
    offset + frame * 0.95,
    "capabilities: right gutter",
  );
  close(
    geometry.mosaicOffset,
    frame * -0.11,
    "capabilities: bounded mosaic offset",
  );
  close(
    geometry.navMargin,
    frame * 0.05,
    "navigation: bounded internal margin",
  );
  close(geometry.navGap, frame * 0.011, "navigation: bounded link spacing");
  expect(geometry.overflow).toBeLessThanOrEqual(geometry.viewport);
  close(
    geometry.spacing.heroTop,
    Math.max(74, frame * 0.065),
    "hero: bounded top spacing",
  );
  close(geometry.spacing.heroType, frame * 0.04, "hero: bounded title scale");
  close(
    geometry.spacing.workflowTop,
    Math.max(74, frame * 0.043),
    "workflow: bounded top spacing",
  );
  close(
    geometry.spacing.workflowBottom,
    Math.max(100, frame * 0.06),
    "workflow: bounded bottom spacing",
  );
  close(
    geometry.spacing.capabilityCard,
    Math.max(16, frame * 0.012),
    "capabilities: bounded card padding",
  );
  close(
    geometry.spacing.assessment,
    frame * 0.04,
    "assessment: bounded panel padding",
  );
  return geometry;
}
