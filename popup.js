document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".container");

    document
        .getElementById("pasteJob")
        .addEventListener("click", showPasteScreen);

    document
        .getElementById("scanCurrentPage")
        .addEventListener("click", () => {

            alert("Current Page Scan will be added soon.");

        });

    function showPasteScreen() {

        container.innerHTML = `

            <header class="header">

                <h1>Paste Job Offer</h1>

                <p class="brand">
                    Fake Job Shield
                </p>

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
            .addEventListener("click", () => {

                location.reload();

            });

        document
            .getElementById("analyzeJob")
            .addEventListener("click", () => {

                const text = document
                    .getElementById("jobText")
                    .value
                    .trim();

                if (text.length < 50) {

                    alert(
                        "Please paste a complete job listing or recruiter message before analyzing."
                    );

                    return;

                }

                showLoadingScreen(text);

            });

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

                <p>

                    Checking for recruitment scam warning signs...

                </p>

                <br>

                <ul class="loading-list">

                    <li>✔ Checking payment requests</li>

                    <li>✔ Checking salary claims</li>

                    <li>✔ Checking recruiter behaviour</li>

                    <li>✔ Checking communication methods</li>

                    <li>✔ Checking sensitive information requests</li>

                </ul>

            </section>

        `;

        setTimeout(() => {

            /*
                Temporary placeholder.
                Next step will connect analyzer.js
            */

            showResultScreen();

        }, 1800);

    }

    function showResultScreen() {

        container.innerHTML = `

            <header class="header">

                <h1>Analysis Complete</h1>

                <p class="brand">

                    Fake Job Shield

                </p>

            </header>

            <section class="intro">

                <h2>Risk Summary</h2>

                <p>

                    Your analysis has completed successfully.

                </p>

                <p>

                    The real explainable risk score will appear here
                    after we connect the analysis engine.

                </p>

            </section>

            <section class="actions">

                <button id="goHomeAgain">

                    Analyze Another Job

                </button>

            </section>

        `;

        document
            .getElementById("goHomeAgain")
            .addEventListener("click", () => {

                location.reload();

            });

    }

});
