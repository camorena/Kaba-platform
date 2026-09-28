import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const BASE = "http://127.0.0.1:3015";
const PASS = process.env.ADMIN_PASSWORD || "wLenUtD7j7cHVt3rwre1NUQZ";
const OUT = "/workspace/kaba-fence/preview";

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const pages = [
  { id: "dashboard", path: "/admin" },
  { id: "quotes", path: "/admin/quotes" },
  { id: "payments", path: "/admin/payments" },
  { id: "settings", path: "/admin/settings" },
  { id: "content", path: "/admin/content" },
  { id: "pipeline", path: "/admin/pipeline" },
];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport(viewports[0]);
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle2", timeout: 60000 });

// Login — stub mode uses password field
const passwordSel = 'input[type="password"], input[name="password"]';
await page.waitForSelector(passwordSel, { timeout: 15000 });
await page.type(passwordSel, PASS);
await Promise.all([
  page.click('button[type="submit"]'),
  page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => null),
]);
await page.waitForFunction(() => location.pathname.startsWith("/admin") && !location.pathname.includes("/login"), { timeout: 20000 }).catch(() => null);
console.log("logged in at", page.url());

for (const vp of viewports) {
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });
  for (const route of pages) {
    const file = path.join(OUT, `admin15-responsive-${route.id}-${vp.name}.png`);
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 400));
    // Open drawer on mobile for one dashboard shot
    if (route.id === "dashboard" && vp.name === "mobile") {
      const menu = await page.$('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-controls]');
      // try open menu
      const btns = await page.$$("header button");
      for (const b of btns) {
        const al = await page.evaluate((el) => el.getAttribute("aria-label") || el.getAttribute("aria-expanded"), b);
        if (al && /menu|open|naveg/i.test(String(al))) {
          await b.click();
          await new Promise((r) => setTimeout(r, 450));
          const drawerFile = path.join(OUT, `admin15-responsive-drawer-${vp.name}.png`);
          await page.screenshot({ path: drawerFile, fullPage: false });
          console.log("wrote", drawerFile);
          // close
          await page.keyboard.press("Escape").catch(() => null);
          await new Promise((r) => setTimeout(r, 300));
          break;
        }
      }
    }
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file);
  }
}

// ES settings mobile
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle2" });
// click language toggle if present
const langBtns = await page.$$("button");
for (const b of langBtns) {
  const txt = await page.evaluate((el) => el.textContent || "", b);
  if (txt.trim() === "ES" || txt.trim() === "Español") {
    await b.click();
    await new Promise((r) => setTimeout(r, 400));
    break;
  }
}
const esFile = path.join(OUT, "admin15-responsive-settings-es-mobile.png");
await page.screenshot({ path: esFile, fullPage: false });
console.log("wrote", esFile);

await browser.close();
