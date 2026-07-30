document.addEventListener("DOMContentLoaded", () => {

    const scanButton = document.getElementById("scanCurrentPage");
    const pasteButton = document.getElementById("pasteJob");
    const resultBox = document.getElementById("result");

    scanButton.addEventListener("click", () => {

        resultBox.classList.remove("hidden");

        resultBox.innerHTML = `
            <strong>Coming Soon</strong><br><br>
            Current page scanning will be added in the next phase.
        `;

    });

    pasteButton.addEventListener("click", () => {

        resultBox.classList.remove("hidden");

        resultBox.innerHTML = `
            <strong>Coming Soon</strong><br><br>
            Paste & Check mode will be added in the next phase.
        `;

    });

});
