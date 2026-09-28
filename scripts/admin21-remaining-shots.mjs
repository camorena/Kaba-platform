import puppeteer from "puppeteer-core";
import path from "path";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3021";
const PASS = process.env.ADMIN_PASSWORD || "wLenUtD7j7cHVt3rwre1NUQZ";
const OUT = "/workspace/kaba-fence/preview";

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const pages = [
  { slug: "calendar", path: "/admin/calendar", key: "calendar" },
  { slug: "customers", path: "/admin/customers", key: "customers" },
  { slug: "payments", path: "/admin/payments", key: "payments" },
  { slug: "pricebook", path: "/admin/pricebook", key: "pricebook" },
  { slug: "activity", path: "/admin/activity", key: "activity" },
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

async function gotoAdmin(adminPath) {
  await page.goto(`${BASE}${adminPath}`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 500));
}

async function setLocale(code) {
  await page.evaluate((c) => {
    const btns = [...document.querySelectorAll("button, a")];
    const hit = btns.find((b) => {
      const t = (b.textContent || "").trim();
      if (c === "es") return /^(ES|Español)$/i.test(t);
      return /^(EN|English)$/i.test(t);
    });
    if (hit) hit.click();
  }, code);
  await new Promise((r) => setTimeout(r, 500));
}

async function ensureDark(on) {
  await page.evaluate((wantDark) => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark === wantDark) return;
    const candidates = [
      ...document.querySelectorAll("header button, .admin-topbar button, button"),
    ];
    for (const b of candidates) {
      const al = (b.getAttribute("aria-label") || "").toLowerCase();
      if (al.includes("theme") || al.includes("dark") || al.includes("light")) {
        b.click();
        return;
      }
    }
  }, on);
  await new Promise((r) => setTimeout(r, 400));
}

// Responsive shots for each page (light EN)
for (const vp of viewports) {
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });
  await setLocale("en");
  await ensureDark(false);

  for (const p of pages) {
    await gotoAdmin(p.path);
    await page.screenshot({
      path: path.join(OUT, `admin21-${p.key}-${vp.name}.png`),
      fullPage: false,
    });
    console.log("wrote", p.key, vp.name);
  }
}

// Desktop extras: ES + dark for each
await page.setViewport({
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  isMobile: false,
});

await setLocale("es");
await ensureDark(false);
for (const p of pages) {
  await gotoAdmin(p.path);
  await page.screenshot({
    path: path.join(OUT, `admin21-${p.key}-es-desktop.png`),
    fullPage: false,
  });
  console.log("wrote", p.key, "es");
}

await setLocale("en");
await ensureDark(true);
for (const p of pages) {
  await gotoAdmin(p.path);
  await ensureDark(true);
  await page.screenshot({
    path: path.join(OUT, `admin21-${p.key}-dark-desktop.png`),
    fullPage: false,
  });
  console.log("wrote", p.key, "dark");
}

await browser.close();
console.log("done");
