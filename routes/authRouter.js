const express = require("express");
const {  login, signup, verifyOTP, googleLogin, resendOtp, users, deleteUser, blockUser } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../middleware/authMiddleware");


const verifyEmailMiddleware = require("../middleware/veryifyEmailMiddleware");

const authRouter = express.Router();

authRouter.post("/signup",signupValidation, signup)
authRouter.post("/login",loginValidation, login)
authRouter.get("/users", users)
authRouter.get("/profile",verifyEmailMiddleware, login)
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/google-login",googleLogin);
authRouter.post("/resend-otp", resendOtp);
authRouter.delete("/users/:id",deleteUser)
authRouter.put("/users/:id/toggleBlock",blockUser)

module.exports = authRouter