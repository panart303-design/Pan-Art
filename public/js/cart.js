// ========================================
// PAN ART - CART
// ========================================

// ========================================
// ELEMENTS
// ========================================

const emptyCart =
document.getElementById("emptyCart");

const cartContent =
document.getElementById("cartContent");

const cartItems =
document.getElementById("cartItems");

const itemCount =
document.getElementById("itemCount");

const cartTotal =
document.getElementById("cartTotal");

const checkoutBtn =
document.getElementById("checkoutBtn");

const logoutBtn =
document.getElementById("logoutBtn");

// ========================================
// LOAD CART
// ========================================

function getCart() {

try {

    const savedCart =
        localStorage.getItem("panArtCart");

    if (!savedCart) {
        return [];
    }

    return JSON.parse(savedCart);

} catch (error) {

    console.error(
        "Unable to load cart:",
        error
    );

    return [];

}

}

// ========================================
// SAVE CART
// ========================================

function saveCart(cart) {

localStorage.setItem(
    "panArtCart",
    JSON.stringify(cart)
);

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
        maximumFractionDigits: 0
    }
).format(price);

}

// ========================================
// DISPLAY CART
// ========================================

function displayCart() {

const cart = getCart();


cartItems.innerHTML = "";


// ========================================
// EMPTY CART
// ========================================

if (cart.length === 0) {

    emptyCart.classList.remove("hidden");

    cartContent.classList.add("hidden");

    itemCount.textContent = "0";

    cartTotal.textContent = "₦0";

    return;

}


// ========================================
// SHOW CART
// ========================================

emptyCart.classList.add("hidden");

cartContent.classList.remove("hidden");


let total = 0;


cart.forEach((artwork, index) => {

    total += Number(artwork.price);


    const item =
        document.createElement("div");

    item.className = "cart-item";


    item.innerHTML = `

        <img
            src="${artwork.image}"
            alt="${artwork.title}"
            class="cart-item-image"
        >

        <div class="cart-item-details">

            <h3>
                ${artwork.title}
            </h3>

            <p>
                Artist: ${artwork.artist}
            </p>

            <div class="cart-item-price">
                ${formatPrice(artwork.price)}
            </div>

            <button
                type="button"
                class="remove-btn"
                data-index="${index}"
            >
                Remove
            </button>

        </div>

    `;


    cartItems.appendChild(item);

});


// ========================================
// SUMMARY
// ========================================

itemCount.textContent =
    cart.length;

cartTotal.textContent =
    formatPrice(total);


// ========================================
// REMOVE BUTTONS
// ========================================

const removeButtons =
    document.querySelectorAll(".remove-btn");


removeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const index =
                Number(
                    button.dataset.index
                );


            const cart =
                getCart();


            cart.splice(index, 1);


            saveCart(cart);


            displayCart();

        }
    );

});

}

// ========================================
// CHECKOUT
// ========================================

checkoutBtn.addEventListener(
"click",
() => {

    const cart =
        getCart();


    if (cart.length === 0) {

        return;

    }


    window.location.href =
        "checkout.html";

}

);

// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
"click",
async () => {

    try {

        await fetch(
            "/api/auth/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    localStorage.removeItem(
        "panArtCart"
    );


    window.location.href =
        "login.html";

}

);

// ========================================
// START
// ========================================

displayCart();