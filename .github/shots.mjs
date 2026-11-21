// TEMPORARY: screenshots for design review. Remove before merging.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("shots", { recursive: true });
const URL = "http://localhost:5050/";
const sizes = [
  ["desktop", 1440, 900],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
];
const log = [];
const browser = await chromium.launch();
for (const [name, w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log.push(`[${name}] pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && log.push(`[${name}] console: ${m.text()}`));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `shots/${name}-01-hero.png` });
  // scroll through the page in viewport steps so whileInView reveals fire
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(h * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1200);
  for (const id of ["i-was-there", "about", "projects", "experiences", "create", "contact"]) {
    await page.evaluate((i) => { const el = document.getElementById(i); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `shots/${name}-03-${id}.png` });
  }
  // expand a project card
  await page.evaluate(() => document.getElementById("projects").scrollIntoView());
  await page.getByRole("button", { name: "How I built it" }).first().click();
  await page.waitForTimeout(800);
  await page.locator(".pjl").first().screenshot({ path: `shots/${name}-04-expanded.png` });
  for (const [k, n] of [["draftfolio", 1], ["nhl", 2]]) {
    await page.locator(".pjl").nth(n).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator(".pjl").nth(n).screenshot({ path: `shots/${name}-04-${k}.png` });
  }
  // overflow check
  const ov = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    return [...document.querySelectorAll("body *")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.right > W + 1 && getComputedStyle(e).position !== "fixed";
    }).slice(0, 8).map((e) => `${e.tagName}.${(e.className && e.className.baseVal === undefined ? e.className : "").toString().slice(0, 40)} right=${Math.round(e.getBoundingClientRect().right)}`);
  });
  log.push(`[${name}] docWidth=${await page.evaluate(() => document.documentElement.scrollWidth)} viewport=${w} overflow: ${JSON.stringify(ov)}`);
  await page.screenshot({ path: `shots/${name}-05-full.png`, fullPage: true });
  await ctx.close();
}
// reduced motion: content must be visible without animation
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p = await rm.newPage();
await p.goto(URL, { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("i-was-there").scrollIntoView());
await p.waitForTimeout(600);
await p.screenshot({ path: "shots/reduced-iwt.png" });
await rm.close();
await browser.close();
fs.writeFileSync("shots/log.txt", log.join("\n") + "\n");
