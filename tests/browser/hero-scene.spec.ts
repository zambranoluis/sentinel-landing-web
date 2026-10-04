import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { heroDetections } from "../../src/components/landing/heroDetections";

const scene = (page: Page) => page.locator("[data-hero-scene]");
const detail = (page: Page) => page.locator("[data-hero-detail]");
const target = (page: Page, id: string) =>
  page.locator(`[data-detection="${id}"]`);

async function open(
  page: Page,
  reducedMotion: "reduce" | "no-preference" = "reduce",
) {
  await page.emulateMedia({ reducedMotion });
  await page.goto("/");
  await expect(scene(page)).toHaveAttribute("data-ready", "true", {
    timeout: 15_000,
  });
  await page
    .locator("[data-hero-artwork] img")
    .evaluate((image: HTMLImageElement) => image.decode());
}

async function point(page: Page, x: number, y: number) {
  return page
    .locator("svg[aria-label='Illustrative warehouse detections']")
    .evaluate(
      (svg: SVGSVGElement, p) => {
        const point = new DOMPoint(p.x, p.y).matrixTransform(
          svg.getScreenCTM()!,
        );
        return { x: point.x, y: point.y };
      },
      { x, y },
    );
}

async function selectFromList(page: Page, name: string) {
  const disclosure = scene(page).locator("details");
  if (
    !(await disclosure.getAttribute("open")) &&
    !(await disclosure.evaluate((e: HTMLDetailsElement) => e.open))
  )
    await disclosure.locator("summary").click();
  await disclosure.getByRole("button", { name, exact: true }).click();
}

test("all twelve detections expose illustrative details and pin/switch/toggle", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.locator("[data-detection]")).toHaveCount(12);
  for (const item of heroDetections) {
    await selectFromList(page, item.title);
    await expect(scene(page)).toHaveAttribute("data-pinned", item.id);
    await expect(detail(page).getByRole("heading")).toHaveText(item.title);
    await expect(detail(page)).toContainText(item.description);
    await expect(detail(page).locator("dt")).toHaveCount(2);
    await expect(detail(page)).toContainText("Illustrative detection");
    await expect(target(page, item.id)).toHaveAttribute("aria-pressed", "true");
  }
  await selectFromList(page, heroDetections.at(-1)!.title);
  await expect(detail(page)).toHaveCount(0);
  await expect(scene(page).locator("[aria-live]")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("nested people and route hit regions win; background and Close clear", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  for (const [id, x, y] of [
    ["person-truck", 838, 395],
    ["person-driver", 1338, 590],
    ["truck", 760, 400],
    ["forklift", 1390, 690],
    ["pallet-bay", 1016, 490],
    ["pallet-forklift", 1185, 600],
    ["pallet-wall", 1586, 600],
    ["pallet-front", 1280, 850],
    ["pallet-right", 1570, 750],
    ["person-bay", 1078, 505],
    ["person-door", 1447, 470],
  ] as const) {
    const p = await point(page, x, y);
    await page.mouse.click(p.x, p.y);
    await expect(scene(page)).toHaveAttribute("data-pinned", id);
    await page.keyboard.press("Escape");
  }
  const route = await target(page, "transfer-route")
    .locator("path")
    .last()
    .evaluate((path: SVGPathElement) => {
      const p = path
        .getPointAtLength(path.getTotalLength() * 0.38)
        .matrixTransform(path.getScreenCTM()!);
      return { x: p.x, y: p.y };
    });
  await page.mouse.click(route.x, route.y + 4);
  await expect(scene(page)).toHaveAttribute("data-pinned", "transfer-route");
  await detail(page)
    .getByRole("button", { name: "Close detection details" })
    .click();
  await expect(detail(page)).toHaveCount(0);
  await selectFromList(page, "Loading truck");
  await page.mouse.click(1300, 160);
  await expect(detail(page)).toHaveCount(0);
});

