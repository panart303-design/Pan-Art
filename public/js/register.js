// ========================================
// PAN ART - REGISTER
// ========================================


// ========================================
// ELEMENTS
// ========================================

const registerForm =
    document.getElementById("registerForm");

const fullName =
    document.getElementById("fullName");

const email =
    document.getElementById("email");

const phone =
    document.getElementById("phone");

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const terms =
    document.getElementById("terms");

const message =
    document.getElementById("message");

const registerButton =
    document.getElementById("registerButton");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


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

    message.className = "message";

}


// ========================================
// TOGGLE PASSWORD
// ========================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        password.type = "password";

        togglePassword.textContent = "Show";

    }

});


// ========================================
// TOGGLE CONFIRM PASSWORD
// ========================================

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggleConfirmPassword.textContent = "Hide";

    } else {

        confirmPassword.type = "password";

        toggleConfirmPassword.textContent = "Show";

    }

});


// ========================================
// REGISTER
// ========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideMessage();


    // ========================================
    // GET FORM VALUES
    // ========================================

    const nameValue =
        fullName.value.trim();

    const emailValue =
        email.value.trim();

    const phoneValue =
        phone.value.trim();

    const passwordValue =
        password.value;

    const confirmPasswordValue =
        confirmPassword.value;


    // ========================================
    // VALIDATION
    // ========================================

    if (nameValue.length < 2) {

        showMessage(
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!emailValue) {

        showMessage(
            "Please enter your email address.",
            "error"
        );

        return;
    }


    if (!phoneValue) {

        showMessage(
            "Please enter your phone number.",
            "error"
        );

        return;
    }


    if (passwordValue.length < 8) {

        showMessage(
            "Password must be at least 8 characters long.",
            "error"
        );

        return;
    }


    if (passwordValue !== confirmPasswordValue) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    if (!terms.checked) {

        showMessage(
            "Please agree to the Terms and Conditions.",
            "error"
        );

        return;
    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    registerButton.disabled = true;

    registerButton.textContent =
        "Creating Account...";


    // ========================================
    // SEND REGISTRATION REQUEST
    // ========================================

    try {

        const response =
            await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        // IMPORTANT:
                        // Send the VALUES, not the HTML elements.

                        fullName: nameValue,

                        email: emailValue,

                        phone: phoneValue,

                        password: passwordValue,

                        confirmPassword:
                            confirmPasswordValue

                    })
                }
            );


        const data =
            await response.json();


        // ========================================
        // HANDLE ERROR
        // ========================================

        if (!response.ok || !data.success) {

            showMessage(
                data.message ||
                "Unable to create your account.",
                "error"
            );

            return;
        }


        // ========================================
        // SUCCESS
        // ========================================

        showMessage(
            data.message ||
            "Account created successfully.",
            "success"
        );


        registerForm.reset();


        // ========================================
        // REDIRECT TO LOGIN
        // ========================================

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showMessage(
            "Unable to connect to Pan Art. Please try again.",
            "error"
        );


    } finally {

        registerButton.disabled = false;

        registerButton.textContent =
            "Create Account";

    }

});