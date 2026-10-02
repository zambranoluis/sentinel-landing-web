import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { capabilities } from "../../src/components/landing/content";
import { describe, expect, it } from "vitest";
import {
  destinationHref,
  destinations,
  footerGroups,
  primaryNavigation,
  type Destination,
} from "../../src/components/landing/navigation";

describe("public destination availability", () => {
  it("never exposes a URL for unavailable destinations in either navigation surface", () => {
    const entries = [
      ...primaryNavigation,
      ...footerGroups.flatMap((group) => [...group.items]),
    ];
    for (const entry of entries) {
      if (destinations[entry.destination].available) continue;
      expect(destinationHref(entry.destination), entry.label).toBeNull();
      expect(destinations[entry.destination]).not.toHaveProperty("href");
    }
  });

  it("only enables implemented internal routes and existing fragment targets", () => {
    const enabled = (Object.keys(destinations) as Destination[]).filter(
      (key) => destinations[key].available,
    );
    expect(enabled).toEqual([
      "home",
      "howItWorks",
      "capabilities",
      "deployment",
      "plans",
      "faq",
      "retail",
      "shops",
      "restaurants",
      "manufacturing",
      "gasStations",
    ]);
    const sectionFiles = [
      "HowItWorks",
      "Capabilities",
      "Deployment",
      "Plans",
      "Faq",
    ];
    const page = readFileSync("src/app/page.tsx", "utf8");
    const implemented = sectionFiles
      .map((name) => {
        expect(page).toContain(`<${name} />`);
        return readFileSync(`src/components/landing/${name}.tsx`, "utf8");
      })
      .join("\n");
    for (const key of enabled) {
      const href = destinationHref(key)!;
      expect(href).toMatch(/^\/(?!\/)/);
      const [route, fragment] = href.split("#");
      const routeFile = path.join(process.cwd(), "src/app", route, "page.tsx");
      expect(existsSync(routeFile), href).toBe(true);
      if (fragment) {
        expect(
          implemented.includes(`id="${fragment}"`) ||
            capabilities.some((item) => item.id === fragment),
          href,
        ).toBe(true);
      }
    }
  });

  it("uses the same availability owner for labels shared by navbar and footer", () => {
    for (const label of ["How it works", "Capabilities", "Deployment", "FAQ"]) {
      const header = primaryNavigation.find((item) => item.label === label)!;
      const footer = footerGroups[0].items.find(
        (item) => item.label === label,
      )!;
      expect(header.destination).toBe(footer.destination);
    }
  });
});
