// OpenNote — Main Application Entry Point

import {
    observeAuthState,
    signIn,
    signUp
} from "./firebase/auth.js";

import { getAuthMode } from "./auth/auth-ui.js";

// IMPORTANT:
// Load the dashboard controller so all dashboard
// buttons, folders, notes and logout functionality work.
import "./dashboard/dashboard-ui.js";


const authForm =
    document.getElementById("auth-form");

const authSubmit =
    document.getElementById("auth-submit");

const authMessage =
    document.getElementById("auth-message");


/* ================================
   AUTHENTICATION FORM
================================ */

if (authForm) {
    authForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const mode =
                getAuthMode();


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            if (
                mode === "signup" &&
                password.length < 6
            ) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            setLoading(true);
            clearMessage();


            try {

                const result =
                    mode === "signin"
                        ? await signIn(
                            email,
                            password
                        )
                        : await signUp(
                            email,
                            password
                        );


                if (result.success) {

                    showMessage(
                        mode === "signin"
                            ? "Signed in successfully."
                            : "Account created successfully!",
                        "success"
                    );

                } else {

                    showMessage(
                        getAuthErrorMessage(
                            result.error
                        ),
                        "error"
                    );
                }


            } catch (error) {

                console.error(
                    "Authentication error:",
                    error
                );

                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

            } finally {

                setLoading(false);
            }
        }
    );
}


/* ================================
   LOADING STATE
================================ */

function setLoading(isLoading) {

    if (!authSubmit) return;


    authSubmit.disabled =
        isLoading;


    const mode =
        getAuthMode();


    authSubmit.textContent =
        isLoading
            ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
            : mode === "signin"
                ? "Sign In"
                : "Sign Up";
}


/* ================================
   AUTH MESSAGE
================================ */

function showMessage(
    message,
    type
) {

    if (!authMessage) return;


    authMessage.textContent =
        message;

    authMessage.className =
        `auth-message ${type}`;
}


function clearMessage() {

    if (!authMessage) return;


    authMessage.textContent =
        "";

    authMessage.className =
        "auth-message";
}


/* ================================
   FIREBASE ERROR MESSAGES
================================ */

function getAuthErrorMessage(error) {

    switch (error?.code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/email-already-in-use":
            return "An account already exists with this email.";

        case "auth/weak-password":
            return "Password is too weak. Use at least 6 characters.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        default:

            console.error(
                "Firebase error:",
                error
            );

            return (
                error?.message ||
                "Something went wrong. Please try again."
            );
    }
}


/* ================================
   AUTH STATE
================================ */

observeAuthState((user) => {

    const authPage =
        document.getElementById("auth-page");

    const dashboard =
        document.getElementById("dashboard");


    if (!authPage || !dashboard) {
        return;
    }


    if (user) {

        authPage.classList.add(
            "hidden"
        );

        dashboard.classList.remove(
            "hidden"
        );

    } else {

        authPage.classList.remove(
            "hidden"
        );

        dashboard.classList.add(
            "hidden"
        );
    }
});