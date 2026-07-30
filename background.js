chrome.runtime.onInstalled.addListener(() => {
    console.log("Fake Job Shield installed.");
});

chrome.runtime.onStartup?.addListener(() => {
    console.log("Fake Job Shield started.");
});
