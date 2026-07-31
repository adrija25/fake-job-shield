document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".container");

    document.getElementById("pasteJob").addEventListener("click", showPasteScreen);

    document.getElementById("scanCurrentPage").addEventListener("click", () => {

        alert("Current Page Scan will be added next.");

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
                    internship offer or work-from-home
                    opportunity below.

                </p>

                <textarea
                    id="jobText"
                    placeholder="Paste the job description or recruiter message here..."
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

                alert("Risk analysis screen coming next.");

            });

    }

});
