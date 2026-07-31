document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".container");

    document
        .getElementById("pasteJob")
        .addEventListener("click", showPasteScreen);

    document
        .getElementById("scanCurrentPage")
        .addEventListener("click", () => {

            alert("Current Page Scan will be available soon.");

        });

    function showPasteScreen() {

        container.innerHTML = `

            <header class="header">
                <h1>Paste Job Offer</h1>
                <p class="brand">Fake Job Shield</p>
            </header>

            <section class="intro">

                <p>

                    Paste a job listing, recruiter message,
                    internship offer, freelance opportunity,
                    or work-from-home offer below.

                </p>

                <textarea
                    id="jobText"
                    placeholder="Paste the complete job listing or recruiter message here..."
                ></textarea>

            </section>

            <section class="actions">

                <button id="analyzeJob">
                    Analyze Job Offer
                </button>

                <button id="goHome" class="secondary">
                    ← Back
                </button>

            </section>

        `;

        document
            .getElementById("goHome")
            .onclick = () => location.reload();

        document
            .getElementById("analyzeJob")
            .onclick = () => {

                const text = document
                    .getElementById("jobText")
                    .value
                    .trim();

                if (text.length < 50) {

                    alert(
                        "Please paste a complete job listing before analyzing."
                    );

                    return;

                }

                showLoadingScreen(text);

            };

    }

    function showLoadingScreen(jobText) {

        container.innerHTML = `

            <header class="header">

                <h1>Analyzing...</h1>

                <p class="brand">
                    Fake Job Shield
                </p>

            </header>

            <section class="intro">

                <p>Checking for potential warning signs...</p>

                <br>

                <ul class="loading-list">

                    <li>✔ Payment requests</li>
                    <li>✔ Unrealistic salary</li>
                    <li>✔ Recruiter patterns</li>
                    <li>✔ Communication methods</li>
                    <li>✔ Sensitive information requests</li>

                </ul>

            </section>

        `;

        setTimeout(() => {

            const result = analyzeJob(jobText);

            showResultScreen(result);

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

                <h2>${result.score}/100</h2>

                <p>

                    <strong>${result.level}</strong>

                </p>

                <p>

                    ${result.warningCount} warning sign(s) detected.

                </p>

            </section>

            <section class="actions">

                <button id="viewAnalysis">

                    View Full Analysis

                </button>

                <button id="analyzeAnother" class="secondary">

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

                location.reload();

            };

    }

    function showFullAnalysis(result) {

        let findingsHTML = "";

        if (result.findings.length === 0) {

            findingsHTML = `

                <p>

                    No significant warning signs were detected.

                </p>

            `;

        } else {

            result.findings.forEach(finding => {

                findingsHTML += `

                    <div class="finding">

                        <h3>${finding.title}</h3>

                        <p>${finding.explanation}</p>

                        <small>

                            Severity:
                            ${finding.severity}

                            (+${finding.points})

                        </small>

                    </div>

                `;

            });

        }

        container.innerHTML = `

            <header class="header">

                <h1>Full Analysis</h1>

                <p class="brand">

                    Fake Job Shield

                </p>

            </header>

            <section class="intro">

                ${findingsHTML}

            </section>

            <section class="privacy">

                <h3>Important</h3>

                <p>

                    Fake Job Shield identifies potential warning signs based on explainable rules. A high score does not prove a job offer is fraudulent, and a low score does not guarantee it is legitimate. Always verify recruiters, employers, and payment requests independently before making decisions.

                </p>

            </section>

            <section class="actions">

                <button id="backToResults">

                    ← Back

                </button>

            </section>

        `;

        document
            .getElementById("backToResults")
            .onclick = () => {

                showResultScreen(result);

            };

    }

});