test("hover survives crossing to callout; keyboard and pin take precedence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const p = await point(page, 1078, 505);
  await page.mouse.move(p.x, p.y);
  await expect(scene(page)).toHaveAttribute("data-selected", "person-bay");
  await detail(page).hover();
  // Longer than exit grace: this verifies the callout cancels pending dismissal.
  await page.waitForTimeout(220);
  await expect(detail(page)).toBeVisible();
  await target(page, "person-truck").focus();
  await page.mouse.move(p.x, p.y);
  await expect(scene(page)).toHaveAttribute("data-selected", "person-truck");
  await target(page, "person-truck").press("Enter");
  await target(page, "person-driver").focus();
  await expect(scene(page)).toHaveAttribute("data-selected", "person-truck");
  await target(page, "person-driver").press("Space");
  await expect(scene(page)).toHaveAttribute("data-pinned", "person-driver");
  await target(page, "person-driver").press("Space");
  await expect(detail(page)).toHaveCount(0);
  await target(page, "person-bay").focus();
  await expect(detail(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(detail(page)).toHaveCount(0);
  await expect(target(page, "person-bay")).toBeFocused();
  await target(page, heroDetections[0].id).focus();
  for (const item of heroDetections.slice(1)) {
    await page.keyboard.press("Tab");
    await expect(target(page, item.id)).toBeFocused();
  }
  await page.keyboard.press("Tab");
  const summary = scene(page).locator("summary");
  await expect(summary).toBeFocused();
  await summary.press("Enter");
  await page.keyboard.press("Tab");
  const first = scene(page)
    .locator("details")
    .getByRole("button", { name: "Loading truck", exact: true });
  await expect(first).toBeFocused();
  await first.press("Space");
  await expect(scene(page)).toHaveAttribute("data-pinned", "truck");
  await expect(summary).toBeFocused();
});

test("selection stays aligned and bounded through responsive resizing", async ({
  page,
}, testInfo) => {
  await open(page);
  await selectFromList(page, "Forklift operator");
  for (const [width, height] of [
    [390, 844],
    [720, 1000],
    [721, 1000],
    [834, 1112],
    [1440, 900],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await expect
      .poll(async () =>
        detail(page).evaluate((element) => {
          const box = element.getBoundingClientRect();
          const art = document
            .querySelector("[data-hero-artwork]")!
            .getBoundingClientRect();
          const copy = document
            .querySelector("[data-hero-copy]")!
            .getBoundingClientRect();
          return !matchMedia("(min-width: 721px)").matches
            ? box.top >= art.bottom - 1
            : box.left >= copy.right &&
                box.right <= art.right &&
                box.top >= art.top &&
                box.bottom <= art.bottom;
        }),
      )
      .toBe(true);
    const alignment = await page
      .locator("[data-hero-camera]")
      .evaluate((element) => {
        const img = element.querySelector("img")!.getBoundingClientRect();
        const svg = element.querySelector("svg")!.getBoundingClientRect();
        return [
          Math.abs(img.x - svg.x),
          Math.abs(img.y - svg.y),
          Math.abs(img.width - svg.width),
          Math.abs(img.height - svg.height),
        ];
      });
    expect(alignment.every((value) => value < 0.1)).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`selected-${width}.png`),
    });
  }
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await expect(detail(page)).toBeVisible();
  expect(
    await detail(page).evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
});

test("touch selection presents details below the photograph and preserves camera rest", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  try {
    await page.goto(testInfo.project.use.baseURL!);
    await expect(scene(page)).toHaveAttribute("data-ready", "true", {
      timeout: 15_000,
    });
    const originalArt = await page.locator("[data-hero-artwork]").boundingBox();
    const p = await point(page, 1078, 505);
    await page.touchscreen.tap(p.x, p.y);
    await expect(scene(page)).toHaveAttribute("data-pinned", "person-bay");
    const art = await page.locator("[data-hero-artwork]").boundingBox();
    const panel = await detail(page).boundingBox();
    expect(art!.height).toBeCloseTo(originalArt!.height, 0);
    expect(panel!.y).toBeCloseTo(art!.y + art!.height, 0);
    await expect(page.locator("[data-hero-camera]")).toHaveCSS(
      "transform",
      "none",
    );
    await detail(page)
      .getByRole("button", { name: "Close detection details" })
      .tap();
    await expect(detail(page)).toHaveCount(0);
    await scene(page).locator("summary").tap();
    await expect(scene(page).locator("details button")).toHaveCount(12);
  } finally {
    await context.close();
  }
});

