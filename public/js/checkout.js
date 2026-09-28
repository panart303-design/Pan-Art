/*
PAN ART - CHECKOUT PAGE JAVASCRIPT

*/

// ========================================
// DOM ELEMENTS
// ========================================

const checkoutItems =
document.getElementById("checkoutItems");

const checkoutItemCount =
document.getElementById("checkoutItemCount");

const checkoutTotal =
document.getElementById("checkoutTotal");

const emptyCheckout =
document.getElementById("emptyCheckout");

const checkoutContent =
document.querySelector(".checkout-content");

const payBtn =
document.getElementById("payBtn");

const backToCartBtn =
document.getElementById("backToCartBtn");

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
// DISPLAY CHECKOUT
// ========================================

function displayCheckout() {

const cart = getCart();


/*
If the cart is empty,
show the empty checkout message.
*/

if (cart.length === 0) {

    checkoutContent.classList.add(
        "hidden"
    );

    emptyCheckout.classList.remove(
        "hidden"
    );

    checkoutItemCount.textContent =
        "0";

    checkoutTotal.textContent =
        formatPrice(0);

    return;

}


/*
Cart contains artwork,
so show the checkout content.
*/

checkoutContent.classList.remove(
    "hidden"
);

emptyCheckout.classList.add(
    "hidden"
);


checkoutItems.innerHTML = "";


let total = 0;


// ====================================
// DISPLAY EACH ARTWORK
// ====================================

cart.forEach(
    (artwork) => {

        const price =
            Number(artwork.price) || 0;


        total += price;


        const item =
            document.createElement("div");


        item.className =
            "checkout-item";


        item.innerHTML = `

            <img
                src="${escapeHTML(artwork.image)}"
                alt="${escapeHTML(artwork.title)}"
                class="checkout-item-image"
            >


            <div class="checkout-item-details">

                <h3 class="checkout-item-title">
                    ${escapeHTML(artwork.title)}
                </h3>


                <p class="checkout-item-artist">
                    By ${escapeHTML(artwork.artist)}
                </p>


                <p class="checkout-item-price">
                    ${formatPrice(price)}
                </p>

            </div>

        `;


        checkoutItems.appendChild(
            item
        );

    }
);


// ====================================
// UPDATE SUMMARY
// ====================================

checkoutItemCount.textContent =
    cart.length;


checkoutTotal.textContent =
    formatPrice(total);

}

// ========================================
// PROCEED TO PAYMENT
// ========================================

if (payBtn) {

payBtn.addEventListener(
    "click",
    () => {

        const cart = getCart();


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        /*
        We will connect this button
        to the real payment system next.

        For now, it goes to the
        payment page.
        */

        window.location.href =
            "payment.html";

    }
);

}

// ========================================
// BACK TO CART
// ========================================

if (backToCartBtn) {

backToCartBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "cart.html";

    }
);

}

// ========================================
// LOAD CHECKOUT
// ========================================

displayCheckout();