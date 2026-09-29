const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

const createAdmin = async () => {
try {

    // Connect to MongoDB
    await mongoose.connect(
        process.env.MONGO_URI
    );

    console.log(
        "MongoDB connected."
    );

    // ========================================
    // ADMIN DETAILS
    // ========================================

    const fullName =
        "Pan Art Administrator";

    const email =
        "admin@panart.com";

    const password =
        "PanArt@192005";

    // ========================================
    // CHECK IF ADMIN ALREADY EXISTS
    // ========================================

    const existingAdmin =
        await Admin.findOne({
            email: email.toLowerCase()
        });

    if (existingAdmin) {

        console.log(
            "Admin account already exists."
        );

        process.exit(0);
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );

    // ========================================
    // CREATE ADMIN
    // ========================================

    const admin =
        new Admin({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "admin"
        });

    await admin.save();

    // ========================================
    // SUCCESS MESSAGE
    // ========================================

    console.log(
        "========================================"
    );

    console.log(
        "PAN ART ADMIN CREATED SUCCESSFULLY"
    );

    console.log(
        "========================================"
    );

    console.log(
        "Email:",
        email
    );

    console.log(
        "Password:",
        password
    );

    console.log(
        "========================================"
    );

    console.log(
        "Keep these login details private."
    );

    process.exit(0);

} catch (error) {

    console.error(
        "Error creating admin:",
        error
    );

    process.exit(1);
}

};

createAdmin();