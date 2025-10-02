import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect private routes (auth required)
const protectRoute = async (req, res, next) => {
  try {
    // 1. cookie se JWT uthao
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // 2. token verify karo
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
      });
    }

    // 3. DB se user lao (password hide karke)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // 4. req me user attach
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ protectRoute error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ RBAC (Role-Based Access Control)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user context" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden - ${req.user.role} role is not allowed to access this resource`,
      });
    }

    next();
  };
};

export { protectRoute, authorizeRoles };
