const express = require("express");

const Order = require("../models/Order");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// CREATE ORDER
// ========================================

router.post(
"/",
requireLogin,
async (req, res) => {

    try {

        const {
            artworkId
        } = req.body;


        // ====================================
        // CHECK ARTWORK ID
        // ====================================

        if (!artworkId) {

            return res.status(400).json({

                success: false,

                message:
                    "Artwork ID is required."

            });

        }


        // ====================================
        // LOAD TRUSTED ARTWORK CATALOG
        // ====================================

        const artworksFile =
            require.resolve("../data/artwork.js");

        delete require.cache[artworksFile];

        const artworks =
            require(artworksFile);


        // ====================================
        // FIND ARTWORK
        // ====================================

        const artwork =
            artworks.find(
                item =>
                    item.id === artworkId
            );


        if (!artwork) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        // ====================================
        // CREATE ORDER
        // ====================================

        const order = new Order({

            customer:
                req.user._id,

            artworkId:
                artwork.id,

            artworkTitle:
                artwork.title,

            artist:
                artwork.artist,

            // IMPORTANT:
            // Price comes from the server catalog.

            amount:
                artwork.price,

            paymentStatus:
                "pending",

            orderStatus:
                "pending"

        });


        await order.save();


        // ====================================
        // SUCCESS
        // ====================================

        return res.status(201).json({

            success: true,

            message:
                "Order created successfully.",

            order

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create order."

        });

    }

}

);

// ========================================
// START PAYMENT
// ========================================
//
// POST /api/orders/payment
//
// This route is protected by requireLogin.
//
// The customer sends only the artworkId.
//
// The backend gets the real artwork price
// from data/artwork.js.
//
// We do NOT trust:
// - price from the browser
// - total from the browser
// - payment status from the browser
//
// The order remains "pending" until the
// payment provider confirms the payment.
// ========================================

router.post(
"/payment",
requireLogin,
async (req, res) => {

    try {

        const {
            artworkId
        } = req.body;


        // ====================================
        // CHECK ARTWORK ID
        // ====================================

        if (!artworkId) {

            return res.status(400).json({

                success: false,

                message:
                    "Artwork ID is required."

            });

        }


        // ====================================
        // LOAD TRUSTED ARTWORK CATALOG
        // ====================================

        const artworksFile =
            require.resolve("../data/artwork.js");

        delete require.cache[artworksFile];

        const artworks =
            require(artworksFile);


        // ====================================
        // FIND ARTWORK
        // ====================================

        const artwork =
            artworks.find(
                item =>
                    item.id === artworkId
            );


        if (!artwork) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        // ====================================
        // CHECK EXISTING PENDING ORDER
        // ====================================

        let order =
            await Order.findOne({

                customer:
                    req.user._id,

                artworkId:
                    artwork.id,

                paymentStatus:
                    "pending",

                orderStatus:
                    "pending"

            })
            .sort({
                createdAt: -1
            });


        // ====================================
        // CREATE PENDING ORDER IF NEEDED
        // ====================================

        if (!order) {

            order = new Order({

                customer:
                    req.user._id,

                artworkId:
                    artwork.id,

                artworkTitle:
                    artwork.title,

                artist:
                    artwork.artist,

                // Trusted server-side price

                amount:
                    artwork.price,

                paymentStatus:
                    "pending",

                orderStatus:
                    "pending"

            });


            await order.save();

        }


        // ====================================
        // PAYMENT PROVIDER
        // ====================================
        //
        // Fonbnk will be connected here.
        //
        // We do not mark the order as paid
        // until Fonbnk confirms the payment.
        // ========================================


        return res.status(200).json({

            success: true,

            paymentReady: false,

            message:
                "Payment order created successfully.",

            order: {

                id:
                    order._id,

                artworkId:
                    order.artworkId,

                artworkTitle:
                    order.artworkTitle,

                amount:
                    order.amount,

                paymentStatus:
                    order.paymentStatus,

                orderStatus:
                    order.orderStatus

            }

        });


    } catch (error) {

        console.error(
            "Start payment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to start payment."

        });

    }

}

);

// ========================================
// GET CUSTOMER ORDERS
// ========================================
//
// GET /api/orders/my-orders
//
// Only the logged-in customer can see
// their own orders.
// ========================================

router.get(
"/my-orders",
requireLogin,
async (req, res) => {

    try {

        const orders =
            await Order.find({

                customer:
                    req.user._id

            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "Get customer orders error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load orders."

        });

    }

}

);

module.exports = router;