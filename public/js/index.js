document.addEventListener("DOMContentLoaded", () => {

// ========================================
// CUSTOMER SERVICE
// ========================================

const customerServiceLink = document.querySelector(
    ".customer-service a"
);

if (customerServiceLink) {

    customerServiceLink.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Thank you for contacting Pan Art. " +
            "Customer service will be available to assist you with " +
            "artwork, orders and your account."
        );

    });

}


// ========================================
// ARTWORK CARDS
// ========================================

const artworkCards = document.querySelectorAll(".art-card");

artworkCards.forEach((card) => {

    card.addEventListener("click", () => {

        const artworkTitle = card.querySelector("h3");

        if (artworkTitle) {

            console.log(
                "Selected artwork:",
                artworkTitle.textContent.trim()
            );

        }

    });

});


// ========================================
// SIGN UP BUTTONS
// ========================================

const signupLinks = document.querySelectorAll(
    'a[href="register.html"]'
);

signupLinks.forEach((link) => {

    link.addEventListener("click", () => {

        console.log("Opening Pan Art registration page.");

    });

});


// ========================================
// LOGIN BUTTONS
// ========================================

const loginLinks = document.querySelectorAll(
    'a[href="login.html"]'
);

loginLinks.forEach((link) => {

    link.addEventListener("click", () => {

        console.log("Opening Pan Art login page.");

    });

});


// ========================================
// PAGE LOADED
// ========================================

console.log("Pan Art homepage loaded successfully.");

});document.addEventListener("DOMContentLoaded", () => {

// ========================================
// CUSTOMER SERVICE
// ========================================

const customerServiceLink = document.querySelector(
    ".customer-service a"
);

if (customerServiceLink) {

    customerServiceLink.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Thank you for contacting Pan Art. " +
            "Customer service will be available to assist you with " +
            "artwork, orders and your account."
        );

    });

}


// ========================================
// ARTWORK CARDS
// ========================================

const artworkCards = document.querySelectorAll(".art-card");

artworkCards.forEach((card) => {

    card.addEventListener("click", () => {

        const artworkTitle = card.querySelector("h3");

        if (artworkTitle) {

            console.log(
                "Selected artwork:",
                artworkTitle.textContent.trim()
            );

        }

    });

});


// ========================================
// SIGN UP BUTTONS
// ========================================

const signupLinks = document.querySelectorAll(
    'a[href="register.html"]'
);

signupLinks.forEach((link) => {

    link.addEventListener("click", () => {

        console.log("Opening Pan Art registration page.");

    });

});


// ========================================
// LOGIN BUTTONS
// ========================================

const loginLinks = document.querySelectorAll(
    'a[href="login.html"]'
);

loginLinks.forEach((link) => {

    link.addEventListener("click", () => {

        console.log("Opening Pan Art login page.");

    });

});


// ========================================
// PAGE LOADED
// ========================================

console.log("Pan Art homepage loaded successfully.");

});