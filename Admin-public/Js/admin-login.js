const loginForm =
document.getElementById("adminLoginForm");

const loginButton =
document.getElementById("loginButton");

const message =
document.getElementById("message");

loginForm.addEventListener(
"submit",
async (event) => {

    event.preventDefault();

    message.textContent = "";
    message.className = "message";

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    try {

        const response =
            await fetch(
                "/api/admin/login",
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

        if (!response.ok || !data.success) {

            message.textContent =
                data.message ||
                "Invalid admin login.";

            message.className =
                "message error";

            return;
        }

        message.textContent =
            "Login successful.";

        message.className =
            "message success";

        window.location.href =
            "/admin-dashboard.html";

    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );

        message.textContent =
            "Unable to connect to the server.";

        message.className =
            "message error";

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Login";
    }
}

);