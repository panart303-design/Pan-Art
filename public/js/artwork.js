/*
PAN ART - ARTWORK PAGE JAVASCRIPT

*/

const artworkGrid = document.getElementById("artworkGrid");
const loadingMessage = document.getElementById("loadingMessage");
const emptyMessage = document.getElementById("emptyMessage");
const categoryFilter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");
const logoutBtn = document.getElementById("logoutBtn");

// ========================================
// CART STORAGE
// ========================================

function getCart() {

const savedCart = localStorage.getItem("panArtCart");

if (!savedCart) {
    return [];
}

try {

    const cart = JSON.parse(savedCart);

    return Array.isArray(cart) ? cart : [];

} catch (error) {

    console.error(
        "Could not read cart:",
        error
    );

    return [];
}

}

function saveCart(cart) {

localStorage.setItem(
    "panArtCart",
    JSON.stringify(cart)
);

}

// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

const cart = getCart();

cartCount.textContent = cart.length;

}

// ========================================
// LOAD CURRENT USER
// ========================================

async function loadCurrentUser() {

try {

    const response = await fetch(
        "/api/auth/me",
        {
            method: "GET",
            credentials: "include"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        window.location.href = "login.html";

        return null;
    }


    console.log(
        `Welcome ${data.user.fullName}`
    );


    return data.user;

} catch (error) {

    console.error(
        "Could not load current user:",
        error
    );

    window.location.href = "login.html";

    return null;
}

}

// ========================================
// LOAD ARTWORKS
// ========================================

async function loadArtworks(category = "all") {

loadingMessage.classList.remove("hidden");
emptyMessage.classList.add("hidden");


try {

    let url = "/api/artworks";


    if (category && category !== "all") {

        url += `?category=${encodeURIComponent(category)}`;

    }


    const response = await fetch(
        url,
        {
            method: "GET",
            credentials: "include"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message || "Failed to load artworks."
        );

    }


    artworkGrid.innerHTML = "";


    loadingMessage.classList.add("hidden");


    if (
        !data.artworks ||
        data.artworks.length === 0
    ) {

        emptyMessage.classList.remove("hidden");

        updateCartCount();

        return;
    }


    data.artworks.forEach(
        (artwork) => {

            const artworkCard =
                createArtworkCard(artwork);

            artworkGrid.appendChild(
                artworkCard
            );

        }
    );


    updateCartCount();

} catch (error) {

    console.error(
        "Error loading artworks:",
        error
    );


    loadingMessage.classList.add("hidden");


    artworkGrid.innerHTML = `
        <div class="loading-message">
            Unable to load artworks.
            Please refresh the page and try again.
        </div>
    `;

}

}

// ========================================
// CREATE ARTWORK CARD
// ========================================

function createArtworkCard(artwork) {

const card = document.createElement("article");

card.className = "artwork-card";


card.innerHTML = `

    <div class="artwork-image-container">

        <img
            src="${artwork.image}"
            alt="${escapeHTML(artwork.title)}"
            class="artwork-image"
        >

    </div>


    <div class="artwork-card-content">

        <p class="artwork-category">
            ${escapeHTML(artwork.category)}
        </p>


        <h3 class="artwork-title">
            ${escapeHTML(artwork.title)}
        </h3>


        <p class="artwork-artist">
            By ${escapeHTML(artwork.artist)}
        </p>


        <p class="artwork-price">
            ${formatPrice(artwork.price)}
        </p>


        <button
            type="button"
            class="add-to-cart-btn"
            data-artwork-id="${escapeHTML(artwork.id)}"
        >
            Add to Cart
        </button>

    </div>

`;


const addToCartButton =
    card.querySelector(".add-to-cart-btn");


addToCartButton.addEventListener(
    "click",
    () => {

        addToCart(artwork);

    }
);


return card;

}

// ========================================
// ADD ARTWORK TO CART
// ========================================

function addToCart(artwork) {

const cart = getCart();


/*
Check whether this artwork is already
inside the cart.
*/

const alreadyInCart = cart.some(
    (item) => item.id === artwork.id
);


if (alreadyInCart) {

    alert(
        "This artwork is already in your cart."
    );

    return;
}


/*
Store the artwork information needed
by the cart page.

The backend will still be responsible
for verifying the real price when an
order/payment is created.
*/

cart.push({

    id: artwork.id,

    title: artwork.title,

    artist: artwork.artist,

    category: artwork.category,

    price: Number(artwork.price),

    image: artwork.image

});


saveCart(cart);


updateCartCount();


alert(
    `"${artwork.title}" has been added to your cart.`
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
        minimumFractionDigits: 2
    }
).format(Number(price));

}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

const div = document.createElement("div");

div.textContent = value ?? "";

return div.innerHTML;

}

// ========================================
// CATEGORY FILTER
// ========================================

if (categoryFilter) {

categoryFilter.addEventListener(
    "change",
    () => {

        loadArtworks(
            categoryFilter.value
        );

    }
);

}

// ========================================
// LOGOUT
// ========================================

if (logoutBtn) {

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


            const data =
                await response.json();


            if (response.ok && data.success) {

                localStorage.removeItem(
                    "panArtCart"
                );

                window.location.href =
                    "login.html";

                return;
            }


            alert(
                data.message ||
                "Logout failed."
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Unable to logout. Please try again."
            );

        }

    }
);

}

// ========================================
// INITIALIZE ARTWORK PAGE
// ========================================

async function initializeArtworkPage() {

const user =
    await loadCurrentUser();


if (!user) {
    return;
}


updateCartCount();


await loadArtworks();

}

// ========================================
// START PAGE
// ========================================

initializeArtworkPage();