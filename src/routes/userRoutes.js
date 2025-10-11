import express from "express";
import { deleteUser, getAllUsers } from "../controllers/userController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteUser);

export default router;