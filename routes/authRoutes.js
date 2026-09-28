<<<<<<< HEAD
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// REGISTER USER
// ========================================

router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;


        // Check required fields
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }


        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }


        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }


        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);


        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword
        });


        // Create login session
        req.session.userId = user._id;


        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating your account."
        });
    }
});


// ========================================
// LOGIN USER
// ========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create session
        req.session.userId = user._id;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in."
        });
    }
});


// ========================================
// GET CURRENT USER
// ========================================

router.get("/me", requireLogin, (req, res) => {

    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            phone: req.user.phone
        }
    });

});


// ========================================
// LOGOUT
// ========================================

router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "Logout successful."
        });

    });

});

=======
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// REGISTER USER
// ========================================

router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;


        // Check required fields
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }


        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }


        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }


        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);


        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword
        });


        // Create login session
        req.session.userId = user._id;


        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating your account."
        });
    }
});


// ========================================
// LOGIN USER
// ========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create session
        req.session.userId = user._id;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in."
        });
    }
});


// ========================================
// GET CURRENT USER
// ========================================

router.get("/me", requireLogin, (req, res) => {

    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            phone: req.user.phone
        }
    });

});


// ========================================
// LOGOUT
// ========================================

router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "Logout successful."
        });

    });

});

>>>>>>> 55e619a2b3c688d863890bd1300bb1649e96c925
module.exports = router;