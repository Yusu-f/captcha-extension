function prependScript(url) {
  let doc = document.createElement('script');
  doc.src = url;

  const insertScript = () => {
    const target = document.head || document.documentElement;

    if (target) {
      target.prepend(doc);
      clearInterval(intervalId);
    }
  };

  const intervalId = setInterval(() => {
    if (document.head || document.documentElement) {
      insertScript();
    }
  }, 100);
}

prependScript(chrome.runtime.getURL('../contentscripts/inject.js'));