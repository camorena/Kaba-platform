import puppeteer from "puppeteer-core";
import path from "path";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3020";
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

async function gotoTemplates() {
  await page.goto(`${BASE}/admin/templates`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 450));
}

async function clickChannel(labelRe) {
  await page.evaluate((reSource) => {
    const re = new RegExp(reSource, "i");
    const btns = [...document.querySelectorAll("button")];
    const hit = btns.find((b) => re.test((b.textContent || "").trim()));
    if (hit) hit.click();
  }, labelRe);
  await new Promise((r) => setTimeout(r, 350));
}

async function selectNthTemplate(n) {
  await page.evaluate((idx) => {
    const opts = [...document.querySelectorAll('[role="listbox"] button, [role="option"] button')];
    if (opts[idx]) opts[idx].click();
  }, n);
  await new Promise((r) => setTimeout(r, 300));
}

for (const vp of viewports) {
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });

  await gotoTemplates();
  await page.screenshot({
    path: path.join(OUT, `admin20-templates-${vp.name}.png`),
    fullPage: false,
  });
  console.log("wrote", vp.name);

  if (vp.name === "desktop") {
    // Email channel
    await clickChannel("^Email|^Correo");
    await selectNthTemplate(0);
    await page.screenshot({
      path: path.join(OUT, `admin20-templates-email-desktop.png`),
      fullPage: false,
    });
    console.log("wrote email desktop");

    // Empty / no matches via search
    await clickChannel("^All|^Todas");
    await page.evaluate(() => {
      const input = document.querySelector('#templates-search');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        setter?.call(input, "zzzz-no-match");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT, `admin20-templates-empty-desktop.png`),
      fullPage: false,
    });
    console.log("wrote empty desktop");

    // Clear via button if present, else clear input
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")];
      const clear = btns.find((b) => /clear|limpiar/i.test(b.textContent || ""));
      if (clear) clear.click();
      else {
        const input = document.querySelector('#templates-search');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;
          setter?.call(input, "");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    });
    await new Promise((r) => setTimeout(r, 350));

    // ES desktop
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, a")];
      const es = btns.find((b) => /^(ES|Español)$/i.test((b.textContent || "").trim()));
      if (es) es.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await gotoTemplates();
    await page.screenshot({
      path: path.join(OUT, `admin20-templates-es-desktop.png`),
      fullPage: false,
    });
    console.log("wrote es desktop");

    // Dark desktop (toggle theme), then EN
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
        const tgl = candidates.find(
          (b) => b.querySelector("svg") && !/ES|EN/i.test(b.textContent || ""),
        );
        if (tgl) tgl.click();
      }
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, a")];
      const en = btns.find((b) => /^(EN|English)$/i.test((b.textContent || "").trim()));
      if (en) en.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await gotoTemplates();
    await page.evaluate(() => {
      if (!document.documentElement.classList.contains("dark")) {
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
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT, `admin20-templates-dark-desktop.png`),
      fullPage: false,
    });
    console.log("wrote dark desktop");
  }
}

await browser.close();
console.log("done");
