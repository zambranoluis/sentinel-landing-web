import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { artifactRoot } from "./scripts/artifact-paths.mjs";

const evidence = artifactRoot();
// Workers inherit one evidence root instead of computing a new directory.
process.env.SENTINEL_E2E_ARTIFACTS_ROOT = evidence;
const port = 3187;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // Concurrent Firefox axe scans timed out on the supported Windows host.
  workers: 1,
  outputDir: path.join(evidence, "results"),
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(evidence, "report"), open: "never" }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "firefox",
      testIgnore: "**/zoom.spec.ts",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: "**/zoom.spec.ts",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
