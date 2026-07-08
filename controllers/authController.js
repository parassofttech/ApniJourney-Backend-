const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/auth");

// 1. Resend ko import karein (Nodemailer ki jagah)
const { Resend } = require('resend');
require("dotenv").config();

// 2. Resend ko initialize karein
const resend = new Resend(process.env.RESEND_API_KEY||" re_X3phJsEw_DGNAvBTYpSMmhwRoPTf69K36");

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check if Email Already Exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save User to Database
    await userModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 2 * 60 * 1000, // 10 minutes expiry
    });

    // ✅ Send Email Using Resend API
    await resend.emails.send({
      from: 'ApniJourney <noreply@apnijourney.com>', // Free tier mein yehi sender address rahega
      to: email,
      subject: "OTP Verification",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="500" cellpadding="0" cellspacing="0" 
          style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 8px 25px rgba(0,0,0,0.08);">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#4f46e5;">ApniJourney</h1>
              <p style="color:#888; margin-top:5px;">Email Verification</p>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:20px;">
              <h2 style="margin:0; color:#111;">Verify Your Email Address</h2>
              <p style="color:#555; font-size:14px; margin-top:10px;">
                Thank you for signing up! Please use the OTP below to verify your email address.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:25px 0;">
              <div style="
                display:inline-block;
                padding:15px 40px;
                background:linear-gradient(135deg,#6366f1,#4f46e5);
                color:#ffffff;
                font-size:28px;
                letter-spacing:6px;
                border-radius:8px;
                font-weight:bold;
              ">
                ${otp}
              </div>
            </td>
          </tr>

           <!-- Expiry -->
            <tr>
             <td align="center" style="padding-bottom:20px;">
               <p style="color:#dc2626; font-size:14px; margin:0;">
                 ⏳ This OTP will expire in 2 minutes.
               </p>
            </td>
           </tr>

          <!-- Security Note -->
          <tr>
            <td style="padding-top:10px;">
              <p style="color:#666; font-size:13px; line-height:1.6;">
                🔐 For your security, do not share this OTP with anyone. 
                If you did not request this verification, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:30px; font-size:12px; color:#999;">
              <hr style="border:none; border-top:1px solid #eee; margin-bottom:15px;" />
              © ${new Date().getFullYear()} ApniJourney. All rights reserved.
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`,
    });

    console.log("OTP Sent Successfully via Resend");
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { signup };

/* ================= LOGIN ================= */


const ADMIN_EMAIL = "apnijourneyin@gmail.com";


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: "Email or password incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email or password incorrect",
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      isAdmin: user.email === ADMIN_EMAIL,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ================= GET PROFILE ================= */
const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findById(decoded._id)   // ✅ FIX
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ================= VERIFY EMAIL ================= */
const verifyOTP = async (req, res) => {
  try {
    const {email, otp} = req.body

    const user = await userModel.findOne({email}); // ✅ FIX

    if (!user || user.otp !==otp) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.emailVerified = true;
      user.otp = null;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }
};



//   Direct Google Login
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log("Google User:", name, email);

   const ADMIN_EMAIL = "apnijourneyin@gmail.com";

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        isAdmin: email === ADMIN_EMAIL,
        emailVerified: true
        
      });
    }
    

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.log("Google Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Basic Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ✅ Check if User Exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check if Already Verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // ✅ Generate New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Update User Database (Fixed to 10 Minutes Expiry)
    user.otp = otp;
    user.otpExpire = Date.now() + 2 * 60 * 1000; // Sahi 10 minutes ka time set kiya
    await user.save();

    // ✅ Send Email Using Resend API (No Nodemailer)
    await resend.emails.send({
      from: 'ApniJourney <noreply@apnijourney.com>', // <-- Yahan apna verified domain naam hi likhna
      to: email,
      subject: "Resend OTP Verification",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 8px 25px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#4f46e5;">ApniJourney</h1>
              <p style="color:#888; margin-top:5px;">Resend Verification Code</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;">
              <h2 style="margin:0; color:#111;">Your New OTP Code</h2>
              <p style="color:#555; font-size:14px; margin-top:10px;">
                As requested, here is your new verification code. Please use this OTP to secure your account.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:25px 0;">
              <div style="display:inline-block; padding:15px 40px; background:linear-gradient(135deg,#6366f1,#4f46e5); color:#ffffff; font-size:28px; letter-spacing:6px; border-radius:8px; font-weight:bold;">
                ${otp}
              </div>
            </td>
          </tr>
          <tr>
             <td align="center" style="padding-bottom:20px;">
               <p style="color:#dc2626; font-size:14px; margin:0;">⏳ This OTP will expire in 2 minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:10px;">
              <p style="color:#666; font-size:13px; line-height:1.6;">
                🔐 For your security, do not share this OTP with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

    console.log("Resend OTP Sent Successfully via Resend");
    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const users = async (req, res) => {
  try {
    const user = await userModel.find()

    res.status(200).json({
      success: true,
      user : user
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips"
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("👉 Delete request ID:", userId);

    // ✅ 1. Check ID exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ✅ 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // ✅ 3. Check user exists first
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ 4. Delete user
    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.error("❌ Delete user error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message, // 👈 important for debugging
    });
  }
};


const blockUser = async (req,res)=>{
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.blocked = !user.blocked; // toggle
    await user.save();

    res.json({ success: true, message: `User ${user.blocked ? "blocked" : "unblocked"} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


module.exports={  login,
  getProfile,
  verifyOTP,
  signup,
  googleLogin,
  resendOtp,users,
  deleteUser,
  blockUser
};
