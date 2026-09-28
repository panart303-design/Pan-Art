<<<<<<< HEAD
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
customer: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},

    artworkId: {
        type: String,
        required: true,
        trim: true
    },

    artworkTitle: {
        type: String,
        required: true,
        trim: true
    },

    artist: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "cancelled"
        ],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "cancelled"
        ],
        default: "pending"
    },

    paymentReference: {
        type: String,
        default: null,
        trim: true
    }
},
{
    timestamps: true
}

);

module.exports = mongoose.model(
"Order",
orderSchema
=======
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
customer: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},

    artworkId: {
        type: String,
        required: true,
        trim: true
    },

    artworkTitle: {
        type: String,
        required: true,
        trim: true
    },

    artist: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "cancelled"
        ],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "cancelled"
        ],
        default: "pending"
    },

    paymentReference: {
        type: String,
        default: null,
        trim: true
    }
},
{
    timestamps: true
}

);

module.exports = mongoose.model(
"Order",
orderSchema
>>>>>>> 55e619a2b3c688d863890bd1300bb1649e96c925
);