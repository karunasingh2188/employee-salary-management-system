const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const protect = (req, res, next) => {

    try {

        // Get token from Authorization header

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Not authorized. Token missing."
            });

        }


        // Check Bearer token

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });

        }


        // Extract token

        const token =
            authHeader.split(" ")[1];


        // Verify token

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Attach user information to request

        req.user = decoded;


        // Continue to next middleware/controller

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

};


// ==========================================
// ADMIN MIDDLEWARE
// ==========================================

const adminOnly = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Not authorized."
        });

    }


    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });

    }


    next();

};


module.exports = {
    protect,
    adminOnly
};