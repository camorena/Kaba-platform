import puppeteer from "puppeteer-core";

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:3026";
const OUT = "/workspace/kaba-fence/preview";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

async function shot(name) {
  const path = `${OUT}/${name}`;
  await page.screenshot({ path, fullPage: false });
  console.log("wrote", path);
}

async function shotCard(name) {
  const path = `${OUT}/${name}`;
  const el = await page.$(".admin-login-card");
  if (el) await el.screenshot({ path });
  else await page.screenshot({ path, fullPage: false });
  console.log("wrote", path);
}

async function setTheme(dark) {
  await page.evaluate((isDark) => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, dark);
}

async function setLocale(locale) {
  await page.evaluate((loc) => {
    localStorage.setItem("kaba-admin-locale", loc);
    document.cookie = `kaba_admin_locale=${loc};path=/;max-age=31536000;SameSite=Lax`;
  }, locale);
}

async function gotoLogin({ locale = "en", dark = false } = {}) {
  await page.goto(`${BASE}/admin/login`, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await setLocale(locale);
  await setTheme(dark);
  await page.reload({ waitUntil: "networkidle2" });
  await page.waitForSelector(".admin-login-root", { timeout: 30000 });
}

await gotoLogin({ locale: "en", dark: false });
await shot("login-form-desktop-en.png");
await shotCard("login-form-card-en.png");

const pwd = await page.$("#admin-password");
if (pwd) {
  await pwd.click({ clickCount: 3 });
  await pwd.type("wrong-password-preview");
  await Promise.all([
    page.waitForSelector(".admin-login-error", { timeout: 8000 }).catch(() => null),
    page.click(".admin-login-submit"),
  ]);
  await new Promise((r) => setTimeout(r, 400));
  await shotCard("login-form-error-en.png");
}

await gotoLogin({ locale: "en", dark: true });
await shot("login-form-desktop-en-dark.png");
await shotCard("login-form-card-en-dark.png");

await gotoLogin({ locale: "es", dark: false });
await shot("login-form-desktop-es.png");
await shotCard("login-form-card-es.png");

await gotoLogin({ locale: "es", dark: true });
await shot("login-form-desktop-es-dark.png");

await page.setViewport({ width: 390, height: 844 });
await gotoLogin({ locale: "en", dark: false });
await shot("login-form-mobile-en.png");

await browser.close();
console.log("done");
