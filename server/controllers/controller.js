const CAPTCHA_API_KEY = process.env.CAPTCHA_API_KEY;
const proxy = process.env.PROXY;
const TwoCaptcha = require("@2captcha/captcha-solver");
const solver = new TwoCaptcha.Solver(CAPTCHA_API_KEY);

const solverecaptchaV2 = async (req, res) => {
  const { sitekey, pageurl } = req.body;

  try {
    const response = await solver.recaptcha({ googlekey: sitekey, pageurl });

    if (response && response.data) {
      const token = response.data;
      res.status(200).json({ token });
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
};

const solveCloudflareCaptcha = async (req, res) => {
  const { sitekey, pageurl, data, pagedata, action, userAgent, json } =
    req.body;

  try {
    const response = await solver.cloudflareTurnstile({
      sitekey,
      pageurl,
      data,
      pagedata,
      action,
      userAgent,
      json,
    });

    if (response && response.data) {
      res.status(200).json(response);
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error submitting captcha: " + error.message });
  }
};

const solveImageCaptcha = async (req, res) => {
  try {
    const imageData = req.body.image;
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");

    let captchaResponse = await solver.imageCaptcha({ body: base64Data });
    res.status(200).json({ text: captchaResponse.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
};

const solveDataDomeCaptcha = async (req, res) => {
  const { pageurl, captcha_url, userAgent } = req.body;

  try {
    const response = await solver.dataDome({
      pageurl,
      captcha_url,
      userAgent,
      proxytype: "http",
      proxy,
    });

    if (response && response.solution) {
      res.status(200).json(response);
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error submitting captcha:" + error.message });
  }
};

module.exports = {
  solverecaptchaV2,
  solveCloudflareCaptcha,
  solveImageCaptcha,
  solveDataDomeCaptcha,
};
