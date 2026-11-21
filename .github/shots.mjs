// TEMPORARY: checks the hero moment card. Remove before merging.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("shots", { recursive: true });
const URL = "http://localhost:5050/";
const log = [];
const browser = await chromium.launch();
for (const [dev, w, h] of [["wide", 1680, 945], ["desktop", 1440, 900], ["tablet", 820, 1180], ["mobile", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `shots/${dev}-1-hero.png` });
  if (dev === "mobile" || dev === "tablet") {
    await page.screenshot({ path: `shots/${dev}-1b-hero-full.png`, fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(2200, await page.evaluate(() => document.getElementById("about").offsetTop)) } });
  }
  const card = page.locator(".hm-card");
  const box = await card.boundingBox();
  const lan = await page.locator(".lanyard").boundingBox().catch(() => null);
  log.push(`[${dev}] card=${JSON.stringify(box && Object.fromEntries(Object.entries(box).map(([k, v]) => [k, Math.round(v)])))} lanyard=${JSON.stringify(lan && Object.fromEntries(Object.entries(lan).map(([k, v]) => [k, Math.round(v)])))} docWidth=${await page.evaluate(() => document.documentElement.scrollWidth)}`);
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `shots/${dev}-2-expanding.png` });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/${dev}-3-open.png` });
  log.push(`[${dev}] open: iframe=${await page.locator(".hm-modal iframe").count()} src=${await page.locator(".hm-modal iframe").getAttribute("src").catch(() => "-")} focus="${await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim())}"`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  log.push(`[${dev}] after Escape: modal=${await page.locator(".hm-modal").count()} focusIsCard=${await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("hm-card"))}`);
  } catch (e) { log.push(`[${dev}] ERROR: ${e.message.split("\n").slice(0, 4).join(" | ")}`); await page.screenshot({ path: `shots/${dev}-error.png` }).catch(() => {}); }
  fs.writeFileSync("shots/log.txt", log.join("\n") + "\n");
  await ctx.close();
}
const c3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p3 = await c3.newPage();
await p3.goto(URL, { waitUntil: "networkidle" });
await p3.waitForTimeout(800);
await p3.locator(".hm-card").click();
await p3.waitForTimeout(900);
log.push(`reduced motion: iframe=${await p3.locator(".hm-modal iframe").count()}`);
await c3.close();
await browser.close();
fs.writeFileSync("shots/log.txt", log.join("\n") + "\n");
