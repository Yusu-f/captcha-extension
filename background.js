console.log("Background script still running");

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log('Navigation completed on tab:', details.tabId);
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: injectScript
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Script injection failed:', chrome.runtime.lastError.message);
      } else {
        console.log('Script injected successfully');
      }
    });
  }, {url: [{urlMatches : 'https://www.aruodas.lt/*'}]});
  
  function injectScript() {
    console.log('Script injected by background script');
    console.clear = () => console.log('Console was cleared');
    const i = setInterval(() => {
      if (window.turnstile) {
        console.log('Turnstile object found');
        clearInterval(i);
        window.turnstile.render = (a, b) => {
          let params = {
            sitekey: b.sitekey,
            pageurl: window.location.href,
            data: b.cData,
            pagedata: b.chlPageData,
            action: b.action,
            userAgent: navigator.userAgent,
            json: 1
          };
          console.log('intercepted-params:' + JSON.stringify(params));
          window.cfCallback = b.callback;
          return;
        };
      }
    }, 50);
  }
  