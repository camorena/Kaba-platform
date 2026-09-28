import puppeteer from "puppeteer-core";
import path from "path";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3018";
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

async function shot(file, scrollTo) {
  await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 400));
  if (scrollTo) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "start" });
    }, scrollTo);
    await new Promise((r) => setTimeout(r, 350));
  }
  await page.screenshot({ path: file, fullPage: false });
  console.log("wrote", file);
}

for (const vp of viewports) {
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });

  await shot(path.join(OUT, `admin18-settings-${vp.name}.png`));

  if (vp.name === "desktop") {
    await shot(path.join(OUT, `admin18-settings-security-desktop.png`), "settings-security");
    await shot(path.join(OUT, `admin18-settings-platform-desktop.png`), "settings-platform");

    // ES desktop
    await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, a")];
      const es = btns.find((b) => /^(ES|Español)$/i.test((b.textContent || "").trim()));
      if (es) es.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(OUT, `admin18-settings-es-desktop.png`),
      fullPage: false,
    });
    console.log("wrote es desktop");

    // dark desktop (toggle theme)
    await page.evaluate(() => {
      const root = document.documentElement;
      if (!root.classList.contains("dark")) {
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
        // fallback moon/sun icon button
        const tgl = candidates.find(
          (b) => b.querySelector("svg") && !/ES|EN/i.test(b.textContent || ""),
        );
        if (tgl) tgl.click();
      }
    });
    await new Promise((r) => setTimeout(r, 500));
    // ensure EN for dark shot clarity — toggle back if ES
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, a")];
      const en = btns.find((b) => /^(EN|English)$/i.test((b.textContent || "").trim()));
      if (en) en.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 400));
    // re-ensure dark
    await page.evaluate(() => {
      if (!document.documentElement.classList.contains("dark")) {
        const candidates = [
          ...document.querySelectorAll("header button, .admin-topbar button, button"),
        ];
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
    await page.screenshot({
      path: path.join(OUT, `admin18-settings-dark-desktop.png`),
      fullPage: false,
    });
    console.log(
      "wrote dark",
      await page.evaluate(() => document.documentElement.classList.contains("dark")),
    );
  }
}

await browser.close();
console.log("done");
