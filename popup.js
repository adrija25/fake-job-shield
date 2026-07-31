document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");

    document
        .getElementById("pasteJob")
        .addEventListener("click", showPasteScreen);

    // UPDATED: Scan Current Page
    document
        .getElementById("scanCurrentPage")
        .addEventListener("click", () => {

            const scanButton = document.getElementById("scanCurrentPage");

            scanButton.disabled = true;
            scanButton.textContent = "Scanning...";

            chrome.runtime.sendMessage(
                {
                    action: "scanCurrentPage"
                },
                (response) => {

                    scanButton.disabled = false;
                    scanButton.textContent = "Scan Current Page";

                    if (chrome.runtime.lastError) {

                        showScanError(
                            "Unable to communicate with the extension."
                        );

                        return;
                    }

                    if (!response) {

                        showScanError(
                            "No response received from the page."
                        );

                        return;
                    }

                    if (!response.success) {

                        showScanError(
                            response.error ||
                            "Unable to extract job information from this page."
                        );

                        return;
                    }

                    if (
                        !response.text ||
                        response.text.trim().length < 50
                    ) {

                        showScanError(
                            "No readable job listing was found on this page. Try using Paste Job instead."
                        );

                        return;
                    }

                    showLoadingScreen(response.text);
                }
            );
        });

    function showScanError(message) {

        container.innerHTML = `
            <header class="header">
                <h1>Scan Failed</h1>
                <p class="brand">Fake Job Shield</p>
            </header>

            <section class="intro">

                <p>${escapeHTML(message)}</p>

            </section>

            <section class="actions">

                <button id="tryScanAgain">
                    Try Again
                </button>

                <button
                    id="goHome"
                    class="secondary"
                >
                    Home
                </button>

            </section>
        `;

        document
            .getElementById("tryScanAgain")
            .onclick = () => {

                location.reload();

            };

        document
            .getElementById("goHome")
            .onclick = () => {

                location.reload();

            };
    }

    function escapeHTML(value) {

        return String(value).replace(
            /[&<>"']/g,
            (character) => {

                const map = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "\"": "&quot;",
                    "'": "&#39;"

                };

                return map[character];

            }
        );
    }

    function showPasteScreen() {

        container.innerHTML = `
            <header class="header">
                <h1>Paste Job Offer</h1>
                <p class="brand">Fake Job Shield</p>
            </header>

            <section class="intro">

                <p>
                    Paste a job listing,
                    recruiter message,
                    internship offer,
                    freelance opportunity,
                    or work-from-home offer below.
                </p>

                <textarea
                    id="jobText"
                    placeholder="Paste the complete job listing or recruiter message here..."
                    maxlength="50000"
                    aria-label="Job offer text"
                ></textarea>

                <div
                    id="characterCounter"
                    style="
                        margin-top:8px;
                        font-size:12px;
                        opacity:.75;
                        text-align:right;
                    "
                >
                    0 characters
                </div>

                <div
                    id="validationMessage"
                    style="
                        display:none;
                        margin-top:12px;
                        padding:10px;
                        border-radius:8px;
                        background:#fff3cd;
                        color:#664d03;
                        font-size:13px;
                    "
                ></div>

            </section>

            <section class="actions">

                <button id="analyzeJob">
                    Analyze Job Offer
                </button>

                <button
                    id="goHome"
                    class="secondary"
                >
                    ← Back
                </button>

            </section>
        `;

        const textarea =
            document.getElementById("jobText");

        const counter =
            document.getElementById("characterCounter");

        const validation =
            document.getElementById("validationMessage");

        const analyzeButton =
            document.getElementById("analyzeJob");

        textarea.focus();

        textarea.addEventListener("input", () => {

            counter.textContent =
                `${textarea.value.length.toLocaleString()} characters`;

            validation.style.display = "none";

        });

        textarea.addEventListener("keydown", (event) => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key === "Enter"
            ) {

                analyzeButton.click();

            }

        });

        document
            .getElementById("goHome")
            .onclick = () => {

                location.reload();

            };

        analyzeButton.onclick = () => {

            const text =
                textarea.value.trim();

            if (text.length < 50) {

                validation.textContent =
                                        "Please paste a more complete job listing before analyzing.";

                validation.style.display = "block";

                textarea.focus();

                return;
            }

            analyzeButton.disabled = true;
            analyzeButton.textContent = "Analyzing...";

            showLoadingScreen(text);
        };
    }

    function showLoadingScreen(jobText) {

        container.innerHTML = `
            <header class="header">
                <h1>Analyzing...</h1>
                <p class="brand">Fake Job Shield</p>
            </header>

            <section class="intro">

                <p>
                    Checking for potential warning signs...
                </p>

                <br>

                <ul class="loading-list">
                    <li>✔ Extracting job details</li>
                    <li>✔ Payment requests</li>
                    <li>✔ Unrealistic salary</li>
                    <li>✔ Recruiter patterns</li>
                    <li>✔ Communication methods</li>
                    <li>✔ Sensitive information requests</li>
                </ul>

            </section>
        `;

        setTimeout(() => {

            try {

                const result = analyzeJob(jobText);

                showResultScreen(result);

            } catch (error) {

                console.error(error);

                container.innerHTML = `
                    <header class="header">
                        <h1>Analysis Error</h1>
                        <p class="brand">
                            Fake Job Shield
                        </p>
                    </header>

                    <section class="intro">

                        <p>
                            Analysis could not be completed.
                            Please try again.
                        </p>

                    </section>

                    <section class="actions">

                        <button id="retryAnalysis">
                            Try Again
                        </button>

                        <button
                            id="goHome"
                            class="secondary"
                        >
                            Home
                        </button>

                    </section>
                `;

                document
                    .getElementById("retryAnalysis")
                    .onclick = () => {

                        showPasteScreen();

                    };

                document
                    .getElementById("goHome")
                    .onclick = () => {

                        location.reload();

                    };
            }

        }, 1800);
    }

    function showResultScreen(result) {

        container.innerHTML = `
            <header class="header">
                <h1>Risk Summary</h1>
                <p class="brand">
                    Fake Job Shield
                </p>
            </header>

            <section class="intro">

                <h2>
                    ${escapeHTML(result.score)}/100
                </h2>

                <p>
                    <strong>
                        ${escapeHTML(result.level)}
                    </strong>
                </p>

                <p>
                    ${escapeHTML(result.warningCount)}
                    potential warning sign(s) detected.
                </p>

            </section>

            <section class="actions">

                <button id="viewAnalysis">
                    View Full Analysis
                </button>

                <button
                    id="analyzeAnother"
                    class="secondary"
                >
                    Analyze Another Job
                </button>

            </section>
        `;

        document
            .getElementById("viewAnalysis")
            .onclick = () => {

                showFullAnalysis(result);

            };

        document
            .getElementById("analyzeAnother")
            .onclick = () => {

                showPasteScreen();

            };
    }

    function showFullAnalysis(result) {

        let findingsHTML = "";

        if (
            !Array.isArray(result.findings) ||
            result.findings.length === 0
        ) {

            findingsHTML = `
                <p>
                    No significant warning signs were detected
                    based on the current explainable rules.
                </p>
            `;

        } else {

            result.findings.forEach((finding) => {

                findingsHTML += `
                    <div class="finding">

                        <h3>
                            ${escapeHTML(finding.title)}
                        </h3>

                        <p>
                            ${escapeHTML(finding.explanation)}
                        </p>

                        <small>

                            Severity:

                            ${escapeHTML(finding.severity)}

                            (+${escapeHTML(finding.points)})

                        </small>

                    </div>
                `;
            });
        }
                container.innerHTML = `
            <header class="header">
                <h1>Full Analysis</h1>
                <p class="brand">Fake Job Shield</p>
            </header>

            <section class="intro">

                ${findingsHTML}

            </section>

            <section class="privacy">

                <h3>Important</h3>

                <p>
                    Fake Job Shield identifies potential warning
                    signs using explainable rules.
                    The analysis does not determine whether
                    a job offer is genuine or fraudulent.

                    Always independently verify recruiters,
                    employers, interview processes,
                    payment requests and company information
                    before making decisions.
                </p>

            </section>

            <section class="actions">

                <button id="backToResults">
                    ← Back
                </button>

                <button
                    id="analyzeAnother"
                    class="secondary"
                >
                    Analyze Another
                </button>

            </section>
        `;

        document
            .getElementById("backToResults")
            .onclick = () => {

                showResultScreen(result);

            };

        document
            .getElementById("analyzeAnother")
            .onclick = () => {

                showPasteScreen();

            };
    }

});
