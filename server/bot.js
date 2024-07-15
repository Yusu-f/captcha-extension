const puppeteer = require("puppeteer");
const { readFileSync } = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${"/Users/a/Documents/Code/captcha-extension"}`,
      `--load-extension=${"/Users/a/Documents/Code/captcha-extension"}`,
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://www.aruodas.lt/", { timeout: 0 });

  // const preloadFile = readFileSync('./inject.js', 'utf8');
  // await page.evaluateOnNewDocument(preloadFile);

  // const preloadFile = readFileSync("./inject.js", "utf8");
  // await page.evaluateOnNewDocument(preloadFile);
  // const data = {
  //   sitekey: "0x4AAAAAAADnPIDROrmt1Wwj",
  //   pageurl: "https://www.skelbiu.lt/",
  //   data: "8a206899be3e65e2",
  //   pagedata:
  //     "3gAFo2l2Mbh0K3dwTVYrVGNNM0pHcWlmWjFEcUtBPT2jaXYyuEdEOTBrOTBQS1c1YXdVWTBtMlhkT3c9PaFk2gFAaUptc2p2cVRwRjVwWHV1aTdjODNVVlVCL0U5UVRXZVlJOUhQRXFwZEYxMmlsaXJGQWlXMG9OVkFTZkk0UEYwMjBZTXo4WnlMTTFSMEZQLzd3OHhmNzZETnFtTkFFZTN0bEpOSGhUcERoUnJaTHFKR1JvR1dGWDFuS0Fmb3AyWjloOXQ4MGh4b1RIMXhKcmdEUlhGMWZ1UEQ5MS9uSzZwRGt1UjJDYlhMQlowWkhjTHZpWDM5clhpdFdCTVhpRy9YQ1J2MTJoeFlDS3B2RGJOVFFLWWczUXF1MXhuRStUc1hJZ25MMWVLTUVvdnluMmhpemlyaXFHYjN5QkVBUlJWWU5ZVEt0YkxwMmpIb0t0b0hXamxHTGFMM3pWU0JhOS91UWlIRDdlTVByRVRoUVU3RDlMUHZVb2k3RDQwakoyOEqhbdksS3BreXJKZUVDdC9BZlNjbFhJR3ZDc3lmZDNCMHBtYjRMVEZOUFRVQlZ6RT2hdLRNVGN5TURjNE1EYzFPQzQzTURjPQ==",
  //   action: "managed",
  //   userAgent:
  //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  //   json: 1,
  // };
  // let res = await fetch("http://localhost:3000/solve-cloudflare-captcha", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // });
  // res = await res.json();
  // console.log(res);
  // const input = await page.$("input[name='cf-turnstile-response']");
  // let currentUrl = await page.url();
  // let previousUrl = currentUrl;

  // while (currentUrl === previousUrl) {
  //   await input.evaluate((el, value) => (el.value = value), res.data);
  //   await page.$eval("form#challenge-form", (form) => form.submit());
  //   await page.waitForNavigation();
  //   previousUrl = currentUrl;
  //   currentUrl = await page.url();
  // }

  // console.log("captcha solved!");
  // // await page.$eval("form#challenge-form", (form) => form.submit());

  // console.log("captcha solved!");

  //   await browser.close();
})();

// args: [
//   `--disable-extensions-except=${"/Users/a/Documents/Code/captcha-extension"}`,
//   `--load-extension=${"/Users/a/Documents/Code/captcha-extension"}`,
// ],
