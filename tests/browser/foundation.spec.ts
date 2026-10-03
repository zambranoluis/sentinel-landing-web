import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const headline = "Operational intelligence for your camera systems";
const description =
  "Sentinel detects relevant events and directs your team’s attention where it is needed most.";
const explanation = "Assessment requests are not available on this site yet.";
const navigationLabels = [
  "How it works",
  "Capabilities",
  "Deployment",
  "Plans",
  "FAQ",
];
const footerLabels = {
  Product: [
    "How it works",
    "Capabilities",
    "Deployment",
    "Request an assessment",
    "FAQ",
  ],
  Industries: [
    "Retail",
    "Shops & pharmacies",
    "Restaurants & bars",
    "Manufacturing",
    "Gas stations",
    "Hotels",
  ],
  Company: ["About CrimsonTide AI", "Contact", "News"],
  Legal: ["Privacy Policy", "Terms of Service", "Biometric & Consent Policy"],
};

const observations = new WeakMap<
  Page,
  { errors: string[]; requests: string[] }
>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  const requests: string[] = [];
  observations.set(page, { errors, requests });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (request) => requests.push(request.url()));
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:") &&
      response.status() >= 400
    )
      requests.push(`${response.status()} ${response.url()}`);
  });
});
test.afterEach(async ({ page }) => {
  expect(observations.get(page)?.errors).toEqual([]);
  expect(observations.get(page)?.requests).toEqual([]);
});

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
}
async function disabledAssessment(page: Page, count: number) {
  const actions = page.getByRole("button", {
    name: "Request a Site Assessment",
    exact: true,
  });
  await expect(actions).toHaveCount(count);
  for (const action of await actions.all()) {
    await expect(action).toBeDisabled();
    await expect(action).not.toHaveAttribute("aria-describedby");
  }
  await expect(page.getByText(explanation, { exact: true })).toHaveCount(0);
}

async function iconState(page: Page) {
  return page
    .locator("header button[aria-controls] > span > span")
    .evaluateAll((lines) =>
      lines.map((line) => {
        const style = getComputedStyle(line);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return {
          y: matrix.m42,
          angle: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
          opacity: Number(style.opacity),
        };
      }),
    );
}

async function expectIcon(page: Page, open: boolean) {
  await expect
    .poll(async () =>
      (await iconState(page)).map(({ y, angle, opacity }) => ({
        y: Math.round(y),
        angle: Math.round(angle),
        opacity: Math.round(opacity * 100) / 100,
      })),
    )
    .toEqual([
      { y: open ? 0 : -6, angle: open ? 45 : 0, opacity: 1 },
      { y: 0, angle: 0, opacity: open ? 0 : 1 },
      { y: open ? 0 : 6, angle: open ? -45 : 0, opacity: 1 },
    ]);
}

