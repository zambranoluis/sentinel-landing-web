import { expect, test, type Locator, type Page } from "@playwright/test";

const cyan = "rgb(141, 212, 238)";
const navy = "rgb(27, 50, 102)";
const footerText = "rgb(169, 180, 196)";

async function focusOutline(label: Locator) {
  await expect(label).toHaveCSS("outline-color", "rgb(172, 190, 209)");
  await expect(label).toHaveCSS("outline-style", "solid");
  const width = await label.evaluate((element) =>
    parseFloat(getComputedStyle(element).outlineWidth),
  );
  // Firefox rounds this authored 3px outline to device pixels on Windows.
  expect(width).toBeGreaterThanOrEqual(2.4);
  expect(width).toBeLessThanOrEqual(3);
  await expect(label).toHaveCSS("outline-offset", "3px");
}

async function openFooter(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
}

async function bar(label: Locator) {
  return label.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      width: parseFloat(style.width),
      scale: new DOMMatrixReadOnly(style.transform).a,
      color: style.backgroundColor,
      height: style.height,
      duration: style.transitionDuration,
    };
  });
}

async function headingExpanded(section: Locator) {
  const heading = section.locator("h2");
  const width = await heading.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getBoundingClientRect().width;
  });
  expect((await heading.boundingBox())!.width).toBeCloseTo(width, 0);
  await expect
    .poll(async () => (await bar(heading)).width)
    .toBeCloseTo(width, 0);
}

async function layout(page: Page) {
  return page
    .locator("footer, footer section, footer h2, footer li")
    .evaluateAll((elements) => ({
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
      boxes: elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.x, rect.y + scrollY, rect.width, rect.height];
      }),
    }));
}

test("navigation uses cyan feedback and footer options retain text colors with separate navy bars", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await openFooter(page);
  const geometry = await layout(page);
  for (const section of await page.locator("footer section").all()) {
    expect(await bar(section.locator("h2"))).toMatchObject({
      width: 24,
      color: navy,
    });
    await expect(section.locator("h2")).toHaveCSS(
      "color",
      "rgb(246, 248, 251)",
    );
    for (const label of await section.locator("li > a, li > span").all()) {
      await expect(label).toHaveCSS("text-decoration-line", "none");
      await expect(label).toHaveCSS("color", footerText);
      await expect(label).toHaveCSS("transition-duration", "0s");
      const width = await label.evaluate(
        (element) => element.getBoundingClientRect().width,
      );
      expect(await bar(label)).toMatchObject({
        scale: 0,
        color: navy,
        height: "2px",
      });
      expect((await bar(label)).width).toBeCloseTo(width, 1);
      await label.hover();
      await expect(label).toHaveCSS("color", footerText);
      await expect(section.locator("h2")).toHaveCSS(
        "color",
        "rgb(246, 248, 251)",
      );
      expect((await bar(label)).scale).toBe(1);
      await headingExpanded(section);
      await page.mouse.move(0, 0);
      expect((await bar(label)).scale).toBe(0);
      await expect(label).toHaveCSS("color", footerText);
    }
    expect((await bar(section.locator("h2"))).width).toBe(24);
  }
  expect(await layout(page)).toEqual(geometry);
  const unavailable = page.locator("footer li > span");
  expect(
    await unavailable.evaluateAll((elements) =>
      elements.every(
        (element) =>
          !element.hasAttribute("tabindex") &&
          !element.hasAttribute("role") &&
          !element.hasAttribute("href"),
      ),
    ),
  ).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  for (const link of await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link")
    .all()) {
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await link.hover();
    await expect(link).toHaveCSS("color", cyan);
  }
  const selection = await page.locator("body").evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("footer li")!);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);
    const style = getComputedStyle(element, "::selection");
    return [style.backgroundColor, style.color, getSelection()!.toString()];
  });
  expect(selection).toEqual([navy, "rgb(246, 248, 251)", "How it works"]);
});

