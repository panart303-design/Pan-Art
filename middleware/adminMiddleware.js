<<<<<<< HEAD
const Admin = require("../models/Admin");

async function requireAdmin(req, res, next) {
try {

    // Check whether an admin session exists
    if (!req.session.adminId) {

        if (req.accepts("html")) {
            return res.redirect(
                "/admin-login.html"
            );
        }

        return res.status(401).json({
            success: false,
            message: "Admin login required."
        });
    }


    // Find the admin connected to the session
    const admin = await Admin.findById(
        req.session.adminId
    ).select("-password");


    // Admin account no longer exists
    if (!admin) {

        req.session.adminId = null;
        req.session.adminRole = null;

        if (req.accepts("html")) {
            return res.redirect(
                "/admin-login.html"
            );
        }

        return res.status(401).json({
            success: false,
            message: "Admin session is no longer valid."
        });
    }


    // Make admin available to the next route
    req.admin = admin;

    next();

} catch (error) {

    console.error(
        "Admin authentication error:",
        error
    );

    if (req.accepts("html")) {
        return res.redirect(
            "/admin-login.html"
        );
    }

    return res.status(500).json({
        success: false,
        message: "Admin authentication failed."
    });
}

}

=======
const Admin = require("../models/Admin");

async function requireAdmin(req, res, next) {
try {

    // Check whether an admin session exists
    if (!req.session.adminId) {

        if (req.accepts("html")) {
            return res.redirect(
                "/admin-login.html"
            );
        }

        return res.status(401).json({
            success: false,
            message: "Admin login required."
        });
    }


    // Find the admin connected to the session
    const admin = await Admin.findById(
        req.session.adminId
    ).select("-password");


    // Admin account no longer exists
    if (!admin) {

        req.session.adminId = null;
        req.session.adminRole = null;

        if (req.accepts("html")) {
            return res.redirect(
                "/admin-login.html"
            );
        }

        return res.status(401).json({
            success: false,
            message: "Admin session is no longer valid."
        });
    }


    // Make admin available to the next route
    req.admin = admin;

    next();

} catch (error) {

    console.error(
        "Admin authentication error:",
        error
    );

    if (req.accepts("html")) {
        return res.redirect(
            "/admin-login.html"
        );
    }

    return res.status(500).json({
        success: false,
        message: "Admin authentication failed."
    });
}

}

>>>>>>> 55e619a2b3c688d863890bd1300bb1649e96c925
module.exports = requireAdmin;