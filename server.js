const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const adminArtworkRoutes = require("./routes/adminArtworkRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const requireAdmin = require("./middleware/adminMiddleware");
const requireLogin = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// SESSION
// ========================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);


// ========================================
// PUBLIC CUSTOMER ASSETS
// ========================================

app.use(
    "/css",
    express.static(
        path.join(__dirname, "public/css")
    )
);

app.use(
    "/js",
    express.static(
        path.join(__dirname, "public/js")
    )
);

app.use(
    "/images",
    express.static(
        path.join(__dirname, "public/images")
    )
);


// ========================================
// ARTWORK UPLOAD IMAGES
// ========================================

// Files inside:
//
// uploads/artworks/
//
// are accessible through:
//
// /uploads/artworks/filename.jpg

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ========================================
// ADMIN CSS
// ========================================

// Files inside:
//
// Admin-public/css/
//
// are accessible through:
//
// /admin-css/filename.css

app.use(
    "/admin-css",
    express.static(
        path.join(__dirname, "Admin-public/css")
    )
);


// ========================================
// ADMIN JAVASCRIPT
// ========================================

// Files inside:
//
// Admin-public/Js/
//
// are accessible through:
//
// /admin-js/filename.js

app.use(
    "/admin-js",
    express.static(
        path.join(__dirname, "Admin-public/Js")
    )
);


// ========================================
// PUBLIC CUSTOMER PAGES
// ========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public/index.html"
        )
    );

});


app.get("/index.html", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public/index.html"
        )
    );

});


app.get("/login.html", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public/login.html"
        )
    );

});


app.get("/register.html", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public/register.html"
        )
    );

});


// ========================================
// ADMIN LOGIN PAGE
// ========================================

// Admin login must remain public because
// the administrator needs this page before
// creating an admin session.

app.get(
    "/admin-login.html",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "Admin-public/admin-login.html"
            )
        );

    }
);


// ========================================
// PROTECTED ADMIN DASHBOARD
// ========================================

app.get(
    "/admin-dashboard.html",
    requireAdmin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "Admin-public/admin-dashboard.html"
            )
        );

    }
);


// ========================================
// PROTECTED ADMIN UPLOAD PAGE
// ========================================

app.get(
    "/admin-upload.html",
    requireAdmin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "Admin-public/admin-upload.html"
            )
        );

    }
);


// ========================================
// PROTECTED CUSTOMER PAGES
// ========================================

// ARTWORK PAGE

app.get(
    "/artwork.html",
    requireLogin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public/artwork.html"
            )
        );

    }
);


// CART PAGE

app.get(
    "/cart.html",
    requireLogin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public/cart.html"
            )
        );

    }
);


// CHECKOUT PAGE

app.get(
    "/checkout.html",
    requireLogin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public/checkout.html"
            )
        );

    }
);


// PAYMENT PAGE

// The payment page is protected because
// only a logged-in customer should be able
// to proceed to payment.

app.get(
    "/payment.html",
    requireLogin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public/payment.html"
            )
        );

    }
);


// ========================================
// AUTH API
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// ARTWORK API
// ========================================

app.use(
    "/api/artworks",
    artworkRoutes
);


// ========================================
// ORDER + PAYMENT API
// ========================================

// Order and payment functionality stays
// inside orderRoutes.js.
//
// Example endpoints will be:
//
// POST /api/orders
// GET  /api/orders/my-orders
// POST /api/orders/payment
//
// The actual payment endpoint will also use
// requireLogin inside orderRoutes.js.

app.use(
    "/api/orders",
    orderRoutes
);


// ========================================
// ADMIN API
// ========================================

app.use(
    "/api/admin",
    adminRoutes
);


// ========================================
// ADMIN ARTWORK API
// ========================================

// Upload endpoint:
//
// POST /api/admin/artworks/upload

app.use(
    "/api/admin/artworks",
    adminArtworkRoutes
);


// ========================================
// 404
// ========================================

app.use((req, res) => {

    res.status(404).send(
        "Page not found."
    );

});


// ========================================
// DATABASE
// ========================================

mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully."
        );


        app.listen(
            PORT,"0.0.0.0",
            () => {

                console.log(
                    `Pan Art is running at http://localhost:${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });