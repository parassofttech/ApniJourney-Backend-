
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // console.log("AUTH HEADER:", authHeader); // 🔍 DEBUG

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No authorization header",
    });
  }

  // Expect: Bearer <token>
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("DECODED USER:", decoded); // 🔍 DEBUG

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

module.exports = verifyToken;




// import jwt from "jsonwebtoken";

// const verifyTokens = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer "))
//     return res.status(401).json({ message: "Access denied, no token" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // decoded = { id: user._id }
//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// export default verifyTokens