test("footer heading stays expanded between options and bars reverse without layout movement", async ({
  page,
}) => {
  await openFooter(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const section = page.locator("footer section").first();
  const heading = section.locator("h2");
  const first = section.locator("li a").nth(0);
  const second = section.locator("li a").nth(1);
  const geometry = await layout(page);
  expect((await bar(heading)).duration).toBe("0.2s");
  expect((await bar(first)).duration).toBe("0.2s");
  // A slower test-only clock makes real intermediate/reversed CSS states
  // observable on all engines without depending on a 200ms polling window.
  await page.addStyleTag({
    content:
      "footer h2::after, footer li > a::after { transition-duration: 2s !important; }",
  });
  await first.hover();
  await expect.poll(async () => (await bar(first)).scale).toBeGreaterThan(0);
  const growing = await bar(first);
  expect(growing.scale).toBeLessThan(1);
  const growingHeading = await bar(heading);
  expect(growingHeading.width).toBeGreaterThan(24);
  expect(growingHeading.width).toBeLessThan(
    (await heading.boundingBox())!.width,
  );
  await page.mouse.move(0, 0);
  await expect
    .poll(async () => (await bar(first)).scale)
    .toBeLessThan(growing.scale);
  await expect
    .poll(async () => (await bar(heading)).width)
    .toBeLessThan(growingHeading.width);
  await first.hover();
  await expect.poll(async () => (await bar(first)).scale).toBe(1);
  await headingExpanded(section);
  await second.hover();
  await headingExpanded(section);
  await expect.poll(async () => (await bar(first)).scale).toBe(0);
  await expect.poll(async () => (await bar(second)).scale).toBe(1);
  // Empty space inside the section retains only the heading feedback.
  await section.hover({
    position: { x: (await section.boundingBox())!.width - 3, y: 3 },
  });
  await headingExpanded(section);
  await expect.poll(async () => (await bar(second)).scale).toBe(0);
  await page.mouse.move(0, 0);
  await expect.poll(async () => (await bar(heading)).width).toBe(24);
  expect(await layout(page)).toEqual(geometry);
});

test("keyboard focus coordinates footer bars and preserves desktop/mobile navigation focus", async ({
  page,
}) => {
  await openFooter(page);
  await page.keyboard.press("Tab");
  const section = page.locator("footer section").first();
  const first = section.locator("li a").nth(0);
  const second = section.locator("li a").nth(1);
  await first.focus();
  await expect(first).toHaveCSS("color", footerText);
  await focusOutline(first);
  expect((await bar(first)).scale).toBe(1);
  await headingExpanded(section);
  await page.keyboard.press("Tab");
  await expect(second).toBeFocused();
  await expect(second).toHaveCSS("color", footerText);
  expect((await bar(first)).scale).toBe(0);
  expect((await bar(second)).scale).toBe(1);
  await headingExpanded(section);
  const navLink = page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link")
    .first();
  await navLink.focus();
  await expect(navLink).toHaveCSS("color", cyan);
  expect((await bar(section.locator("h2"))).width).toBe(24);
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  const mobileLink = page
    .getByRole("navigation", { name: "Primary mobile", exact: true })
    .getByRole("link")
    .first();
  await expect(mobileLink).toBeFocused();
  await expect(mobileLink).toHaveCSS("color", cyan);
  await expect(mobileLink).toHaveCSS("text-decoration-line", "none");
  await focusOutline(mobileLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.locator("#how-it-works")).toBeFocused();
  await expect(page.locator("#mobile-navigation")).toHaveAttribute(
    "data-open",
    "false",
  );
});

test("touch options remain plain text without persistent hover feedback", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    expect(
      await page.evaluate(
        () => matchMedia("(hover: hover) and (pointer: fine)").matches,
      ),
    ).toBe(false);
    const hotels = page.locator("footer li > span", { hasText: "Hotels" });
    await hotels.tap();
    await expect(hotels).toHaveCSS("color", "rgb(169, 180, 196)");
    expect((await bar(hotels)).scale).toBe(0);
    expect((await bar(page.locator("#footer-industries"))).width).toBe(24);
    await page.getByRole("button", { name: "Menu", exact: true }).tap();
    const link = page
      .getByRole("navigation", { name: "Primary mobile", exact: true })
      .getByRole("link")
      .first();
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await link.tap();
    await expect(page).toHaveURL(/#how-it-works$/);
  } finally {
    await context.close();
  }
});

