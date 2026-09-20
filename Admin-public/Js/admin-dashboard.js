const adminName =
document.getElementById("adminName");

const logoutBtn =
document.getElementById("logoutBtn");

const uploadArtworkBtn =
document.getElementById("uploadArtworkBtn");

const viewArtworksBtn =
document.getElementById("viewArtworksBtn");

const viewOrdersBtn =
document.getElementById("viewOrdersBtn");

const viewPaymentsBtn =
document.getElementById("viewPaymentsBtn");

const viewAllPaymentsBtn =
document.getElementById("viewAllPaymentsBtn");

const totalArtworks =
document.getElementById("totalArtworks");

const totalOrders =
document.getElementById("totalOrders");

const totalPayments =
document.getElementById("totalPayments");

const totalCustomers =
document.getElementById("totalCustomers");

const paymentsTableBody =
document.getElementById("paymentsTableBody");

// ========================================
// CHECK ADMIN LOGIN
// ========================================

async function checkAdminLogin() {

try {

    const response =
        await fetch(
            "/api/admin/me",
            {
                method: "GET",
                credentials: "include"
            }
        );


    const data =
        await response.json();


    if (
        !response.ok ||
        !data.success
    ) {

        window.location.href =
            "/admin-login.html";

        return false;

    }


    adminName.textContent =
        data.admin.fullName;


    return true;


} catch (error) {

    console.error(
        "Admin session error:",
        error
    );

    window.location.href =
        "/admin-login.html";

    return false;

}

}

// ========================================
// LOAD DASHBOARD DATA
// ========================================

async function loadDashboard() {

try {

    const response =
        await fetch(
            "/api/admin/dashboard",
            {
                method: "GET",
                credentials: "include"
            }
        );


    const data =
        await response.json();


    if (
        !response.ok ||
        !data.success
    ) {

        console.error(
            data.message
        );

        return;

    }


    const statistics =
        data.statistics;


    // Update summary cards
    totalArtworks.textContent =
        statistics.totalArtworks;


    totalOrders.textContent =
        statistics.totalOrders;


    totalCustomers.textContent =
        statistics.totalCustomers;


    totalPayments.textContent =
        formatCurrency(
            statistics.totalPayments
        );


    // Load recent payments
    displayRecentOrders(
        data.recentOrders
    );


} catch (error) {

    console.error(
        "Dashboard loading error:",
        error
    );

}

}

// ========================================
// DISPLAY RECENT ORDERS
// ========================================

function displayRecentOrders(orders) {

if (
    !orders ||
    orders.length === 0
) {

    paymentsTableBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty-state"
            >
                No orders or payments yet.
            </td>

        </tr>

    `;

    return;

}


paymentsTableBody.innerHTML =
    "";


orders.forEach(order => {

    const row =
        document.createElement("tr");


    const customerName =
        order.customer
            ? order.customer.fullName
            : "Unknown Customer";


    const amount =
        formatCurrency(
            order.amount
        );


    const date =
        formatDate(
            order.createdAt
        );


    row.innerHTML = `

        <td>
            ${escapeHTML(customerName)}
        </td>

        <td>
            ${escapeHTML(order.artworkTitle)}
        </td>

        <td>
            ${amount}
        </td>

        <td>
            <span class="status ${order.paymentStatus}">
                ${capitalize(order.paymentStatus)}
            </span>
        </td>

        <td>
            ${date}
        </td>

    `;


    paymentsTableBody.appendChild(row);

});

}

// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

return new Intl.NumberFormat(
    "en-NG",
    {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0
    }
).format(
    Number(amount) || 0
);

}

// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

if (!date) {

    return "-";

}


return new Date(date)
    .toLocaleDateString(
        "en-NG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}

// ========================================
// CAPITALIZE TEXT
// ========================================

function capitalize(text) {

if (!text) {

    return "";

}


return text.charAt(0).toUpperCase()
    + text.slice(1);

}

// ========================================
// PROTECT AGAINST HTML INJECTION
// ========================================

function escapeHTML(value) {

return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
"click",
async () => {

    try {

        await fetch(
            "/api/admin/logout",
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


    window.location.href =
        "/admin-login.html";

}

);

// ========================================
// QUICK ACTIONS
// ========================================

uploadArtworkBtn.addEventListener(
"click",
() => {

    window.location.href =
        "/admin-upload.html";

}

);

viewArtworksBtn.addEventListener(
"click",
() => {

    window.location.href =
        "/admin-upload.html";

}

);

viewOrdersBtn.addEventListener(
"click",
() => {

    window.location.href =
        "/admin-dashboard.html";

}

);

viewPaymentsBtn.addEventListener(
"click",
() => {

    window.location.href =
        "/admin-dashboard.html";

}

);

viewAllPaymentsBtn.addEventListener(
"click",
() => {

    window.location.href =
        "/admin-dashboard.html";

}

);

// ========================================
// START DASHBOARD
// ========================================

async function startDashboard() {

const loggedIn =
    await checkAdminLogin();


if (!loggedIn) {

    return;

}


await loadDashboard();

}

startDashboard();