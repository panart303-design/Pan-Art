<<<<<<< HEAD
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
{
fullName: {
type: String,
required: true,
trim: true
},

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "admin"
    }
},
{
    timestamps: true
}

);

module.exports = mongoose.model("Admin", adminSchema);
=======
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
{
fullName: {
type: String,
required: true,
trim: true
},

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "admin"
    }
},
{
    timestamps: true
}

);

module.exports = mongoose.model("Admin", adminSchema);
>>>>>>> 55e619a2b3c688d863890bd1300bb1649e96c925
