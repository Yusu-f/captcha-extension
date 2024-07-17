const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${"/Users/a/Documents/Code/captcha-extension/extension"}`,
      `--load-extension=${"/Users/a/Documents/Code/captcha-extension/extension"}`,
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://skelbiu.lt/", { timeout: 0 });
})();

