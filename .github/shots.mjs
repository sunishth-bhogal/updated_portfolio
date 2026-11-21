// TEMPORARY: checks the arrival intro. Remove before merging.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("shots", { recursive: true });
const URL = "http://localhost:5050/";
const log = [];
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [dev, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${dev}] pageerror: ${e.message}`));
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  for (const s of [3, 9, 14]) {
    await page.waitForTimeout(s * 1000 - (Date.now() - t0));
    await page.screenshot({ path: `shots/${dev}-intro-${s}s.png` });
    log.push(`[${dev}] t=${s}s intro=${await page.locator(".intro").count()} progressRunning=${await page.locator(".intro-progress .is-running").count()}`);
  }
  // wait for it to finish on its own
  let closedAt = null;
  for (let i = 0; i < 40; i++) {
    if ((await page.locator(".intro").count()) === 0) { closedAt = Math.round((Date.now() - t0) / 1000); break; }
    await page.waitForTimeout(1000);
  }
  log.push(`[${dev}] intro closed by itself at ~${closedAt}s`);
  await page.screenshot({ path: `shots/${dev}-after.png` });
  // reload in same session: should not show again
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  log.push(`[${dev}] after reload intro=${await page.locator(".intro").count()} (expect 0)`);
  await ctx.close();
}
// skip button in a fresh session
const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await c2.newPage();
await p2.goto(URL, { waitUntil: "domcontentloaded" });
await p2.waitForTimeout(2500);
const focused = await p2.evaluate(() => document.activeElement && document.activeElement.textContent);
await p2.getByRole("button", { name: /Skip intro/ }).click();
await p2.waitForTimeout(900);
log.push(`skip: focused="${focused}" intro after click=${await p2.locator(".intro").count()} overflow=${await p2.evaluate(() => document.documentElement.style.overflow)}`);
await c2.close();
// reduced motion: no intro
const c3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p3 = await c3.newPage();
await p3.goto(URL, { waitUntil: "domcontentloaded" });
await p3.waitForTimeout(1500);
log.push(`reduced motion: intro=${await p3.locator(".intro").count()} (expect 0)`);
await c3.close();
await browser.close();
fs.writeFileSync("shots/log.txt", log.join("\n") + "\n");