test("footer feedback works without JavaScript and reduced motion settles active transitions", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const staticPage = await context.newPage();
  try {
    await staticPage.goto("/");
    const label = staticPage.locator("footer li > span", {
      hasText: "Contact",
    });
    await label.hover();
    await expect(label).toHaveCSS("color", footerText);
    expect((await bar(label)).scale).toBe(1);
    await headingExpanded(
      staticPage.getByRole("region", { name: "Company", exact: true }),
    );
    await expect(staticPage.locator("footer a").first()).toHaveCSS(
      "text-decoration-line",
      "none",
    );
  } finally {
    await context.close();
  }
  await openFooter(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addStyleTag({
    content:
      "footer h2::after, footer li > a::after { transition-duration: 2s !important; } @media (prefers-reduced-motion: reduce) { footer h2::after, footer li > a::after { transition: none !important; } }",
  });
  const link = page.locator("footer li a").first();
  await link.hover();
  await expect.poll(async () => (await bar(link)).scale).toBeGreaterThan(0);
  expect((await bar(link)).scale).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await bar(link)).toMatchObject({ scale: 1, duration: "0s" });
  await headingExpanded(page.locator("footer section").first());
  await page.mouse.move(0, 0);
  expect((await bar(link)).scale).toBe(0);
  expect((await bar(page.locator("footer h2").first())).width).toBe(24);
});

for (const javaScriptEnabled of [true, false]) {
  test(`footer copyright and full home logo align at responsive boundaries (${javaScriptEnabled ? "JavaScript" : "no JavaScript"})`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    try {
      for (const width of [320, 390, 720, 721, 834, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("/");
        // Poll readiness directly: Firefox's no-JavaScript context can leave
        // the fonts.ready promise unresolved even after its fonts load.
        await expect
          .poll(() => page.evaluate(() => document.fonts.status))
          .toBe("loaded");
        const footer = page.getByRole("contentinfo");
        const bottom = footer.locator(":scope > div:last-child");
        await bottom.scrollIntoViewIfNeeded();
        await expect(bottom.locator("p")).toHaveText(
          "© 2026 CrimsonTide AI Limited.",
        );
        const logo = bottom.getByRole("link", { name: "Sentinel home" });
        await expect(logo).toHaveAttribute("href", "/");
        await expect(logo.locator("img")).toHaveCount(2);
        for (const [index, source] of [
          "/logos/sentinel-icon.svg",
          "/logos/sentinel-word.svg",
        ].entries()) {
          const image = logo.locator("img").nth(index);
          await expect(image).toHaveAttribute("src", source);
          await expect
            .poll(() =>
              image.evaluate(
                (element: HTMLImageElement) =>
                  element.complete && element.naturalWidth > 0,
              ),
            )
            .toBe(true);
        }
        const geometry = await bottom.evaluate((element) => {
          const rect = (node: Element) => {
            const box = node.getBoundingClientRect();
            return {
              left: box.left,
              right: box.right,
              top: box.top,
              bottom: box.bottom,
              center: (box.top + box.bottom) / 2,
            };
          };
          return {
            row: rect(element),
            copyright: rect(element.querySelector("p")!),
            logo: rect(element.querySelector("a")!),
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        expect(geometry.overflow).toBe(false);
        expect(geometry.copyright.left).toBeCloseTo(geometry.row.left, 0);
        expect(geometry.logo.right).toBeCloseTo(geometry.row.right, 0);
        if (width <= 720) {
          expect(geometry.logo.top).toBeGreaterThan(geometry.copyright.bottom);
        } else {
          expect(geometry.copyright.center).toBeCloseTo(
            geometry.logo.center,
            0,
          );
          expect(geometry.copyright.right).toBeLessThan(geometry.logo.left);
        }
        if (javaScriptEnabled && [390, 1440].includes(width)) {
          await footer.screenshot({
            path: testInfo.outputPath(`footer-${width}.png`),
          });
        }
      }
      const logo = page
        .locator("footer > div:last-child")
        .getByRole("link", { name: "Sentinel home" });
      await page.keyboard.press("Tab");
      await logo.focus();
      await expect(logo).toBeFocused();
      await focusOutline(logo);
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/$/);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    } finally {
      await context.close();
    }
  });
}
