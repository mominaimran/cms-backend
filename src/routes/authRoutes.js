import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Sirf admin register kar sake users
router.post("/register", protectRoute, authorizeRoles("admin"), registerUser);

// ✅ Login sab ke liye open
router.post("/login", loginUser);

// ✅ Logout (POST better hai GET se)
router.post("/logout", protectRoute, logoutUser);

export default router;
