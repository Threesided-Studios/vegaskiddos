#!/usr/bin/env node
/**
 * Capture header screenshots at fixed viewports.
 * Usage: node tools/header-nav-screenshots.mjs <outDir> [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const viewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "820x1180", width: 820, height: 1180 },
  { name: "844x390", width: 844, height: 390 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const outDir = process.argv[2];
const baseUrl = process.argv[3] ?? "http://localhost:3100";

if (!outDir) {
  console.error("Usage: node tools/header-nav-screenshots.mjs <outDir> [baseUrl]");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const header = page.locator("header").first();
  await header.waitFor({ state: "visible" });
  const file = path.join(outDir, `${vp.name}.png`);
  await header.screenshot({ path: file });
  console.log("wrote", file);
}

await browser.close();
