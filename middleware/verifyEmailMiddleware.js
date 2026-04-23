// middlewares/verifyEmail.js

const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // apna user model
const userModel = require("../models/auth");

const verifyEmailMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user from DB
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check email verified
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = verifyEmailMiddleware;