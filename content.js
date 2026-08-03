(() => {
    "use strict";

    /**
     * Fake Job Shield
     * Content Script
     *
     * Extracts the most relevant readable job-related text
     * from the current page.
     *
     * Also verifies that the page reasonably appears to contain
     * an actual job listing before returning text for analysis.
     *
     * No risk analysis or scoring is performed here.
     */

    const MIN_TEXT_LENGTH = 100;
    const MAX_TEXT_LENGTH = 50000;

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (!request || request.action !== "extractJobText") {
                return;
            }

            try {
                const result = extractJobText();

                if (!result.success) {
                    sendResponse({
                        success: false,
                        error: result.error
                    });

                    return;
                }

                sendResponse({
                    success: true,
                    text: result.text
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
         * Stage 1:
         * Look for strong job-description containers.
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
             * Glassdoor / common layouts
             */
            ".jobDescriptionContent",
            ".job-description",
            "#job-description",

            /*
             * Common job-site attributes
             */
            "[data-testid='job-description']",
            "[data-test='job-description']",
            "[data-automation='jobDescription']",
            "[data-automation-id='jobPostingDescription']",
            "[itemprop='description']"
        ];

        const specificResult =
            findBestSpecificJobDescription(specificSelectors);

        /*
         * A sufficiently large, visible, explicit job-description
         * container is strong evidence that this is a job page.
         */
        if (specificResult) {
            return {
                success: true,
                text: limitText(specificResult)
            };
        }

        /*
         * Stage 2:
         * Look for semantic containers whose identifiers indicate
         * that they contain a job description.
         */

        const semanticResult = findSemanticJobDescription();

        if (semanticResult) {
            const validation =
                validateJobContent(semanticResult);

            if (validation.isJobContent) {
                return {
                    success: true,
                    text: limitText(semanticResult)
                };
            }
        }

        /*
         * Stage 3:
         * Try controlled article/main extraction.
         */

        const structuredResult =
            findStructuredPageContent();

        if (structuredResult) {
            const validation =
                validateJobContent(structuredResult);

            if (validation.isJobContent) {
                return {
                    success: true,
                    text: limitText(structuredResult)
                };
            }
        }

        /*
         * Stage 4:
         * Last-resort body extraction.
         *
         * Unlike the previous version, body text is NOT
         * automatically treated as a job listing.
         */

        const bodyText = extractBodyFallback();

        if (bodyText.length >= MIN_TEXT_LENGTH) {
            const validation =
                validateJobContent(bodyText);

            if (validation.isJobContent) {
                return {
                    success: true,
                    text: limitText(bodyText)
                };
            }
        }

        /*
         * If none of the extraction paths produced sufficiently
         * job-related content, refuse to assign a risk score.
         */

        return {
            success: false,
            error:
                "No job listing detected on this page. Open a job listing and try again, or use Paste Job / Recruiter Message."
        };
    }

    function findBestSpecificJobDescription(selectors) {
        const candidates = [];

        selectors.forEach((selector, selectorIndex) => {
            let elements;

            try {
                elements =
                    document.querySelectorAll(selector);
            } catch (error) {
                return;
            }

            elements.forEach((element) => {
                if (!isUsableElement(element)) {
                    return;
                }

                const text =
                    extractReadableText(element);

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

        const elements =
            document.querySelectorAll(
                "div, section, article"
            );

        elements.forEach((element) => {
            if (!isUsableElement(element)) {
                return;
            }

            const identity =
                getElementIdentity(element);

            if (!identity) {
                return;
            }

            const relevance =
                calculateIdentityRelevance(identity);

            if (relevance <= 0) {
                return;
            }

            const text =
                extractReadableText(element);

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

            return (
                scoreUsefulLength(b.length) -
                scoreUsefulLength(a.length)
            );
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
                elements =
                    document.querySelectorAll(selector);
            } catch (error) {
                return;
            }

            elements.forEach((element) => {
                if (!isUsableElement(element)) {
                    return;
                }

                const text =
                    extractReadableText(element);

                if (text.length < MIN_TEXT_LENGTH) {
                    return;
                }

                const jobRelevance =
                    calculateTextRelevance(text);

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
                return (
                    b.jobRelevance -
                    a.jobRelevance
                );
            }

            if (a.selectorIndex !== b.selectorIndex) {
                return (
                    a.selectorIndex -
                    b.selectorIndex
                );
            }

            return (
                scoreUsefulLength(b.length) -
                scoreUsefulLength(a.length)
            );
        });

        return candidates[0].text;
    }

    /*
     * JOB PAGE VALIDATION
     *
     * This prevents arbitrary webpages, search pages and
     * unrelated articles from receiving a Fake Job Shield
     * risk score.
     *
     * We deliberately require combinations of signals instead
     * of relying on a single word such as "job" or "apply".
     */

    function validateJobContent(text) {
        const normalized =
            normalizeForMatching(text);

        let score = 0;
        let strongSignalGroups = 0;

        /*
         * Group 1:
         * Explicit job-description language.
         */
        const descriptionSignals = [
            "job description",
            "about the job",
            "about this job",
            "about the role",
            "role overview",
            "position overview",
            "position description",
            "role description"
        ];

        if (
            containsAny(
                normalized,
                descriptionSignals
            )
        ) {
            score += 5;
            strongSignalGroups += 1;
        }

        /*
         * Group 2:
         * Responsibilities / duties.
         */
        const responsibilitySignals = [
            "responsibilities",
            "key responsibilities",
            "your responsibilities",
            "roles and responsibilities",
            "what you'll do",
            "what you will do",
            "job duties",
            "key duties",
            "your role"
        ];

        if (
            containsAny(
                normalized,
                responsibilitySignals
            )
        ) {
            score += 4;
            strongSignalGroups += 1;
        }

        /*
         * Group 3:
         * Requirements / qualifications.
         */
        const requirementSignals = [
            "requirements",
            "qualifications",
            "required qualifications",
            "minimum qualifications",
            "preferred qualifications",
            "skills required",
            "experience required",
            "what we're looking for",
            "what we are looking for",
            "ideal candidate",
            "candidate should"
        ];

        if (
            containsAny(
                normalized,
                requirementSignals
            )
        ) {
            score += 4;
            strongSignalGroups += 1;
        }

        /*
         * Group 4:
         * Hiring/application terminology.
         */
        const hiringSignals = [
            "we are hiring",
            "we're hiring",
            "hiring for",
            "apply now",
            "apply for this job",
            "submit your application",
            "application process",
            "successful candidate",
            "shortlisted candidates",
            "shortlisted applicants",
            "interview process",
            "employment opportunity",
            "job opportunity",
            "open position",
            "open role"
        ];

        if (
            containsAny(
                normalized,
                hiringSignals
            )
        ) {
            score += 4;
            strongSignalGroups += 1;
        }

        /*
         * Group 5:
         * Employment structure.
         */
        const employmentSignals = [
            "full-time",
            "full time",
            "part-time",
            "part time",
            "contract position",
            "contract role",
            "permanent position",
            "permanent role",
            "internship",
            "remote position",
            "remote role",
            "work location",
            "employment type"
        ];

        if (
            containsAny(
                normalized,
                employmentSignals
            )
        ) {
            score += 2;
        }

        /*
         * Group 6:
         * Compensation / benefits.
         */
        const compensationSignals = [
            "salary",
            "compensation",
            "pay range",
            "salary range",
            "annual salary",
            "monthly salary",
            "hourly rate",
            "benefits",
            "compensation package"
        ];

        if (
            containsAny(
                normalized,
                compensationSignals
            )
        ) {
            score += 2;
        }

        /*
         * Group 7:
         * Candidate/application vocabulary.
         *
         * Weak on its own, useful when combined with stronger
         * job-page signals.
         */
        const candidateSignals = [
            "candidate",
            "candidates",
            "applicant",
            "applicants",
            "recruiter",
            "recruitment",
            "application",
            "employment"
        ];

        if (
            containsAny(
                normalized,
                candidateSignals
            )
        ) {
            score += 1;
        }

        /*
         * Negative signals associated with pages that frequently
         * contain job-related words but are not themselves job
         * listings.
         */
        const negativeSignals = [
            "search results",
            "top job picks for you",
            "jobs recommended for you",
            "similar jobs",
            "people also search for",
            "related searches"
        ];

        let negativeScore = 0;

        negativeSignals.forEach((signal) => {
            if (normalized.includes(signal)) {
                negativeScore += 2;
            }
        });

        score -= Math.min(negativeScore, 4);

        /*
         * Validation rules:
         *
         * A page qualifies when it has:
         *
         * - at least two strong job-content groups
         *   with a reasonable total score,
         *
         * OR
         *
         * - one strong group plus enough supporting
         *   employment/hiring context.
         *
         * This is intentionally more conservative than simply
         * checking whether the page contains the word "job".
         */

        const isJobContent =
            (
                strongSignalGroups >= 2 &&
                score >= 6
            ) ||
            (
                strongSignalGroups >= 1 &&
                score >= 9
            );

        return {
            isJobContent,
            score,
            strongSignalGroups
        };
    }

    function containsAny(text, terms) {
        return terms.some((term) =>
            text.includes(term)
        );
    }

    function normalizeForMatching(text) {
        return String(text || "")
            .toLowerCase()
            .replace(/\u2019/g, "'")
            .replace(/\u2018/g, "'")
            .replace(/\u2013/g, "-")
            .replace(/\u2014/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function extractBodyFallback() {
        if (!document.body) {
            return "";
        }

        const clone =
            document.body.cloneNode(true);

        removeNonContentElements(clone);

        return cleanText(
            clone.innerText ||
            clone.textContent ||
            ""
        );
    }

    function extractReadableText(element) {
        if (!element) {
            return "";
        }

        /*
         * Never alter the live webpage.
         */
        const clone =
            element.cloneNode(true);

        removeNonContentElements(clone);

        return cleanText(
            clone.innerText ||
            clone.textContent ||
            ""
        );
    }

    function removeNonContentElements(root) {
        if (
            !root ||
            typeof root.querySelectorAll !== "function"
        ) {
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
                elements =
                    root.querySelectorAll(selector);
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

        const style =
            window.getComputedStyle(element);

        if (
            style.display === "none" ||
            style.visibility === "hidden"
        ) {
            return false;
        }

        const rect =
            element.getBoundingClientRect();

        if (
            rect.width === 0 ||
            rect.height === 0
        ) {
            return false;
        }

        return true;
    }

    function getElementIdentity(element) {
        const parts = [];

        if (element.id) {
            parts.push(element.id);
        }

        if (
            typeof element.className === "string"
        ) {
            parts.push(element.className);
        }

        const ariaLabel =
            element.getAttribute("aria-label");

        if (ariaLabel) {
            parts.push(ariaLabel);
        }

        const role =
            element.getAttribute("role");

        if (role) {
            parts.push(role);
        }

        const testId =
            element.getAttribute("data-testid") ||
            element.getAttribute("data-test");

        if (testId) {
            parts.push(testId);
        }

        return parts
            .join(" ")
            .toLowerCase();
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
        const normalized =
            normalizeForMatching(text);

        let score = 0;

        const signals = [
            {
                terms: [
                    "about the job",
                    "job description",
                    "about the role",
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
        if (length < MIN_TEXT_LENGTH) {
            return 0;
        }

        if (length <= 15000) {
            return length;
        }

        if (length <= 30000) {
            return (
                15000 -
                ((length - 15000) * 0.25)
            );
        }

        return (
            11250 -
            ((length - 30000) * 0.5)
        );
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
        const cleaned =
            cleanText(text);

        if (
            cleaned.length <=
            MAX_TEXT_LENGTH
        ) {
            return cleaned;
        }

        return cleaned
            .substring(0, MAX_TEXT_LENGTH)
            .trim();
    }
})();
