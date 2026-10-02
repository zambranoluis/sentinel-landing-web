import { realpathSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Resolve existing ancestors so a symlink cannot redirect evidence into the project.
function canonicalPath(target) {
  const suffix = [];
  let ancestor = path.resolve(target);
  while (!existsSync(ancestor)) {
    suffix.unshift(path.basename(ancestor));
    ancestor = path.dirname(ancestor);
  }
  return path.join(realpathSync(ancestor), ...suffix);
}

export function artifactRoot() {
  if (
    process.env.SENTINEL_E2E_ARTIFACTS_ROOT &&
    !path.isAbsolute(process.env.SENTINEL_E2E_ARTIFACTS_ROOT)
  ) {
    throw new Error("SENTINEL_E2E_ARTIFACTS_ROOT must be an absolute path.");
  }
  const repository = canonicalPath(process.cwd());
  const target = canonicalPath(
    process.env.SENTINEL_E2E_ARTIFACTS_ROOT ||
      path.join(
        tmpdir(),
        "sentinel-landing-web-qa",
        `run-${Date.now()}-${process.pid}`,
      ),
  );
  const relative = path.relative(repository, target);
  const inverse = path.relative(target, repository);
  if (
    !relative ||
    (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)) ||
    !inverse ||
    (!inverse.startsWith(`..${path.sep}`) && !path.isAbsolute(inverse))
  ) {
    throw new Error(
      "Browser artifacts must use a dedicated directory outside the repository and its ancestors.",
    );
  }
  return target;
}
