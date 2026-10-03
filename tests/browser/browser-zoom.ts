import { chromium, type BrowserContext, type TestInfo } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

export async function launchZoomContext(testInfo: TestInfo, width: number) {
  // The extension and profile exist only in external, isolated test output.
  // Chrome's Tabs API changes real browser zoom, unlike CSS zoom or pinch scaling.
  const extension = testInfo.outputPath("zoom-extension");
  mkdirSync(extension, { recursive: true });
  writeFileSync(
    path.join(extension, "manifest.json"),
    JSON.stringify({
      manifest_version: 3,
      name: "Sentinel isolated zoom check",
      version: "1.0.0",
      background: { service_worker: "background.js" },
    }),
  );
  writeFileSync(
    path.join(extension, "background.js"),
    "chrome.runtime.onInstalled.addListener(() => {});",
  );
  return chromium.launchPersistentContext(
    testInfo.outputPath("browser-profile"),
    {
      channel: "chromium",
      viewport: { width, height: 900 },
      args: [
        `--disable-extensions-except=${extension}`,
        `--load-extension=${extension}`,
      ],
    },
  );
}

export async function setBrowserZoom(context: BrowserContext, factor: number) {
  const worker =
    context.serviceWorkers()[0] ||
    (await context.waitForEvent("serviceworker"));
  return worker.evaluate(async (zoom) => {
    const tabs = (
      globalThis as typeof globalThis & {
        chrome: {
          tabs: {
            query: (query: {
              active: boolean;
              currentWindow: boolean;
            }) => Promise<{ id: number }[]>;
            setZoom: (id: number, zoom: number) => Promise<void>;
            getZoom: (id: number) => Promise<number>;
          };
        };
      }
    ).chrome.tabs;
    const [tab] = await tabs.query({ active: true, currentWindow: true });
    await tabs.setZoom(tab.id, zoom);
    return tabs.getZoom(tab.id);
  }, factor);
}
