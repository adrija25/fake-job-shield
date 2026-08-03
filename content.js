(() => {
    "use strict";

    /**
     * Fake Job Shield
     * Content Script
     *
     * Extracts the most relevant readable job-related text
     * from the current page.
     *
     * No risk analysis or scoring is performed here.
     * popup.js / analyzer.js remain responsible for analysis.
     */

    const MIN_TEXT_LENGTH = 100;
    const MAX_TEXT_LENGTH = 50000;

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (!request || request.action !== "extractJobText") {
                return;
            }

            try {
                const extractedText = extractJobText();

                if (!extractedText || extractedText.length < MIN_TEXT_LENGTH) {
                    sendResponse({
                        success: false,
                        error: "Not enough readable job content was found on this page."
                    });

                    return;
                }

                sendResponse({
                    success: true,
                    text: extractedText
                });
            } catch (error) {
                console.error(
                    "Fake Job Shield: Page extraction failed.",
                    error
                );

                sendResponse({
                    success: false,
                    error:
                        error && error.message
                            ? error.message
                            : "Unable to extract page content."
                });
            }

            return true;
        }
    );

    function extractJobText() {
        /*
         * Stage 1
         *
         * Look for containers that are strongly associated with
         * actual job descriptions.
         *
         * These are intentionally checked BEFORE generic page
         * containers such as main, article or section.
         */

        const specificSelectors = [
            /*
             * LinkedIn
             */
            ".jobs-description-content__text",
            ".jobs-box__html-content",
            ".jobs-description__content",
            ".jobs-description",
            "#job-details",

            /*
             * Indeed
             */
            "#jobDescriptionText",
            ".jobsearch-jobDescriptionText",

            /*
             * Glassdoor / common job layouts
             */
            ".jobDescriptionContent",
            ".job-description",
            "#job-description",

            /*
             * Common semantic/data attributes used by job sites
             */
            "[data-testid='job-description']",
            "[data-test='job-description']",
            "[data-automation='jobDescription']",
            "[data-automation-id='jobPostingDescription']",
            "[itemprop='description']"
        ];

        const specificResult =
            findBestSpecificJobDescription(specificSelectors);

        if (specificResult) {
            return limitText(specificResult);
        }

        /*
         * Stage 2
         *
         * Look for semantic containers that appear to represent
         * a job description based on their id/class/ARIA metadata.
         */

        const semanticResult = findSemanticJobDescription();

        if (semanticResult) {
            return limitText(semanticResult);
        }

        /*
         * Stage 3
         *
         * Use article/main containers as a controlled fallback.
         *
         * Unlike the previous implementation, we do not combine
         * every generic section and simply select the largest one.
         */

        const structuredResult = findStructuredPageContent();

        if (structuredResult) {
            return limitText(structuredResult);
        }

        /*
         * Stage 4
         *
         * Last-resort body extraction for unsupported job sites.
         */

        return limitText(extractBodyFallback());
    }

    function findBestSpecificJobDescription(selectors) {
        const candidates = [];

        selectors.forEach((selector, selectorIndex) => {
            let elements;

            try {
                elements = document.querySelectorAll(selector);
            } catch (error) {
                return;
            }

            elements.forEach((element) => {
                if (!isUsableElement(element)) {
                    return;
                }

                const text = extractReadableText(element);

                if (text.length < MIN_TEXT_LENGTH) {
                    return;
                }

                candidates.push({
                    text,
                    selectorIndex,
                    length: text.length
                });
            });
        });

        if (candidates.length === 0) {
            return "";
        }

        /*
         * Earlier selectors have higher confidence.
         *
         * If multiple elements use the same selector, prefer the
         * element containing the most useful readable content.
         */

        candidates.sort((a, b) => {
            if (a.selectorIndex !== b.selectorIndex) {
                return a.selectorIndex - b.selectorIndex;
            }

            return b.length - a.length;
        });

        return candidates[0].text;
    }

    function findSemanticJobDescription() {
        const candidates = [];

        const elements = document.querySelectorAll(
            "div, section, article"
        );

        elements.forEach((element) => {
            if (!isUsableElement(element)) {
                return;
            }

            const identity = getElementIdentity(element);

            if (!identity) {
                return;
            }

            const relevance = calculateIdentityRelevance(identity);

            if (relevance <= 0) {
                return;
            }

            const text = extractReadableText(element);

            if (text.length < MIN_TEXT_LENGTH) {
                return;
            }

            candidates.push({
                text,
                relevance,
                length: text.length
            });
        });

        if (candidates.length === 0) {
            return "";
        }

        candidates.sort((a, b) => {
            if (a.relevance !== b.relevance) {
                return b.relevance - a.relevance;
            }

            /*
             * Once two elements have equal semantic relevance,
             * prefer a substantial description without blindly
             * rewarding enormous page containers.
             */

            return scoreUsefulLength(b.length) -
                scoreUsefulLength(a.length);
        });

        return candidates[0].text;
    }

    function findStructuredPageContent() {
        const candidates = [];

        const selectors = [
            "article",
            "main",
            "[role='main']"
        ];

        selectors.forEach((selector, selectorIndex) => {
            let elements;

            try {
                elements = document.querySelectorAll(selector);
            } catch (error) {
                return;
            }

            elements.forEach((element) => {
                if (!isUsableElement(element)) {
                    return;
                }

                const text = extractReadableText(element);

                if (text.length < MIN_TEXT_LENGTH) {
                    return;
                }

                const jobRelevance = calculateTextRelevance(text);

                candidates.push({
                    text,
                    jobRelevance,
                    selectorIndex,
                    length: text.length
                });
            });
        });

        if (candidates.length === 0) {
            return "";
        }

        candidates.sort((a, b) => {
            if (a.jobRelevance !== b.jobRelevance) {
                return b.jobRelevance - a.jobRelevance;
            }

            if (a.selectorIndex !== b.selectorIndex) {
                return a.selectorIndex - b.selectorIndex;
            }

            return scoreUsefulLength(b.length) -
                scoreUsefulLength(a.length);
        });

        return candidates[0].text;
    }

    function extractBodyFallback() {
        if (!document.body) {
            return "";
        }

        /*
         * Clone the body so irrelevant elements can be removed
         * without changing the webpage the user is viewing.
         */

        const clone = document.body.cloneNode(true);

        removeNonContentElements(clone);

        return cleanText(clone.innerText || clone.textContent || "");
    }

    function extractReadableText(element) {
        if (!element) {
            return "";
        }

        /*
         * Work on a clone. Never modify the live job page.
         */

        const clone = element.cloneNode(true);

        removeNonContentElements(clone);

        return cleanText(clone.innerText || clone.textContent || "");
    }

    function removeNonContentElements(root) {
        if (!root || typeof root.querySelectorAll !== "function") {
            return;
        }

        const unwantedSelectors = [
            "script",
            "style",
            "noscript",
            "template",
            "svg",
            "canvas",
            "iframe",

            "nav",
            "footer",

            "[role='navigation']",
            "[role='dialog']",
            "[role='menu']",
            "[role='menubar']",

            "[aria-hidden='true']",

            ".modal",
            ".dialog",
            ".popup",
            ".tooltip",

            ".advertisement",
            ".advert",
            ".ads",
            ".ad-container",

            ".social-share",
            ".share-buttons"
        ];

        unwantedSelectors.forEach((selector) => {
            let elements;

            try {
                elements = root.querySelectorAll(selector);
            } catch (error) {
                return;
            }

            elements.forEach((element) => {
                element.remove();
            });
        });
    }

    function isUsableElement(element) {
        if (!element) {
            return false;
        }

        if (element.closest("nav, footer")) {
            return false;
        }

        const style = window.getComputedStyle(element);

        if (
            style.display === "none" ||
            style.visibility === "hidden"
        ) {
            return false;
        }

        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            return false;
        }

        return true;
    }

    function getElementIdentity(element) {
        const parts = [];

        if (element.id) {
            parts.push(element.id);
        }

        if (typeof element.className === "string") {
            parts.push(element.className);
        }

        const ariaLabel = element.getAttribute("aria-label");

        if (ariaLabel) {
            parts.push(ariaLabel);
        }

        const role = element.getAttribute("role");

        if (role) {
            parts.push(role);
        }

        const testId =
            element.getAttribute("data-testid") ||
            element.getAttribute("data-test");

        if (testId) {
            parts.push(testId);
        }

        return parts.join(" ").toLowerCase();
    }

    function calculateIdentityRelevance(identity) {
        let score = 0;

        const strongPatterns = [
            "job-description",
            "job_description",
            "jobdescription",
            "job-details",
            "job_details",
            "jobdetails",
            "posting-description",
            "posting_description",
            "position-description",
            "position_description",
            "role-description",
            "role_description"
        ];

        const moderatePatterns = [
            "job-content",
            "job_content",
            "jobcontent",
            "job-posting",
            "job_posting",
            "jobposting",
            "vacancy-description",
            "vacancy_description",
            "position-details",
            "position_details"
        ];

        strongPatterns.forEach((pattern) => {
            if (identity.includes(pattern)) {
                score += 10;
            }
        });

        moderatePatterns.forEach((pattern) => {
            if (identity.includes(pattern)) {
                score += 5;
            }
        });

        /*
         * Penalize containers whose identity suggests that they
         * contain job recommendations/lists rather than the
         * currently selected description.
         */

        const negativePatterns = [
            "recommend",
            "similar-job",
            "similar_job",
            "job-list",
            "job_list",
            "joblist",
            "search-result",
            "search_result",
            "jobs-search",
            "jobs_search"
        ];

        negativePatterns.forEach((pattern) => {
            if (identity.includes(pattern)) {
                score -= 10;
            }
        });

        return score;
    }

    function calculateTextRelevance(text) {
        const normalized = text.toLowerCase();

        let score = 0;

        const signals = [
            {
                terms: [
                    "about the job",
                    "job description",
                    "role overview",
                    "position overview"
                ],
                points: 5
            },
            {
                terms: [
                    "responsibilities",
                    "key responsibilities",
                    "what you'll do",
                    "what you will do",
                    "your responsibilities"
                ],
                points: 4
            },
            {
                terms: [
                    "requirements",
                    "qualifications",
                    "experience required",
                    "skills required",
                    "what we're looking for",
                    "what we are looking for"
                ],
                points: 4
            },
            {
                terms: [
                    "salary",
                    "compensation",
                    "pay range",
                    "benefits"
                ],
                points: 2
            },
            {
                terms: [
                    "apply",
                    "application",
                    "candidate",
                    "employment"
                ],
                points: 1
            }
        ];

        signals.forEach((signal) => {
            signal.terms.forEach((term) => {
                if (normalized.includes(term)) {
                    score += signal.points;
                }
            });
        });

        return score;
    }

    function scoreUsefulLength(length) {
        /*
         * Reward substantial content up to a reasonable point.
         *
         * Extremely large containers should not automatically win
         * simply because they contain the rest of the webpage.
         */

        if (length < MIN_TEXT_LENGTH) {
            return 0;
        }

        if (length <= 15000) {
            return length;
        }

        if (length <= 30000) {
            return 15000 - ((length - 15000) * 0.25);
        }

        return 11250 - ((length - 30000) * 0.5);
    }

    function cleanText(text) {
        return String(text || "")
            .replace(/\r/g, "")
            .replace(/\t/g, " ")
            .replace(/\u00A0/g, " ")
            .replace(/[ ]{2,}/g, " ")
            .replace(/ *\n */g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function limitText(text) {
        const cleaned = cleanText(text);

        if (cleaned.length <= MAX_TEXT_LENGTH) {
            return cleaned;
        }

        return cleaned.substring(0, MAX_TEXT_LENGTH).trim();
    }
})();
