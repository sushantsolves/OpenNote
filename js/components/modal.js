// OpenNote — Modal Component

const modal =
    document.createElement("div");

modal.className = "app-modal hidden";

modal.innerHTML = `
    <div class="modal-backdrop"></div>

    <div
        class="modal-container"
        role="dialog"
        aria-modal="true"
    >

        <div class="modal-header">

            <h3
                class="modal-title"
                id="modal-title"
            >
                OpenNote
            </h3>

            <button
                type="button"
                class="modal-close"
                id="modal-close"
                aria-label="Close modal"
            >
                ×
            </button>

        </div>

        <div
            class="modal-content"
            id="modal-content"
        ></div>

        <div
            class="modal-actions"
            id="modal-actions"
        ></div>

    </div>
`;

document.body.appendChild(modal);


/* =========================================
   ELEMENTS
========================================= */

const modalTitle =
    document.getElementById("modal-title");

const modalContent =
    document.getElementById("modal-content");

const modalActions =
    document.getElementById("modal-actions");

const closeButton =
    document.getElementById("modal-close");

const backdrop =
    modal.querySelector(
        ".modal-backdrop"
    );


/* =========================================
   OPEN MODAL
========================================= */

export function openModal({
    title = "OpenNote",
    content = "",
    actions = []
} = {}) {

    modalTitle.textContent =
        title;

    if (typeof content === "string") {

        modalContent.innerHTML =
            content;

    } else {

        modalContent.innerHTML =
            "";

        modalContent.appendChild(
            content
        );
    }

    modalActions.innerHTML =
        "";

    actions.forEach((action) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent =
            action.label;

        button.className =
            `modal-action ${
                action.variant ||
                "secondary"
            }`;

        button.addEventListener(
            "click",
            () => {

                action.onClick?.();

            }
        );

        modalActions.appendChild(
            button
        );
    });

    modal.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "modal-open"
    );

    requestAnimationFrame(() => {

        modal.classList.add(
            "visible"
        );
    });
}


/* =========================================
   CLOSE MODAL
========================================= */

export function closeModal() {

    modal.classList.remove(
        "visible"
    );

    document.body.classList.remove(
        "modal-open"
    );

    setTimeout(() => {

        modal.classList.add(
            "hidden"
        );

    }, 180);
}


/* =========================================
   EVENTS
========================================= */

closeButton.addEventListener(
    "click",
    closeModal
);

backdrop.addEventListener(
    "click",
    closeModal
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {

            closeModal();
        }
    }
);