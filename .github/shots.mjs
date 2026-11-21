// TEMPORARY: side-by-side comparison of live site vs this branch. Remove before merging.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("shots", { recursive: true });
const targets = [["live", "https://www.sunishthbhogal.com/"], ["branch", "http://localhost:5050/"]];
const log = [];
const browser = await chromium.launch();
for (const [w, h, dev] of [[1440, 900, "desktop"], [390, 844, "mobile"]]) {
  for (const [name, url] of targets) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `shots/${dev}-${name}-hero.png` });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(h * 0.5)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(1000);
    for (const id of ["about", "experiences"]) {
      await page.evaluate((i) => { const el = document.getElementById(i); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, id);
      await page.waitForTimeout(900);
      await page.screenshot({ path: `shots/${dev}-${name}-${id}.png` });
    }
    log.push(`${dev} ${name}: height=${total}`);
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync("shots/log.txt", log.join("\n") + "\n");
