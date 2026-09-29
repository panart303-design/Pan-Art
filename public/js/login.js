// ========================================
// LOGIN FORM
// ========================================

const loginForm =
document.getElementById("loginForm");

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const togglePassword =
document.getElementById("togglePassword");

const loginButton =
document.getElementById("loginButton");

const message =
document.getElementById("message");

// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(text, type) {

message.textContent = text;

message.className =
    `message show ${type}`;

}

// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

message.textContent = "";

message.className =
    "message";

}

// ========================================
// TOGGLE PASSWORD
// ========================================

togglePassword.addEventListener(
"click",
() => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent =
            "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent =
            "Show";

    }

}

);

// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
"submit",
async (event) => {

    event.preventDefault();

    hideMessage();

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;

    }

    // ========================================
    // DISABLE BUTTON
    // ========================================

    loginButton.disabled = true;

    loginButton.textContent =
        "Logging in...";

    try {

        // ========================================
        // SEND LOGIN REQUEST
        // ========================================

        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        // ========================================
        // LOGIN FAILED
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            showMessage(
                data.message ||
                "Unable to login. Please try again.",
                "error"
            );

            return;

        }

        // ========================================
        // LOGIN SUCCESSFUL
        // ========================================

        showMessage(
            "Login successful. Welcome to Pan Art!",
            "success"
        );

        // ========================================
        // REDIRECT
        // ========================================

        setTimeout(
            () => {

                window.location.href =
                    "artwork.html";

            },
            800
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showMessage(
            "Unable to connect to the server. Please try again.",
            "error"
        );

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Login";

    }

}

);