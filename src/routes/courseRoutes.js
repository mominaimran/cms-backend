import express from 'express';
import { createCourse, getAllCourses, assignCourseToFaculty, getFacultyCourses  } from '../controllers/courseController.js';
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, authorizeRoles("admin"), createCourse);
router.put("/:id/assign", protectRoute, authorizeRoles("admin"), assignCourseToFaculty);
router.get("/", protectRoute, authorizeRoles("admin"), getAllCourses);
router.get("/my", protectRoute, authorizeRoles("faculty"), getFacultyCourses);

export default router;