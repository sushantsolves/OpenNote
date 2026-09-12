// OpenNote — Loader Component

const loader =
    document.createElement("div");

loader.className =
    "app-loader hidden";

loader.innerHTML = `
    <div
        class="loader-spinner"
        aria-label="Loading"
    ></div>
`;

document.body.appendChild(loader);


/* =========================================
   SHOW LOADER
========================================= */

export function showLoader() {
    loader.classList.remove("hidden");
}


/* =========================================
   HIDE LOADER
========================================= */

export function hideLoader() {
    loader.classList.add("hidden");
}