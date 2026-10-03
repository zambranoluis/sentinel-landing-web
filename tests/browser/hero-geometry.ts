import { expect, type Page } from "@playwright/test";

export async function expectFirstScreen(page: Page, measured = true) {
  // Layout may change when local fonts load or the navbar observer runs.
  await expect
    .poll(() => page.evaluate(() => document.fonts.status))
    .toBe("loaded");
  if (measured) {
    await expect
      .poll(() =>
        page.evaluate(() =>
          Math.abs(
            parseFloat(
              document.documentElement.style.getPropertyValue(
                "--navbar-height",
              ),
            ) -
              document.querySelector("header")!.getBoundingClientRect().height,
          ),
        ),
      )
      .toBeLessThan(0.1);
  }
  const geometry = await page.evaluate(() => {
    const box = (selector: string) => {
      const rect = document.querySelector(selector)!.getBoundingClientRect();
      return {
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY,
        height: rect.height,
        width: rect.width,
      };
    };
    const hero = "section[aria-labelledby='hero-heading']";
    return {
      width: innerWidth,
      height: innerHeight,
      overflow: document.documentElement.scrollWidth,
      navbar: box("header"),
      hero: box(hero),
      copy: box(`${hero} > div`),
      scene: box(`${hero} figure`),
      image: box(`${hero} img`),
      detections: box(`${hero} svg`),
      next: box("#how-it-works"),
    };
  });
  expect(geometry.hero.top).toBeCloseTo(geometry.navbar.bottom, 0);
  expect(geometry.next.top).toBeCloseTo(geometry.hero.bottom, 0);
  expect(geometry.next.top).toBeGreaterThanOrEqual(geometry.height - 1);
  expect(geometry.copy.top).toBeGreaterThanOrEqual(geometry.hero.top);
  expect(geometry.copy.bottom).toBeLessThanOrEqual(geometry.hero.bottom + 1);
  expect(geometry.overflow).toBeLessThanOrEqual(geometry.width);
  expect(geometry.image.height).toBeCloseTo(geometry.detections.height, 0);
  expect(geometry.image.width).toBeCloseTo(geometry.detections.width, 0);
  if (geometry.width <= 720) {
    expect(geometry.scene.top).toBeCloseTo(geometry.copy.bottom, 0);
    expect(geometry.scene.bottom).toBeCloseTo(geometry.hero.bottom, 0);
    expect(geometry.scene.height).toBeGreaterThanOrEqual(
      (geometry.width * 941) / 1672 - 1,
    );
    expect(geometry.image.height).toBeCloseTo(geometry.scene.height, 0);
  }
  return geometry;
}
