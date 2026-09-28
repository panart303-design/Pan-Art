const User = require("../models/User");

async function requireLogin(req, res, next) {
    try {

        // ========================================
        // CHECK SESSION
        // ========================================

        if (!req.session.userId) {

            // Browser requesting an HTML page
            if (req.accepts("html")) {
                return res.redirect("/login.html");
            }

            // API request
            return res.status(401).json({
                success: false,
                message: "Please login to continue."
            });
        }


        // ========================================
        // FIND USER
        // ========================================

        const user = await User.findById(req.session.userId)
            .select("-password");

        // ========================================
        // INVALID SESSION
        // ========================================

        if (!user) {

            req.session.destroy(() => {});

            if (req.accepts("html")) {
                return res.redirect("/login.html");
            }

            return res.status(401).json({
                success: false,
                message: "Your session is no longer valid."
            });
        }


        // ========================================
        // AUTHENTICATED USER
        // ========================================

        req.user = user;

        next();

    } catch (error) {

        console.error("Authentication error:", error);

        if (req.accepts("html")) {
            return res.redirect("/login.html");
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed."
        });
    }
}

module.exports = requireLogin;