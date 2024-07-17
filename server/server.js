require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

const {solverecaptchaV2, solveCloudflareCaptcha, solveImageCaptcha, solveDataDomeCaptcha} = require("./controllers/controller");

app.post("/solve-recaptcha-v2", solverecaptchaV2);

app.post("/solve-cloudflare-captcha", solveCloudflareCaptcha);

app.post("/solve-image-captcha", solveImageCaptcha);

app.post("/solve-datadome", solveDataDomeCaptcha);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
