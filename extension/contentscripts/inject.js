(async () => {
  const turnstile = await waitFor(() => window.turnstile, 0);
  if (turnstile) {
    let params;
    turnstile.render = (a, b) => {
      params = {
        sitekey: b.sitekey,
        pageurl: window.location.href,
        data: b.cData,
        pagedata: b.chlPageData,
        action: b.action,
        userAgent: navigator.userAgent,
        json: 1,
      };
      // console.log("intercepted-params:" + JSON.stringify(params));
      window.cfCallback = b.callback;
      solveCloudflare(params, window.cfCallback);
      return;
    };
  }
})();

const solveCloudflare = async (params, callback) => {
  try {
    fetch("http://localhost:3000/solve-cloudflare-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then(async (data) => {
        callback(data.data);
        console.log("captcha solved!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

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
