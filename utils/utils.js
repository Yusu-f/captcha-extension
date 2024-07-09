// (function() {
//   // Intercept XMLHttpRequest
//   const originalXHR = window.XMLHttpRequest;
//   function newXHR() {
//       const realXHR = new originalXHR();

//       realXHR.addEventListener('readystatechange', function() {
//           if (realXHR.readyState == 4) { // Request is complete
//               console.log('XHR Request URL:', realXHR.responseURL);
//               console.log('XHR Response:', realXHR.responseText);
//           }
//       }, false);

//       return realXHR;
//   }
//   window.XMLHttpRequest = newXHR;

//   // Intercept Fetch API
//   const originalFetch = window.fetch;
//   window.fetch = async function() {
//       const response = await originalFetch.apply(this, arguments);

//       // Clone the response so we can read it twice
//       const clone = response.clone();

//       clone.text().then(bodyText => {
//           console.log('Fetch Request URL:', arguments[0]);
//           console.log('Fetch Response:', bodyText);
//       });

//       return response;
//   };
// })();


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
    console.log("sending captcha request");
    fetch("http://localhost:3000/solve-recaptcha-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Response:", data);
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

const solveCloudflare = async (sitekey, pageurl) => {
  console.log("solveCloudflare called");
  try {
    const requestBody = {
      sitekey,
      pageurl,
      data: "b.cData",
      pagedata: "b.chlPageData",
      action: "b.action",
      userAgent: navigator.userAgent,
      json: 1,
    };
    console.log("sending cloudflare captcha request", sitekey, pageurl);
    fetch("http://localhost:3000/solve-cloudflare-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Response:", data);
        const textarea = await waitFor(
          () => document.querySelector("input[name='cf-turnstile-response']"),
          10000
        );
        textarea.value = data.token;
        console.log("captcha solved!");
      })
      .catch((error) => {
        console.error("Error:", error);
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
      console.log("sending dataDome captcha request");
      const response = await fetch("http://localhost:3000/solve-datadome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const captchaSolution = await response.json();
      console.log("Response:", captchaSolution);
      const cookieString = captchaSolution.solution.cookie;
      document.cookie = cookieString;
      console.log("captcha solved!", cookieString);
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const solveImageCaptcha = async () => {
  console.log("Solving image captcha");
  const cookies = document.cookie;
  try {
    const imageElement = await waitFor(
      () =>
        document.querySelector(
          "img[src='https://domoplius.lt/sci/sci.php?n=subscribe']"
        ),
      0
    );
    console.log(imageElement);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to the image dimensions
    canvas.width = imageElement.width;
    canvas.height = "300px";
    console.log("canvas", canvas);

    // Draw the image onto the canvas
    ctx.drawImage(imageElement, 15, 20);
    document.body.appendChild(canvas);

  //   canvas.toBlob((blob) => {
  //     console.log(blob);
  //     // const url = URL.createObjectURL(blob);
  //     // // Open the image in a new tab
  //     // const newTab = window.open();
  //     // newTab.document.write(`<img src="${url}" style="width: 100%; height: auto;" />`);
  //     // URL.revokeObjectURL(url);
  // }, 'image/png');
    const headers = new Headers({
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": navigator.userAgent,
      Referer: document.referrer,
      DNT: "1",
      "Sec-Ch-Ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
      "Cookie": "PHPSESSID=6a8ghichh28234ch7ou3r5dcai; apLANG=lt; saved_searches=667ffc5c3076b; saved_searches_user=0; _fbp=fb.1.1719663730327.770617236522389657; OptanonAlertBoxClosed=2024-06-29T12:22:14.097Z; eupubconsent-v2=CQA-IRgQA-IRgAcABBLTA7EsAP_gAEPgAChQKTtV_G__bWlr8X73aftkeY1P9_h77sQxBhfJE-4FzLvW_JwXx2ExNA36tqIKmRIEu3bBIQNlHJDUTVCgaogVryDMak2coTNKJ6BkiFMRO2dYCF5vmwtj-QKY5vr993dx2B-t_dv83dzyz4VHn3a5_2e0WJCdA58tDfv9bROb-9IOd_58v4v8_F_rE2_eT1l_tevp7D9-cts7_XW-9_fff79Ll_-mB_gpKAWYaFRAGWRISEGgYQQIAVBWEBFAgAAABIGiAgBMGBTsDAJdYSIAQAoABggBAACjIAEAAAkACEQAQAFAgAAgECgADAAgGAgAYGAAMAFgIBAACA6BCmBBAoFgAkZkRCmBCFAkEBLZUIJAECCuEIRZ4EEAiJgoAAASACsAAQFgsDiSQErEggS4g2gAAIAEAggAqEUnZgCCAM2WqvFk2jK0gLR8wXvaYAAA.f_wACHwAAAAA; _gid=GA1.2.1865706913.1719932553; _pctx=%7Bu%7DN4IgrgzgpgThIC4B2YA2qA05owMoBcBDfSREQpAeyRCwgEt8oBJAEzIEYOAmATgBYA7AA4OvUQFYAzPwlyAbPJABfIA; _pcid=%7B%22browserId%22%3A%22ly69i5kgzgvrbobq%22%7D; _cc_id=5fbaa8f1fb079662df01f491bd7598e; cX_G=cx%3A22idai8qx6en433fni40mojgkp%3A3curk0z41nqun; _au_1d=AU1D-0100-001720036831-PVKZGTLT-PLKQ; _au_last_seen_iab_tcf=1720036836213; _dynamicAdBoost_BoHDM8o_userid_consent_data=7683139191984611; _sharedid=0b1251ee-fc38-4234-ada0-375161592062; WPabs=e4860a; panoramaId_expiry=1720212264580; panoramaId=8625df2b04884c00c66570772891a9fb927a60274689ee9c9440f23231ca5caa; panoramaIdType=panoDevice; _dynamicAdBoost_KbMoPMV_userid_consent_data=7683139191984611; cf_clearance=CdrZ.IL9eysK.YUH6WVxSBLQb4gOqWutT28Vdh3JwrQ-1720192086-1.0.1.1-TWXA6xoU5wF8sqUwYfpw5AzOS4JTQKWWDQimLzqz_DFZXeuqcwniSXNzkqW3q5GoxU4pvOLnVnOPkfvMqWwHqw; _ga_FVWZ0RM4DH=GS1.1.1720192080.10.0.1720192436.60.0.0; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+05+2024+16%3A14%3A01+GMT%2B0100+(West+Africa+Standard+Time)&version=202403.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=068a844a-fc22-4dcf-bc69-4f07a1647b0f&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0003%3A1%2CC0001%3A1%2CC0004%3A1%2CV2STACK42%3A1&geolocation=%3B&AwaitingReconsent=false; __gads=ID=5821b2cfdc1756a6:T=1720036810:RT=1720192441:S=ALNI_MagLlnypLHMy479MBBuRMPjl_JJPw; __gpi=UID=00000e7875a3cb83:T=1720036810:RT=1720192441:S=ALNI_MYu7igpuSQhdeEx4Iu2lWBv-tpIBA; __eoi=ID=6e72d959ea4df658:T=1720036810:RT=1720192441:S=AA-AfjbfjFaRY7eOZAj3V8uVrYUc; _tfpvi=NmViNDZkYjktZDE0MC00NjdjLWI3MGEtNTI5YjUyNzA2NjYzIzYtMQ%3D%3D; _ga=GA1.2.853260471.1719663726; _ga_R5CZ08ZQR3=GS1.1.1720192080.20.1.1720192448.48.0.0; cto_bundle=8PHEll91WjA1YkJRRW9ST00lMkIxJTJGbVpFaXkzdHJlTjloU2JHZXJZWkphMkVNUFklMkZDQlRnT1duUHd5RyUyQkd1UzRYa0Nzb2ZzZk04TnZlT0xjT3E4YldWV1ZHaGpmZGJkJTJGT0I5d1hSQjlMUk1aYk90Szl5YUpPRjVGdTRZMG9TQ3d1TkxKU3p3Q3E0NzlJendqbk96amZ3aVpjU29iODhsOFptTEd2T3FNODd2WGQ2bFJIMkhOVnRBZHFjSUVnZWklMkJlYXdoNVU4aFZwRWRHJTJGSHFsbFE1VGJRQXVEJTJCZyUzRCUzRA; cto_bidid=MP9RAV9Bd3hOUDhrUEwxSndyJTJGeU5IY0E5cURXRkJlMHdleFFCNXAwTGtaMjZmVDFrSkNHVHdyMUlGVzJaMnhMR0xQJTJGb0l3STVMVGFXYW15TFRNajZNTmNjaldxVlJEdVVmUXlHNFE4V3h4WEV0TWclM0Q; cX_P=ly69i5kgzgvrbobq; _dd_s=logs=1&id=538c1cea-c6bd-4949-81c4-d23649179126&created=1720192070267&expire=1720193581472"
    });

    const response = await fetch(
      "https://domoplius.lt/sci/sci.php?n=subscribe",
      {
        method: "GET",
        headers: headers,
      }
    );

    const blob = await response.blob();

    // console.log("Blob size:", blob.size);
    // console.log("Blob type:", blob.type);

    // const url = URL.createObjectURL(blob)
    // console.log(url);

    // // Create a FormData object and append the blob
    // const formData = new FormData();
    // formData.append("file", blob, "image");
    // console.log(formData);

    var formData = new FormData();
    formData.append("file", blob, "image.jpg");

    const uploadResponse = await fetch(
      "http://localhost:3000/solve-image-captcha",
      {
        method: "POST",
        body: formData,
      }
    );

    // Get the JSON response from the server
    const data = await uploadResponse.json();

    // Log the response data and indicate that the captcha is solved
    console.log("Response:", data);
    console.log("Captcha solved!");
  } catch (error) {
    // Handle any errors that occur during the fetch or upload process
    console.error("Error:", error);
  }
};





