<<<<<<< HEAD
const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        artist: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "painting",
                "drawing",
                "portrait",
                "abstract",
                "photography"
            ]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            type: String,
            required: true
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Artwork",
    artworkSchema
=======
const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        artist: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "painting",
                "drawing",
                "portrait",
                "abstract",
                "photography"
            ]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            type: String,
            required: true
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Artwork",
    artworkSchema
>>>>>>> 55e619a2b3c688d863890bd1300bb1649e96c925
);