/**
 * Fake Job Shield
 * Background Service Worker
 * Manifest V3
 *
 * Handles communication between the popup and the content script.
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
        /*
         * Find the currently active tab in the user's
         * current browser window.
         */
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

        /*
         * Chrome extensions cannot inject/read content from
         * certain browser-controlled or protected pages.
         */
        if (!isScannableURL(activeTab.url)) {
            sendFailure(
                sendResponse,
                "This page cannot be scanned. Open a regular job listing webpage and try again."
            );
            return;
        }

        /*
         * Ask content.js to extract the most relevant
         * job-related text from the current page.
         */
        chrome.tabs.sendMessage(
            activeTab.id,
            {
                action: "extractJobText"
            },
            (response) => {
                /*
                 * This commonly occurs when content.js is not
                 * available on the page, such as immediately
                 * after updating/reloading the extension.
                 */
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

                /*
                 * A content script should always return a
                 * structured response.
                 */
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

                /*
                 * Preserve legitimate extraction errors returned
                 * by content.js.
                 */
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

                /*
                 * Validate extracted text before sending it
                 * back to the popup.
                 */
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

                /*
                 * Successful extraction.
                 *
                 * The popup/analyzer will perform the actual
                 * Fake Job Shield risk analysis.
                 */
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

    /*
     * Only ordinary HTTP/HTTPS webpages should be scanned.
     *
     * This automatically excludes:
     * chrome://
     * chrome-extension://
     * edge://
     * about:
     * file://
     * view-source:
     * devtools://
     * data:
     * javascript:
     * and other unsupported schemes.
     */
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
