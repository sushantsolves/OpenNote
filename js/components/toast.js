// OpenNote — Toast Component

const toastContainer =
    document.createElement("div");

toastContainer.className =
    "toast-container";

document.body.appendChild(
    toastContainer
);


/* =========================================
   SHOW TOAST
========================================= */

export function showToast(
    message,
    type = "info",
    duration = 3000
) {

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    toastContainer.appendChild(
        toast
    );


    /* Remove toast */

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform =
            "translateY(8px)";

        toast.style.transition =
            "opacity 0.2s ease, transform 0.2s ease";

        setTimeout(() => {

            toast.remove();

        }, 200);

    }, duration);
}