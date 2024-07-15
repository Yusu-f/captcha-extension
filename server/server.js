require("dotenv").config();
const express = require("express");
const TwoCaptcha = require("@2captcha/captcha-solver");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const { log } = require("console");

const PORT = process.env.PORT || 3000;

const CAPTCHA_API_KEY = process.env.CAPTCHA_API_KEY;
const proxy = process.env.PROXY;

const solver = new TwoCaptcha.Solver(CAPTCHA_API_KEY);

app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });
app.use(bodyParser.json({ limit: "50mb" }));

const router = express.Router();

const convertFileToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const base64 = Buffer.from(data).toString("base64");
        resolve(base64);
      }
    });
  });
};

app.post("/solve-recaptcha-v2", async (req, res) => {
  const { sitekey, pageurl } = req.body;
  console.log("received request", sitekey, pageurl);

  try {
    // const response = await solver.recaptcha({googlekey: sitekey, pageurl });
    const response = { data: "fake-token", id: "fake-id" };

    if (response && response.data) {
      const token = response.data;
      res.json({ token });
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
});

app.post("/solve-cloudflare-captcha", async (req, res) => {
  const { sitekey, pageurl, data, pagedata, action, userAgent, json } =
    req.body;
  console.log("received request", sitekey, pageurl);

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
    console.log(response);
    // const response = {
    //   data: '1.cNR5vElRYtIoEbYkJ4wW38Gvhj2w_QY-UjDIURikSIIpV-enL9mnJZoRbjvGwaIhBv49K5Xvmj_4k8tH441FZY8pCBXQ2naBstrl4w3EDPbdJwM3DtLxE6Eq7ZsIM5-hNwVTtoWmTm01r-ZdbLwrzfzbvjQvye7wV39u-0ZadqmN7ThJRn2IDujicMbyl-ULLj_UjySaYLEIOXYPtZ2_oWKceBGZQmuSypUPPFZih-JlYljFv6IINPcjYq4EJfSZ7cgvMu-Xjcce4RLQ2oBrHky7w9amlYemMpUv3wYVLGDw0cZE1aAV7O6e_jUObHigjquZ1ehjVejdySTOk_fpk3MlbbBk1cqGv7npo7hSI_hR_4BVjYNejVeqZGhb07qwv3sW_deAWswGfr65liwcRZfnSc0J_2FiQs34GF5RKvaOuOBpK1sdgXJTD5KbUPA_PrYCtLPT3bBY3FKCR7bk0Q.GEsEnBiX8f-tWJ8rnt553w.2d4cb5c3aa6eaef1df5b9d8bd8a4628dfcec09033f454e47d4d3d3f6b0b2c0af',
    //   id: '76874619914'
    // }
    // const response = { data: "fake-token", id: "fake-id"}

    if (response && response.data) {
      const token = response.data;
      res.json(response);
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
});

app.post("/solve-image-captcha", async (req, res) => {
  try {
    console.log("request received");
  const imageData = req.body.image;
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");

  let captchaResponse = await solver.imageCaptcha({ body: base64Data });
  console.log(captchaResponse);
  res.json({text: captchaResponse.data});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
});

app.post("/solve-datadome", async (req, res) => {
  const { pageurl, captcha_url, userAgent } = req.body;
  console.log("received datadome request");

  try {
    const response = await solver.dataDome({
      pageurl,
      captcha_url,
      userAgent,
      proxytype: "http",
      proxy
    });
    console.log(response);

    if (response && response.solution) {
      res.json(response);
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
