const express = require("express");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Order = require("../models/Order");
const User = require("../models/User");

const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// ======================================================
// ADMIN LOGIN
// ======================================================

router.post("/login", async (req, res) => {

try {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Please enter your email and password."

        });

    }

    const admin =
        await Admin.findOne({

            email:
                email.trim().toLowerCase()

        });

    if (!admin) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid email or password."

        });

    }

    const passwordMatch =
        await bcrypt.compare(
            password,
            admin.password
        );

    if (!passwordMatch) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid email or password."

        });

    }

    // Store admin information in the session.

    req.session.adminId =
        admin._id.toString();

    req.session.adminRole =
        admin.role;

    // Save the session before responding.

    req.session.save((error) => {

        if (error) {

            console.error(
                "Admin session save error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to create admin session."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Admin login successful.",

            admin: {

                id:
                    admin._id,

                fullName:
                    admin.fullName,

                email:
                    admin.email,

                role:
                    admin.role

            }

        });

    });

} catch (error) {

    console.error(
        "Admin login error:",
        error
    );

    return res.status(500).json({

        success: false,

        message:
            "Unable to login as admin."

    });

}

});

// ======================================================
// CHECK ADMIN SESSION
// ======================================================

router.get("/me", async (req, res) => {

try {

    if (!req.session.adminId) {

        return res.status(401).json({

            success: false,

            message:
                "Admin is not logged in."

        });

    }

    const admin =
        await Admin.findById(
            req.session.adminId
        ).select("-password");

    if (!admin) {

        req.session.adminId = null;
        req.session.adminRole = null;

        return res.status(401).json({

            success: false,

            message:
                "Admin session is no longer valid."

        });

    }

    return res.status(200).json({

        success: true,

        admin

    });

} catch (error) {

    console.error(
        "Admin session check error:",
        error
    );

    return res.status(500).json({

        success: false,

        message:
            "Unable to check admin session."

    });

}

});

// ======================================================
// ADMIN LOGOUT
// ======================================================

router.post("/logout", (req, res) => {

req.session.adminId = null;
req.session.adminRole = null;

return res.status(200).json({

    success: true,

    message:
        "Admin logged out successfully."

});

});

// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

router.get(
"/dashboard",
requireAdmin,
async (req, res) => {

    try {

        // ==========================================
        // LOAD ARTWORK CATALOG
        // ==========================================
        // Your actual artwork file is:
        //
        // data/artwork.js
        //
        // NOT data/artworks.js

        const artworksFile =
            require.resolve(
                "../data/artwork.js"
            );

        // Clear the cached version so newly
        // uploaded artworks are counted.

        delete require.cache[
            artworksFile
        ];

        const artworks =
            require(artworksFile);

        // ==========================================
        // TOTAL ARTWORKS
        // ==========================================

        const totalArtworks =
            artworks.length;

        // ==========================================
        // TOTAL ORDERS
        // ==========================================

        const totalOrders =
            await Order.countDocuments();

        // ==========================================
        // TOTAL CUSTOMERS
        // ==========================================

        const totalCustomers =
            await User.countDocuments();

        // ==========================================
        // TOTAL PAYMENTS
        // ==========================================

        const paidOrders =
            await Order.find({

                paymentStatus:
                    "paid"

            });

        let totalPayments = 0;

        paidOrders.forEach(order => {

            totalPayments +=
                Number(order.amount) || 0;

        });

        // ==========================================
        // RECENT ORDERS
        // ==========================================

        const recentOrders =
            await Order.find()
                .populate(
                    "customer",
                    "fullName email"
                )
                .sort({
                    createdAt: -1
                })
                .limit(10);

        // ==========================================
        // SEND DASHBOARD DATA
        // ==========================================

        return res.status(200).json({

            success: true,

            statistics: {

                totalArtworks,

                totalOrders,

                totalCustomers,

                totalPayments

            },

            recentOrders

        });

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load dashboard data."

        });

    }

}

);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;