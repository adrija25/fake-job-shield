/**
 * Fake Job Shield
 * Background Service Worker
 * Manifest V3
 *
 * Handles user-requested Current Page Scan.
 *
 * content.js is injected only after the user explicitly
 * requests a scan from the extension.
 *
 * No analysis or scoring is performed here.
 */

"use strict";

chrome.runtime.onInstalled.addListener(() => {
    console.log("Fake Job Shield installed.");
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (!request || typeof request.action !== "string") {
            return;
        }

        switch (request.action) {
            case "scanCurrentPage":
                scanCurrentPage(sendResponse);
                return true;

            default:
                return;
        }
    }
);

async function scanCurrentPage(sendResponse) {
    try {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!Array.isArray(tabs) || tabs.length === 0) {
            sendFailure(
                sendResponse,
                "No active tab found."
            );
            return;
        }

        const activeTab = tabs[0];

        if (
            !activeTab ||
            typeof activeTab.id !== "number"
        ) {
            sendFailure(
                sendResponse,
                "Unable to identify the active tab."
            );
            return;
        }

        if (!isScannableURL(activeTab.url)) {
            sendFailure(
                sendResponse,
                "This page cannot be scanned. Open a regular job listing webpage and try again."
            );
            return;
        }

        /*
         * Inject content.js only after the user has explicitly
         * requested Current Page Scan.
         *
         * activeTab provides temporary access to the current tab,
         * while scripting allows this user-requested injection.
         */
        try {
            await chrome.scripting.executeScript({
                target: {
                    tabId: activeTab.id
                },
                files: [
                    "content.js"
                ]
            });
        } catch (error) {
            console.warn(
                "Fake Job Shield: Unable to inject content script.",
                error
            );

            sendFailure(
                sendResponse,
                "Fake Job Shield cannot access this page. Open a regular job listing webpage and try again."
            );

            return;
        }

        /*
         * content.js is now available on the active page.
         * Ask it to extract the most relevant job-related text.
         */
        chrome.tabs.sendMessage(
            activeTab.id,
            {
                action: "extractJobText"
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.warn(
                        "Fake Job Shield:",
                        chrome.runtime.lastError.message
                    );

                    sendFailure(
                        sendResponse,
                        "Unable to communicate with this page. Please refresh the page and try again."
                    );

                    return;
                }

                if (
                    !response ||
                    typeof response !== "object"
                ) {
                    sendFailure(
                        sendResponse,
                        "No valid response was received from the page."
                    );

                    return;
                }

                if (response.success !== true) {
                    sendFailure(
                        sendResponse,
                        typeof response.error === "string" &&
                        response.error.trim()
                            ? response.error.trim()
                            : "Unable to extract job content from this page."
                    );

                    return;
                }

                if (
                    typeof response.text !== "string" ||
                    response.text.trim().length < 100
                ) {
                    sendFailure(
                        sendResponse,
                        "Not enough readable job content was found on this page."
                    );

                    return;
                }

                sendResponse({
                    success: true,
                    text: response.text.trim()
                });
            }
        );
    } catch (error) {
        console.error(
            "Fake Job Shield: Current page scan failed.",
            error
        );

        sendFailure(
            sendResponse,
            error && error.message
                ? error.message
                : "An unexpected error occurred while scanning this page."
        );
    }
}

function isScannableURL(url) {
    if (
        !url ||
        typeof url !== "string"
    ) {
        return false;
    }

    const normalizedURL = url.trim().toLowerCase();

    return (
        normalizedURL.startsWith("https://") ||
        normalizedURL.startsWith("http://")
    );
}

function sendFailure(sendResponse, message) {
    sendResponse({
        success: false,
        error:
            typeof message === "string" && message.trim()
                ? message.trim()
                : "Unable to scan this page."
    });
}
