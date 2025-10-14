import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only admin can register users (students or faculty)
router.post("/register", protectRoute, authorizeRoles("admin"), registerUser);

// ✅ Login open for all
router.post("/login", loginUser);

// ✅ Logout
router.post("/logout", protectRoute, logoutUser);

export default router;
