(() => {
    "use strict";

    /**
     * Fake Job Shield
     * Content Script
     *
     * Extracts readable job-related text from the current page.
     * No analysis is performed here.
     * The popup/analyzer remains responsible for scoring.
     */

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (!request || request.action !== "extractJobText") {
            return;
        }

        try {
            const extractedText = extractJobText();

            sendResponse({
                success: true,
                text: extractedText
            });
        } catch (error) {
            console.error("Fake Job Shield:", error);

            sendResponse({
                success: false,
                error: error.message || "Unable to extract page content."
            });
        }

        return true;
    });

    function extractJobText() {
        const selectors = [
            "main",
            "article",
            "[role='main']",
            ".jobs-description",
            ".job-description",
            ".jobDescriptionContent",
            ".jobsearch-jobDescriptionText",
            ".description",
            ".details",
            ".content",
            "#job-details",
            "#jobDescriptionText",
            "#job-description",
            "#content",
            "section"
        ];

        const collected = [];

        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                const text = cleanText(element.innerText);

                if (text.length >= 100) {
                    collected.push(text);
                }
            });
        });

        let result = longestUniqueText(collected);

        if (!result || result.length < 100) {
            result = cleanText(document.body.innerText || "");
        }

        return result.substring(0, 50000);
    }

    function cleanText(text) {
        return String(text || "")
            .replace(/\r/g, "")
            .replace(/\t/g, " ")
            .replace(/\u00A0/g, " ")
            .replace(/[ ]{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function longestUniqueText(list) {
        const seen = new Set();
        let longest = "";

        list.forEach((item) => {
            const normalized = item.toLowerCase();

            if (seen.has(normalized)) {
                return;
            }

            seen.add(normalized);

            if (item.length > longest.length) {
                longest = item;
            }
        });

        return longest;
    }
})();
