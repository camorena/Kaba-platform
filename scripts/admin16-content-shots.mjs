import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3016";
const PASS = process.env.ADMIN_PASSWORD || "wLenUtD7j7cHVt3rwre1NUQZ";
const OUT = "/workspace/kaba-fence/preview";

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const routes = [
  { id: "hub", path: "/admin/content" },
  { id: "list", path: "/admin/content/faqs" },
  { id: "edit", path: "/admin/content/faqs" }, // resolve first doc below
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

// Discover first FAQ edit URL
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
    const file = path.join(OUT, `admin16-content-${route.id}-${vp.name}.png`);
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 450));
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file);
  }

  // ES hub shot on desktop only
  if (vp.name === "desktop") {
    await page.goto(`${BASE}/admin/content`, { waitUntil: "networkidle2", timeout: 60000 });
    // toggle language if button exists
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
    const file = path.join(OUT, `admin16-content-hub-es-desktop.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file, "toggled", toggled);
  }
}

await browser.close();
console.log("done");