test("camera, route and accent motion pause, suspend and respect reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "no-preference");
  await expect(scene(page)).toHaveAttribute("data-running", "true");
  await page.mouse.move(1300, 200);
  await expect
    .poll(() =>
      page
        .locator("[data-hero-camera]")
        .evaluate((e) => getComputedStyle(e).transform),
    )
    .not.toBe("none");
  const matrix = await page.locator("[data-hero-camera]").evaluate((e) => {
    const m = new DOMMatrix(getComputedStyle(e).transform);
    return { x: m.m41, y: m.m42, scale: m.m11 };
  });
  expect(Math.abs(matrix.x)).toBeLessThanOrEqual(6);
  expect(Math.abs(matrix.y)).toBeLessThanOrEqual(6);
  expect(matrix.scale).toBeGreaterThan(1);
  const accents = target(page, "truck").locator("path").nth(2);
  const route = target(page, "transfer-route").locator("path").nth(1);
  const firstShape = await route.evaluate((e: SVGPathElement) =>
    e.getTotalLength(),
  );
  await expect
    .poll(() => route.evaluate((e: SVGPathElement) => e.getTotalLength()))
    .not.toBe(firstShape);
  const endpoints = await route.evaluate((e: SVGPathElement) => {
    const start = e.getPointAtLength(0);
    const end = e.getPointAtLength(e.getTotalLength());
    return [start.x, start.y, end.x, end.y];
  });
  endpoints.forEach((value, i) =>
    expect(value).toBeCloseTo([590, 454, 1497, 919][i], 1),
  );
  const before = await accents.evaluate(
    (e) => getComputedStyle(e).strokeDashoffset,
  );
  await expect
    .poll(() => accents.evaluate((e) => getComputedStyle(e).strokeDashoffset))
    .not.toBe(before);
  await scene(page).getByRole("button", { name: "Pause animation" }).click();
  await expect(scene(page)).toHaveAttribute("data-running", "false");
  await expect(accents).toHaveCSS("animation-play-state", "paused");
  const pausedTime = await accents.evaluate(
    (e) => e.getAnimations()[0].currentTime,
  );
  const pausedShape = await route.evaluate((e: SVGPathElement) =>
    e.getTotalLength(),
  );
  await page.waitForTimeout(220);
  expect(await accents.evaluate((e) => e.getAnimations()[0].currentTime)).toBe(
    pausedTime,
  );
  expect(await route.evaluate((e: SVGPathElement) => e.getTotalLength())).toBe(
    pausedShape,
  );
  await scene(page).getByRole("button", { name: "Resume animation" }).click();
  await expect(scene(page)).toHaveAttribute("data-running", "true");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(scene(page)).toHaveAttribute("data-running", "false");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(scene(page)).toHaveAttribute("data-running", "true");
  // Controlled visibility event checks the lifecycle handler, not an OS tab switch.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(scene(page)).toHaveAttribute("data-running", "false");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(scene(page)).toHaveAttribute("data-running", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene(page)).toHaveAttribute("data-running", "false");
  await expect(accents).toHaveCSS("animation-name", "none");
  await expect(page.locator("[data-hero-camera]")).toHaveCSS(
    "transform",
    "none",
  );
});

test("native disclosure retains every description without JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(testInfo.project.use.baseURL!);
    await scene(page).locator("summary").click();
    for (const item of heroDetections)
      await expect(scene(page).locator("details")).toContainText(
        item.description,
      );
    await expect(scene(page).getByRole("button")).toHaveCount(0);
    await expect(page.locator("[data-detection][tabindex]")).toHaveCount(0);
    await expect(target(page, "truck").locator("path").nth(2)).toHaveCSS(
      "animation-name",
      "none",
    );
  } finally {
    await context.close();
  }
});

test("selected scene and disclosure have no automated accessibility violations", async ({
  page,
}) => {
  await open(page);
  await selectFromList(page, "Person at the loading bay");
  expect(
    (await new AxeBuilder({ page }).include("[data-hero-scene]").analyze())
      .violations,
  ).toEqual([]);
  await scene(page).locator("summary").click();
  expect(
    (await new AxeBuilder({ page }).include("[data-hero-scene]").analyze())
      .violations,
  ).toEqual([]);
});

test("normal-motion selection remains clickable and preserves the approved composition", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "no-preference");
  await expect(page.locator("#hero-heading")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: testInfo.outputPath("desktop-idle.png") });
  const p = await point(page, 1338, 590);
  await page.mouse.move(p.x, p.y);
  await expect(scene(page)).toHaveAttribute("data-selected", "person-driver");
  await page.mouse.click(p.x, p.y);
  await expect(scene(page)).toHaveAttribute("data-pinned", "person-driver");
  await expect(detail(page)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("desktop-selected.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await detail(page).scrollIntoViewIfNeeded();
  await page
    .locator("section[aria-labelledby='hero-heading']")
    .screenshot({ path: testInfo.outputPath("mobile-selected.png") });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(
    await detail(page).evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