// Seek the browser's actual CSS transitions for deterministic intermediate evidence.
async function seekIcon(page: Page, progress: number) {
  return page
    .locator("header button[aria-controls] > span")
    .evaluate(async (icon, fraction) => {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      const animations = icon.getAnimations({ subtree: true });
      return animations.map((animation) => {
        const timing = animation.effect!.getTiming();
        animation.pause();
        animation.currentTime = Number(timing.duration) * fraction;
        return { duration: Number(timing.duration), easing: timing.easing };
      });
    }, progress);
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
]) {
  test(`navigation panel transition and interruption at ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const toggle = page.locator("header button[aria-controls]");
    const panel = page.locator("#mobile-navigation");
    await expect(panel).toBeHidden();
    await expect(panel).toHaveAttribute("inert", "");
    const opening = await panel.evaluate(async (element) => {
      // Start and sample in one browser task so WebKit cannot finish the
      // 200ms transition while the automation protocol is collecting state.
      const trigger = document.querySelector<HTMLButtonElement>(
        "header button[aria-controls]",
      )!;
      trigger.focus();
      trigger.click();
      await Promise.resolve();
      const transitions = element.getAnimations();
      for (const animation of transitions) {
        animation.pause();
        animation.currentTime =
          Number(animation.effect!.getTiming().duration) / 2;
      }
      const style = getComputedStyle(element);
      return {
        count: transitions.length,
        opacity: Number(style.opacity),
        y: new DOMMatrixReadOnly(style.transform).m42,
      };
    });
    expect(opening.count).toBe(2);
    expect(opening.opacity).toBeGreaterThan(0);
    expect(opening.opacity).toBeLessThan(1);
    expect(opening.y).toBeGreaterThan(-8);
    expect(opening.y).toBeLessThan(0);
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(panel).not.toHaveAttribute("inert");
    await page.screenshot({ path: testInfo.outputPath("panel-opening.png") });
    await panel.evaluate((element) => {
      for (const animation of element.getAnimations()) animation.finish();
    });
    const reversal = await panel.evaluate(async (element) => {
      const trigger = document.querySelector<HTMLButtonElement>(
        "header button[aria-controls]",
      )!;
      const read = () => {
        const style = getComputedStyle(element);
        return {
          opacity: Number(style.opacity),
          y: new DOMMatrixReadOnly(style.transform).m42,
        };
      };
      trigger.click();
      await Promise.resolve();
      // Slow only this sampled native timeline; timing and natural endpoints
      // are asserted separately. Busy frames must not skip the reversal point.
      for (const animation of element.getAnimations())
        animation.playbackRate = 0.1;
      const deadline = performance.now() + 1000;
      let before = read();
      while (before.opacity > 0.75 && performance.now() < deadline) {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
        before = read();
      }
      const closed = {
        inert: (element as HTMLElement).inert,
        hidden: element.getAttribute("aria-hidden"),
        pointerEvents: getComputedStyle(element).pointerEvents,
      };
      trigger.click();
      await Promise.resolve();
      const transitions = element.getAnimations();
      for (const animation of transitions) {
        animation.pause();
        animation.currentTime = 0;
      }
      return { before, after: read(), closed, count: transitions.length };
    });
    expect(reversal.closed).toEqual({
      inert: true,
      hidden: "true",
      pointerEvents: "none",
    });
    expect(reversal.count).toBe(2);
    expect(reversal.before.opacity).toBeGreaterThan(0);
    expect(reversal.before.opacity).toBeLessThan(1);
    expect(
      Math.abs(reversal.after.opacity - reversal.before.opacity),
    ).toBeLessThan(0.2);
    expect(Math.abs(reversal.after.y - reversal.before.y)).toBeLessThan(1.6);
    await panel.evaluate((element) => {
      for (const animation of element.getAnimations()) animation.play();
    });
    await expect
      .poll(() => panel.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBe(1);
    await page.screenshot({ path: testInfo.outputPath("panel-open.png") });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await toggle.click();
    await expect(panel).toBeHidden();
    await toggle.click();
    expect(
      await panel.evaluate((element) => ({
        opacity: getComputedStyle(element).opacity,
        transform: getComputedStyle(element).transform,
        animations: element.getAnimations().length,
      })),
    ).toEqual({ opacity: "1", transform: "none", animations: 0 });
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test(`burger icon states and rapid reversal at ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const toggle = page.locator("header button[aria-controls]");
    await expect(toggle).toHaveAccessibleName("Menu");
    await expect(toggle).toHaveText("");
    await expect(toggle).toHaveAttribute("aria-controls", "mobile-navigation");
    await expect(toggle.locator("span[aria-hidden='true']")).toHaveCount(1);
    const target = await toggle.boundingBox();
    expect(target?.width).toBe(44);
    expect(target?.height).toBe(44);
    const icon = toggle.locator(":scope > span");
    const bounds = await icon.boundingBox();
    expect(bounds?.width).toBe(24);
    expect(bounds?.height).toBe(24);
    expect(bounds!.x - target!.x).toBe(10);
    expect(bounds!.y - target!.y).toBe(10);
    await expectIcon(page, false);
    await page.screenshot({ path: testInfo.outputPath("icon-closed.png") });

    const opening = await toggle.evaluate(async (button) => {
      (button as HTMLButtonElement).focus();
      (button as HTMLButtonElement).click();
      await Promise.resolve();
      return button
        .firstElementChild!.getAnimations({ subtree: true })
        .map((animation) => {
          const timing = animation.effect!.getTiming();
          animation.pause();
          animation.currentTime = Number(timing.duration) / 2;
          return { duration: Number(timing.duration), easing: timing.easing };
        });
    });
    expect(opening).toHaveLength(3);
    for (const timing of opening)
      expect(timing).toEqual({ duration: 200, easing: "ease-in-out" });
    await expect(toggle).toHaveAccessibleName("Close menu");
    await expect(toggle).toHaveText("");
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    const halfway = await iconState(page);
    expect(halfway[0].y).toBeCloseTo(-3, 1);
    expect(halfway[0].angle).toBeCloseTo(22.5, 1);
    expect(halfway[1].opacity).toBeCloseTo(0.5, 1);
    expect(halfway[2].y).toBeCloseTo(3, 1);
    expect(halfway[2].angle).toBeCloseTo(-22.5, 1);
    await page.screenshot({
      path: testInfo.outputPath("icon-opening-halfway.png"),
    });
    // Finish the sought capture before testing an interruption on a live timeline.
    await toggle.click();
    await seekIcon(page, 1);
    await expectIcon(page, false);
    const interrupted = await toggle.evaluate(async (button) => {
      const trigger = button as HTMLButtonElement;
      const icon = button.firstElementChild!;
      const read = () =>
        Array.from(icon.children, (line) => {
          const style = getComputedStyle(line);
          const matrix = new DOMMatrixReadOnly(style.transform);
          return {
            y: matrix.m42,
            angle: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
            opacity: Number(style.opacity),
          };
        });
      trigger.click();
      await Promise.resolve();
      for (const animation of icon.getAnimations({ subtree: true }))
        animation.playbackRate = 0.1;
      let before = read();
      const deadline = performance.now() + 3000;
      while (before[1].opacity > 0.5 && performance.now() < deadline) {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
        before = read();
      }
      trigger.click();
      await Promise.resolve();
      const animations = icon.getAnimations({ subtree: true });
      for (const animation of animations) {
        animation.pause();
        animation.currentTime = 0;
      }
      return { before, after: read(), count: animations.length };
    });
    expect(interrupted.count).toBe(3);
    expect(interrupted.before[0].angle).toBeGreaterThan(0);
    expect(interrupted.before[0].angle).toBeLessThan(45);
    await expect(toggle).toHaveAccessibleName("Menu");
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    const reversal = interrupted.after;
    // Allow one display frame of sampling drift, while rejecting endpoint jumps.
    for (let index = 0; index < 3; index++) {
      expect(
        Math.abs(reversal[index].y - interrupted.before[index].y),
      ).toBeLessThan(1);
      expect(
        Math.abs(reversal[index].angle - interrupted.before[index].angle),
      ).toBeLessThan(7.5);
      expect(
        Math.abs(reversal[index].opacity - interrupted.before[index].opacity),
      ).toBeLessThan(1 / 6);
    }
    await seekIcon(page, 0.5);
    const closing = await iconState(page);
    expect(closing[0].y).toBeLessThan(reversal[0].y);
    expect(closing[0].angle).toBeLessThan(reversal[0].angle);
    expect(closing[1].opacity).toBeGreaterThan(reversal[1].opacity);
    await page.screenshot({ path: testInfo.outputPath("icon-reversing.png") });
    await seekIcon(page, 1);
    await expectIcon(page, false);
    await toggle.click();
    // This opening is allowed to run naturally to its final state.
    await expectIcon(page, true);
    await expect(toggle).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath("icon-open.png") });
    await page.keyboard.press("Escape");
    await expectIcon(page, false);
    await expect(toggle).toBeFocused();
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`public entry at ${viewport.name}`, async ({ page }, testInfo) => {
    // Serial WebKit image preparation plus the full-page axe scan can exceed
    // 30s on the supported Windows host; retain all assertions and scanning.
    test.setTimeout(90_000);
    await page.setViewportSize(viewport);
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Sentinel | Operational intelligence");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    for (const landmark of ["banner", "main", "contentinfo"] as const)
      await expect(page.getByRole(landmark)).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: headline, level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(description, { exact: true })).toBeVisible();
    await expect(
      page.getByText(
        "Illustrative visualization. Detection outlines are not live results.",
      ),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Sentinel home" })).toHaveCount(
      2,
    );
    await expect(page.getByRole("link")).toHaveCount(
      viewport.width >= 1280 ? 17 : 12,
    );
    for (const [group, labels] of Object.entries(footerLabels)) {
      const section = page.getByRole("region", { name: group, exact: true });
      await expect(section).toBeVisible();
      for (const label of labels)
        await expect(section.getByText(label, { exact: true })).toBeVisible();
      await expect(section.getByRole("link")).toHaveCount(
        group === "Product" ? 4 : group === "Industries" ? 5 : 0,
      );
    }
    const footer = page.getByRole("contentinfo");
    await expect(
      footer.getByText(
        "Operational intelligence for camera infrastructure. Developed in Jamaica by CrimsonTide AI.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      footer.getByText(
        "CrimsonTide AI Limited · Kingston, Jamaica · +1 (876) 458-4187",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      footer.getByText(
        "© 2026 CrimsonTide AI Limited. Sentinel supports detection and review; trained personnel remain responsible for decisions and response. Camera compatibility and deployment requirements are confirmed through a site assessment. Commercial terms are governed by the current proposal.",
        { exact: true },
      ),
    ).toBeVisible();
    for (const image of await page.locator("img").all()) {
      if (!(await image.isVisible())) continue;
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (element) => (element as HTMLImageElement).naturalWidth,
          ),
        )
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const font = await page.evaluate(async () => {
      const faces = await Promise.all(
        [400, 500, 700].map((weight) =>
          document.fonts.load(`${weight} 16px Roboto`),
        ),
      );
      await document.fonts.ready;
      return {
        counts: faces.map((group) => group.length),
        family: getComputedStyle(document.body).fontFamily,
        resources: performance
          .getEntriesByType("resource")
          .map((entry) => entry.name),
      };
    });
    expect(font.counts.every((count) => count > 0)).toBe(true);
    expect(font.family).toMatch(/^Roboto/);
    expect(font.resources.some((url) => /\.woff2?/.test(url))).toBe(true);
    expect(
      font.resources.every((url) => url.startsWith("http://127.0.0.1:")),
    ).toBe(true);
    await disabledAssessment(page, viewport.width >= 1280 ? 4 : 3);
    if (viewport.width >= 1280)
      for (const label of navigationLabels)
        await expect(
          page
            .getByRole("navigation", { name: "Primary", exact: true })
            .getByText(label, { exact: true }),
        ).toBeVisible();
    await noOverflow(page);
    // Scan and capture complete settled content. WebKit's full-page capture
    // resizes its surface; decorative observers must not animate that resize.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await accessible(page);
    await page.screenshot({
      path: testInfo.outputPath(`${viewport.name}.png`),
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("mobile disclosure, keyboard, interruption and open-menu accessibility", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Sentinel home" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close menu", exact: true });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(close).toBeFocused();
  for (const label of navigationLabels)
    await expect(
      page
        .getByRole("navigation", { name: "Primary mobile", exact: true })
        .getByText(label, { exact: true }),
    ).toBeVisible();
  await disabledAssessment(page, 4);
  await accessible(page);
  await page.screenshot({
    path: testInfo.outputPath("mobile-menu-open.png"),
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Primary mobile", exact: true })
      .getByRole("link", { name: "How it works" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await toggle.press("Space");
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await close.click();
  await toggle.click();
  await close.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("breakpoint boundaries close navigation and restore visible focus", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [720, 721, 1279, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await noOverflow(page);
    await expect(page.getByRole("heading", { name: headline })).toBeVisible();
    if (width < 1280)
      await expect(
        page.getByRole("button", { name: "Menu", exact: true }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole("button", { name: "Menu", exact: true }),
      ).toHaveCount(0);
  }
  for (let round = 0; round < 3; round++) {
    await page.setViewportSize({ width: 1279, height: 1000 });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.setViewportSize({ width: 1280, height: 1000 });
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Sentinel home" }),
    ).toBeFocused();
    await page.setViewportSize({ width: 1279, height: 1000 });
    await expect(
      page.getByRole("button", { name: "Menu", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    await expectIcon(page, false);
  }
});

test("narrow reflow with enlarged text and reduced motion", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.getByText(description, { exact: true })).toBeVisible();
  await noOverflow(page);
  const toggle = page.locator("header button[aria-controls]");
  await expect(toggle).toHaveAccessibleName("Menu");
  expect(
    await toggle.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toBe("0s");
  await toggle.click();
  await expectIcon(page, true);
  expect(
    await toggle.locator(":scope > span").evaluate((icon) => ({
      durations: Array.from(
        icon.children,
        (line) => getComputedStyle(line).transitionDuration,
      ),
      animations: icon.getAnimations({ subtree: true }).length,
    })),
  ).toEqual({ durations: ["0s", "0s", "0s"], animations: 0 });
  await noOverflow(page);
  await accessible(page);
  await page.keyboard.press("Escape");
  await expectIcon(page, false);
  await expect(toggle).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("narrow-enlarged-text.png"),
  });
  // The complete landing exceeds browser bitmap height limits at enlarged text.
  for (const section of await page.locator("main > section").all()) {
    await section.scrollIntoViewIfNeeded();
    const name = await section.getAttribute("aria-labelledby");
    await section.screenshot({
      path: testInfo.outputPath(`enlarged-${name}.png`),
    });
  }
});

test("skip link focuses the main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("static sections remain server-rendered without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: headline })).toBeVisible();
    await expect(
      page
        .getByRole("contentinfo")
        .getByText("Biometric & Consent Policy", { exact: true }),
    ).toBeVisible();
    await disabledAssessment(page, 4);
  } finally {
    await context.close();
  }
});
