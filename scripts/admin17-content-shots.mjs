import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3017";
const PASS = process.env.ADMIN_PASSWORD || "wLenUtD7j7cHVt3rwre1NUQZ";
const OUT = "/workspace/kaba-fence/preview";

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport(viewports[0]);
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle2", timeout: 60000 });

const passwordSel = 'input[type="password"], input[name="password"]';
await page.waitForSelector(passwordSel, { timeout: 15000 });
await page.type(passwordSel, PASS);
await Promise.all([
  page.click('button[type="submit"]'),
  page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => null),
]);
await page
  .waitForFunction(
    () => location.pathname.startsWith("/admin") && !location.pathname.includes("/login"),
    { timeout: 20000 },
  )
  .catch(() => null);
console.log("logged in at", page.url());

await page.goto(`${BASE}/admin/content/faqs`, { waitUntil: "networkidle2", timeout: 60000 });
const editHref = await page.evaluate(() => {
  const a = document.querySelector('a[href*="/admin/content/faqs/"]');
  return a ? a.getAttribute("href") : null;
});
console.log("editHref", editHref);

for (const vp of viewports) {
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });

  for (const route of [
    { id: "hub", path: "/admin/content" },
    { id: "list", path: "/admin/content/faqs" },
    { id: "edit", path: editHref || "/admin/content/faqs" },
  ]) {
    const file = path.join(OUT, `admin17-content-${route.id}-${vp.name}.png`);
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 450));
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file);
  }

  if (vp.name === "desktop") {
    await page.goto(`${BASE}/admin/content`, { waitUntil: "networkidle2", timeout: 60000 });
    const toggled = await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, a")];
      const es = btns.find((b) => /^(ES|Español)$/i.test((b.textContent || "").trim()));
      if (es) {
        es.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 600));
    const file = path.join(OUT, `admin17-content-hub-es-desktop.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file, "toggled", toggled);

    // dark desktop hub
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")];
      const dark = btns.find((b) => {
        const label = (b.getAttribute("aria-label") || b.textContent || "").toLowerCase();
        return /dark|theme|modo|moon|sun/.test(label) || b.querySelector("svg");
      });
      // prefer theme toggle near lang
      const theme = document.querySelector('[aria-label*="theme" i], [aria-label*="Theme" i], button[title*="theme" i]');
      if (theme) theme.click();
      else {
        // click moon/sun button in topbar
        const candidates = [...document.querySelectorAll("header button, .admin-topbar button")];
        const tgl = candidates.find((b) => b.querySelector("svg") && !/ES|EN/i.test(b.textContent || ""));
        if (tgl) tgl.click();
      }
    });
    await new Promise((r) => setTimeout(r, 500));
    // ensure still on content hub EN for dark? language may be ES — fine
    await page.goto(`${BASE}/admin/content`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 400));
    // re-toggle dark if needed
    await page.evaluate(() => {
      const root = document.documentElement;
      if (!root.classList.contains("dark")) {
        const candidates = [...document.querySelectorAll("header button, .admin-topbar button, button")];
        for (const b of candidates) {
          const al = (b.getAttribute("aria-label") || "").toLowerCase();
          if (al.includes("theme") || al.includes("dark") || al.includes("light")) {
            b.click();
            break;
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    const darkFile = path.join(OUT, `admin17-content-hub-dark-desktop.png`);
    await page.screenshot({ path: darkFile, fullPage: false });
    console.log("wrote", darkFile, "dark?", await page.evaluate(() => document.documentElement.classList.contains("dark")));
  }
}

await browser.close();
console.log("done");
