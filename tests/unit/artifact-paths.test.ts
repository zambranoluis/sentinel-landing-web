import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const repository = path.resolve(import.meta.dirname, "../..");
const collection = path.join(repository, "playwright");
let fixture: string;
let checkout: string;
let output: string;

beforeEach(() => {
  mkdirSync(collection, { recursive: true });
  fixture = mkdtempSync(path.join(collection, "resolver-test-"));
  checkout = path.join(fixture, "checkout");
  output = path.join(checkout, "playwright");
  mkdirSync(path.join(checkout, "scripts"), { recursive: true });
  copyFileSync(
    path.join(repository, "scripts/artifact-paths.mjs"),
    path.join(checkout, "scripts/artifact-paths.mjs"),
  );
});

afterEach(() => {
  const relative = path.relative(collection, fixture);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative))
    throw new Error("Refusing to clean a fixture outside /playwright.");
  rmSync(fixture, { recursive: true, force: true });
});

function resolveRoot(override?: string, calls = 1) {
  const env = { ...process.env };
  delete env.SENTINEL_E2E_ARTIFACTS_ROOT;
  if (override !== undefined) env.SENTINEL_E2E_ARTIFACTS_ROOT = override;
  const moduleURL = pathToFileURL(
    path.join(checkout, "scripts/artifact-paths.mjs"),
  ).href;
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { artifactRoot } from ${JSON.stringify(moduleURL)};
         console.log(JSON.stringify(Array.from({length: ${calls}}, () => artifactRoot())));`,
      ],
      {
        cwd: fixture,
        env,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    ),
  ) as string[];
}

describe("browser artifact roots", () => {
  it("recreates unique runs from the module's repository, independently of cwd", () => {
    expect(existsSync(output)).toBe(false);
    const [first, second] = resolveRoot(undefined, 2);
    expect(path.dirname(first)).toBe(path.join(output, "runs"));
    expect(path.basename(first)).toMatch(/^[\w-]{16}$/);
    expect(first).not.toBe(second);
    expect(existsSync(first)).toBe(true);
    expect(existsSync(second)).toBe(true);
    const previous = path.join(first, "retained.txt");
    writeFileSync(previous, "previous evidence");
    resolveRoot();
    expect(readFileSync(previous, "utf8")).toBe("previous evidence");
  });

  it("accepts a dedicated absolute named run and the worker's inherited root", () => {
    const named = path.join(output, "named", "capture");
    expect(resolveRoot(named, 2)).toEqual([named, named]);
    expect(existsSync(named)).toBe(true);
  });

  it.each([
    ["relative path", () => "playwright/named"],
    ["collection root", () => output],
    ["repository root", () => checkout],
    ["external path", () => path.join(fixture, "external")],
    ["sibling prefix", () => `${output}-other/run`],
    ["parent traversal", () => path.join(output, "..", "outside")],
  ])("rejects %s", (_label, target) => {
    expect(() => resolveRoot(target())).toThrow();
  });

  it.each(["collection", "run", "ancestor", "results", "report"])(
    "rejects an escaping %s junction or symlink",
    (location) => {
      const external = path.join(fixture, "external");
      mkdirSync(external);
      const named = path.join(output, "named");
      const redirect =
        location === "collection"
          ? output
          : location === "run" || location === "ancestor"
            ? named
            : path.join(named, location);
      mkdirSync(path.dirname(redirect), { recursive: true });
      symlinkSync(
        external,
        redirect,
        process.platform === "win32" ? "junction" : "dir",
      );
      const requested =
        location === "ancestor" ? path.join(named, "new-run") : named;
      expect(() => resolveRoot(requested)).toThrow();
      if (location === "collection") expect(() => resolveRoot()).toThrow();
      expect(existsSync(path.join(external, "new-run"))).toBe(false);
    },
  );

  it("rejects a dangling redirect instead of creating output through it", () => {
    mkdirSync(output);
    symlinkSync(
      path.join(fixture, "missing"),
      path.join(output, "dangling"),
      process.platform === "win32" ? "junction" : "dir",
    );
    expect(() => resolveRoot(path.join(output, "dangling", "run"))).toThrow();
  });
});
