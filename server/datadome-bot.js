const puppeteer = require("puppeteer");
const { readFileSync } = require("fs");

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
              `--disable-extensions-except=${"/Users/a/Documents/Code/captcha-extension"}`,
              `--load-extension=${"/Users/a/Documents/Code/captcha-extension"}`,
            ],
          });
          const page = await browser.newPage();
          await page.goto("https://www.idealista.it/", { timeout: 0 });
    } catch (error) {
        console.log(error);
    }
})()