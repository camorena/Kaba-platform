import puppeteer from "puppeteer-core";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3025";
const OUT = "/workspace/kaba-fence/preview";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1100 });

async function shot(name) {
  const path = `${OUT}/${name}`;
  await page.screenshot({ path, fullPage: false });
  console.log("wrote", path);
}

async function shotForm(name) {
  const path = `${OUT}/${name}`;
  const el = await page.$("form, .quote-confirm");
  if (el) {
    await el.screenshot({ path });
  } else {
    await page.screenshot({ path, fullPage: false });
  }
  console.log("wrote", path);
}

async function setTheme(dark) {
  await page.evaluate((isDark) => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, dark);
}

async function clickLabeled(label) {
  await page.evaluate((text) => {
    const btn = [...document.querySelectorAll("button")].find(
      (b) => b.textContent?.trim() === text,
    );
    if (!btn) throw new Error(`Button not found: ${text}`);
    btn.click();
  }, label);
}

async function fillStep1() {
  await page.waitForSelector("#name");
  await page.type("#name", "Jordan Preview");
  await page.type("#phone", "(919) 555-0199");
  await page.type("#email", "jordan@example.com");
}

async function fillStep2() {
  await page.waitForSelector("#serviceType");
  await page.select("#serviceType", "Vinyl Fence");
  await page.type("#address", "Angier, NC");
}

await page.goto(`${BASE}/contact`, { waitUntil: "networkidle2", timeout: 60000 });
await setTheme(false);
await page.reload({ waitUntil: "networkidle2" });
await page.waitForSelector("form");
await shot("quote-form-step1-contact.png");
await shotForm("quote-form-step1-card.png");

await fillStep1();
await clickLabeled("Continue");
await page.waitForSelector("#serviceType");
await fillStep2();
await shotForm("quote-form-step2-project.png");

await clickLabeled("Continue");
await page.waitForSelector("#description");
await setTheme(true);
await new Promise((r) => setTimeout(r, 150));
await clickLabeled("Request Free Quote");
await page.waitForSelector("#description-error", { timeout: 5000 });
console.log("bannerPresent(single)=", !!(await page.$("#form-error-summary")));
console.log(
  "inline=",
  await page.$eval("#description-error", (el) => el.textContent),
);
await shot("quote-form-step3-validation-dark.png");
await shotForm("quote-form-step3-validation-card-dark.png");

await page.type(
  "#description",
  "About 80 feet of vinyl privacy fence along the backyard, prefer white, flexible on timing.",
);
await clickLabeled("Request Free Quote");
await page.waitForFunction(
  () => document.body.innerText.includes("Request received"),
  { timeout: 15000 },
);
await setTheme(false);
await shot("quote-form-success.png");
await shotForm("quote-form-success-card.png");

await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Submit another"),
  );
  btn?.click();
});
await page.waitForSelector("#name");
await setTheme(true);
await clickLabeled("Continue");
await page.waitForSelector("#form-error-summary", { timeout: 5000 });
const inlineCount = await page.$$eval("p[role='alert']", (els) => els.length);
const summaryText = await page.$eval("#form-error-summary", (el) => el.innerText);
console.log("multi inline alert count=", inlineCount);
console.log("summary=\n" + summaryText);
await shotForm("quote-form-step1-multi-error-dark.png");

await browser.close();
console.log("done");
