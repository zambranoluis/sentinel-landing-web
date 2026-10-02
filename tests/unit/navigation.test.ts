import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
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
      expect(destinationHref(entry.destination), entry.label).toBeNull();
      expect(destinations[entry.destination]).not.toHaveProperty("href");
    }
  });

  it("only enables implemented internal routes and existing fragment targets", () => {
    const enabled = (Object.keys(destinations) as Destination[]).filter(
      (key) => destinations[key].available,
    );
    expect(enabled).toEqual(["home"]);
    for (const key of enabled) {
      const href = destinationHref(key)!;
      expect(href).toMatch(/^\/(?!\/)/);
      const [route, fragment] = href.split("#");
      const routeFile = path.join(process.cwd(), "src/app", route, "page.tsx");
      expect(existsSync(routeFile), href).toBe(true);
      if (fragment)
        expect(readFileSync(routeFile, "utf8")).toContain(`id="${fragment}"`);
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
