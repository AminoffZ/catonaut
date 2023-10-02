// Injecting the script when the website specified in the manifest is loaded
const script: HTMLScriptElement = document.createElement('script');
script.src = chrome.runtime.getURL('script.js');
(document.head || document.documentElement).appendChild(script);
script.onload = function () {
  script.remove();
};
