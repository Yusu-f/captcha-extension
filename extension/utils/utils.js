function waitFor(condition, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function checkCondition() {
      const result = condition();
      if (result) {
        resolve(result);
      } else {
        const currentTime = Date.now();
        if (currentTime - startTime >= timeout && timeout != 0) {
          reject(new Error("Timeout exceeded while waiting for condition."));
        } else {
          setTimeout(checkCondition, 100);
        }
      }
    }

    checkCondition();
  });
}

const solverecaptchaV2 = async (sitekey, pageurl) => {
  try {
    const requestBody = { sitekey, pageurl };
    fetch("http://localhost:3000/solve-recaptcha-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(async (data) => {
        const textarea = await waitFor(
          () => document.querySelector("textarea[name='g-recaptcha-response']"),
          10000
        );
        textarea.innerHTML = data.token;
        console.log("captcha solved");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

const solveCloudflare = async (params) => {
  try {
    fetch("http://localhost:3000/solve-cloudflare-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  } catch (error) {
    console.log(error);
  }
};

const solveDataDome = async (pageurl, captcha_url, userAgent) => {
  const datadomeCaptcha = await waitFor(
    () => document.querySelector("iframe[src*='captcha']"),
    0
  );
  if (datadomeCaptcha) {
    try {
      const requestBody = {
        pageurl,
        captcha_url,
        userAgent,
      };
      const response = await fetch("http://localhost:3000/solve-datadome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const captchaSolution = await response.json();
      const cookieString = captchaSolution.solution.cookie;
      document.cookie = cookieString;
      console.log("captcha solved!");
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const solveImageCaptcha = async () => {
  try {
    const imageElement = await waitFor(
      () =>
        document.querySelector(
          "img[src='https://domoplius.lt/sci/sci.php?n=subscribe']"
        ),
      0
    );

    imageElement.addEventListener("load", async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;

      ctx.drawImage(imageElement, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg");

      const uploadResponse = await fetch(
        "http://localhost:3000/solve-image-captcha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageData }),
        }
      );

      const response = await uploadResponse.json();

      const input = await waitFor(
        () => document.querySelector("input[id='passport_sci']"),
        10000
      );

      input.value = response.text.toUpperCase();
      console.log("captcha solved!");
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
