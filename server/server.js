require("dotenv").config();
const express = require("express");
const TwoCaptcha = require("@2captcha/captcha-solver");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const CAPTCHA_API_KEY = process.env.CAPTCHA_API_KEY;
const proxy = process.env.PROXY;

const solver = new TwoCaptcha.Solver(CAPTCHA_API_KEY);

app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

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
  return

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
    // const response = { data: "fake-token", id: "fake-id"}

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

app.post("/solve-image-captcha", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // const base64Image = await convertFileToBase64(req.file.path);
  // console.log("Base64 Image:", base64Image);

  // await solver.imageCaptcha({
  //   body: imageBase64,
  //   numeric: 4,
  //   min_len: 5,
  //   max_len: 5,
  // });
  // res.status(200).json({ message: "Image sent successfully" });

  const destPath = path.join(__dirname, "uploads", req.file.originalname);

  // Rename the temporary file to the desired location
  fs.rename(req.file.path, destPath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save image" });
    }

    res
      .status(200)
      .json({ message: "Image saved successfully", path: destPath });
  });
  return;

  const { formData } = req.body;
  console.log("received request", req.body);
  return;

  try {
    const response = await solver.imageCaptcha({ body: captchaBase64 });
    console.log(response);
    res.json(response);
    return;

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

app.post("/solve-datadome", async (req, res) => {
  const { pageurl, captcha_url, userAgent } = req.body;
  console.log("received request", cloudflareSiteKey, cloudflarePageUrl);

  try {
    const response = await solver.dataDome({
      pageurl,
      captcha_url,
      userAgent,
      proxy,
      proxytype: "http",
    });
    console.log(response);

    if (response && response.solution) {
      res.json(response);
    } else {
      throw new Error("Error submitting captcha: " + response.text);
    }
  } catch (error) {
    res.status(500).json({ error: "Error in submitCaptcha: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
