/**
 * Fake Job Shield
 * Background Service Worker
 * Manifest V3
 *
 * Handles communication between the popup and the content script.
 * No analysis is performed here.
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log("Fake Job Shield installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || !request.action) {
        return;
    }

    switch (request.action) {
        case "scanCurrentPage":
            scanCurrentPage(sendResponse);
            return true;

        default:
            break;
    }
});

async function scanCurrentPage(sendResponse) {
    try {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tabs.length) {
            sendResponse({
                success: false,
                error: "No active tab found."
            });
            return;
        }

        const activeTab = tabs[0];

        if (!activeTab.id) {
            sendResponse({
                success: false,
                error: "Unable to identify the active tab."
            });
            return;
        }

        if (
            !activeTab.url ||
            activeTab.url.startsWith("chrome://") ||
            activeTab.url.startsWith("chrome-extension://") ||
            activeTab.url.startsWith("edge://") ||
            activeTab.url.startsWith("about:")
        ) {
            sendResponse({
                success: false,
                error: "This page cannot be scanned."
            });
            return;
        }

        chrome.tabs.sendMessage(
            activeTab.id,
            {
                action: "extractJobText"
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    sendResponse({
                        success: false,
                        error:
                            "Unable to communicate with this page. Please refresh the page and try again."
                    });
                    return;
                }

                if (!response) {
                    sendResponse({
                        success: false,
                        error: "No response received from the page."
                    });
                    return;
                }

                sendResponse(response);
            }
        );
    } catch (error) {
        console.error("Fake Job Shield:", error);

        sendResponse({
            success: false,
            error: error.message || "Unexpected error occurred."
        });
    }
}
