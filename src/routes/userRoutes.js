import express from "express";
import deleteUser from "../controllers/userController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteUser);

export default router;