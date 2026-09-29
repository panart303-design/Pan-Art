Clean public/js/payment.js

/*
PAN ART - PAYMENT PAGE JAVASCRIPT
*/

// ========================================
// DOM ELEMENTS
// ========================================

const paymentItems =
document.getElementById("paymentItems");

const paymentItemCount =
document.getElementById("paymentItemCount");

const paymentTotal =
document.getElementById("paymentTotal");

const emptyPayment =
document.getElementById("emptyPayment");

const paymentContent =
document.querySelector(".payment-content");

const paymentBtn =
document.getElementById("paymentBtn");

const backToCheckoutBtn =
document.getElementById("backToCheckoutBtn");

// ========================================
// GET CART
// ========================================

function getCart() {

const savedCart =
    localStorage.getItem("panArtCart");

if (!savedCart) {

    return [];

}

try {

    const cart =
        JSON.parse(savedCart);

    return Array.isArray(cart)
        ? cart
        : [];

} catch (error) {

    console.error(
        "Could not read cart:",
        error
    );

    return [];

}

}

// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

return new Intl.NumberFormat(
    "en-NG",
    {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2
    }
).format(Number(price));

}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

const div =
    document.createElement("div");

div.textContent =
    value ?? "";

return div.innerHTML;

}

// ========================================
// DISPLAY PAYMENT ITEMS
// ========================================

function displayPayment() {

const cart =
    getCart();

// ========================================
// EMPTY CART
// ========================================

if (cart.length === 0) {

    paymentContent.classList.add(
        "hidden"
    );

    emptyPayment.classList.remove(
        "hidden"
    );

    paymentItemCount.textContent =
        "0";

    paymentTotal.textContent =
        formatPrice(0);

    return;

}

// ========================================
// SHOW PAYMENT CONTENT
// ========================================

paymentContent.classList.remove(
    "hidden"
);

emptyPayment.classList.add(
    "hidden"
);

paymentItems.innerHTML = "";

let total = 0;

// ========================================
// DISPLAY EACH ARTWORK
// ========================================

cart.forEach(
    (artwork) => {

        const price =
            Number(artwork.price) || 0;

        total += price;

        const item =
            document.createElement("div");

        item.className =
            "payment-item";

        item.innerHTML = `

            <img
                src="${escapeHTML(artwork.image)}"
                alt="${escapeHTML(artwork.title)}"
                class="payment-item-image"
            >

            <div class="payment-item-details">

                <h3 class="payment-item-title">
                    ${escapeHTML(artwork.title)}
                </h3>

                <p class="payment-item-artist">
                    By ${escapeHTML(artwork.artist)}
                </p>

                <p class="payment-item-price">
                    ${formatPrice(price)}
                </p>

            </div>

        `;

        paymentItems.appendChild(
            item
        );

    }
);

// ========================================
// UPDATE SUMMARY
// ========================================

paymentItemCount.textContent =
    cart.length;

paymentTotal.textContent =
    formatPrice(total);

}

// ========================================
// START PAYMENT
// ========================================
//
// Sends each artwork ID to the backend.
//
// IMPORTANT:
// We do NOT send the price.
//
// The backend gets the trusted price
// from data/artwork.js.
//
// Endpoint:
//
// POST /api/orders/payment
// ========================================

async function startPayment() {

const cart =
    getCart();

// ========================================
// CHECK CART
// ========================================

if (cart.length === 0) {

    alert(
        "Your cart is empty."
    );

    return;

}

// ========================================
// DISABLE BUTTON
// ========================================

paymentBtn.disabled = true;

paymentBtn.textContent =
    "Preparing Payment...";

try {

    // ========================================
    // CREATE PAYMENT ORDERS
    // ========================================

    const orders = [];

    for (const artwork of cart) {

        // Only the artwork ID is sent.
        // The backend determines the trusted price.

        if (!artwork.id) {

            throw new Error(
                "An artwork in your cart is missing its ID."
            );

        }

        const response =
            await fetch(
                "/api/orders/payment",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        artworkId:
                            artwork.id

                    })

                }
            );

        const data =
            await response.json();

        // ========================================
        // LOGIN CHECK
        // ========================================

        if (response.status === 401) {

            window.location.href =
                "login.html";

            return;

        }

        // ========================================
        // BACKEND ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to prepare payment."
            );

        }

        // ========================================
        // SAVE ORDER RESPONSE
        // ========================================

        orders.push(
            data.order
        );

    }

    // ========================================
    // PAYMENT PREPARED
    // ========================================

    console.log(
        "Payment orders prepared:",
        orders
    );

    /*
    Fonbnk will be opened/started here
    after the merchant account and actual
    Fonbnk configuration are connected.
    */

    alert(
        "Your payment has been prepared successfully. Fonbnk payment will be connected next."
    );

} catch (error) {

    console.error(
        "Payment error:",
        error
    );

    alert(
        error.message ||
        "Unable to start payment."
    );

} finally {

    // ========================================
    // RESTORE BUTTON
    // ========================================

    paymentBtn.disabled = false;

    paymentBtn.textContent =
        "Pay Now";

}

}

// ========================================
// PAY NOW
// ========================================

if (paymentBtn) {

paymentBtn.addEventListener(
    "click",
    startPayment
);

}

// ========================================
// BACK TO CHECKOUT
// ========================================

if (backToCheckoutBtn) {

backToCheckoutBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "checkout.html";

    }
);

}

// ========================================
// LOAD PAYMENT PAGE
// ========================================

displayPayment();