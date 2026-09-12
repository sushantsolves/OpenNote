// OpenNote — Authentication UI Controller

const signInTab = document.getElementById("sign-in-tab");
const signUpTab = document.getElementById("sign-up-tab");
const authSubmit = document.getElementById("auth-submit");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");

let currentMode = "signin";

function setMode(mode) {
    currentMode = mode;

    const isSignIn = mode === "signin";

    signInTab.classList.toggle("active", isSignIn);
    signUpTab.classList.toggle("active", !isSignIn);

    authSubmit.textContent = isSignIn
        ? "Sign In"
        : "Sign Up";

    passwordInput.value = "";

    const message = document.getElementById("auth-message");

    message.textContent = "";
    message.className = "auth-message";
}

signInTab.addEventListener("click", () => {
    setMode("signin");
});

signUpTab.addEventListener("click", () => {
    setMode("signup");
});

passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword
        ? "text"
        : "password";

    passwordToggle.textContent = isPassword
        ? "🙈"
        : "👁";

    passwordToggle.setAttribute(
        "aria-label",
        isPassword
            ? "Hide password"
            : "Show password"
    );
});

export function getAuthMode() {
    return currentMode;
}