import { lstatSync, mkdirSync, realpathSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repository = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

// Resolve existing ancestors, including redirects above a not-yet-created run.
function canonicalPath(target) {
  const suffix = [];
  let ancestor = path.resolve(target);
  while (!lstatSync(ancestor, { throwIfNoEntry: false })) {
    suffix.unshift(path.basename(ancestor));
    ancestor = path.dirname(ancestor);
  }
  return path.join(realpathSync(ancestor), ...suffix);
}

function isInside(parent, target) {
  const relative = path.relative(parent, target);
  return (
    !!relative &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

export function artifactRoot() {
  const override = process.env.SENTINEL_E2E_ARTIFACTS_ROOT;
  if (override && !path.isAbsolute(override)) {
    throw new Error("SENTINEL_E2E_ARTIFACTS_ROOT must be an absolute path.");
  }
  const collection = path.join(canonicalPath(repository), "playwright");
  // Keep isolated Chromium profile descendants within Windows path limits.
  const requested = path.resolve(
    override ||
      path.join(collection, "runs", randomBytes(12).toString("base64url")),
  );
  if (
    !isInside(collection, requested) ||
    path.relative(collection, canonicalPath(collection)) !== "" ||
    !isInside(collection, canonicalPath(requested))
  ) {
    throw new Error(
      "Browser artifacts must use a dedicated subdirectory inside repository /playwright without redirect escapes.",
    );
  }
  const target = canonicalPath(requested);
  for (const name of ["results", "report"]) {
    if (!isInside(target, canonicalPath(path.join(target, name)))) {
      throw new Error(
        "Browser output directories must not redirect outside the run.",
      );
    }
  }
  mkdirSync(target, { recursive: true });
  return target;
}
