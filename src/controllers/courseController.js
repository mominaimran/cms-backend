import User from "../models/User.js";
import Course from "../models/Course.js";

export const createCourse = async (req, res, next) => {
  try {
    let { courseCode, courseName, department, semester, year } = req.body;
    if (!courseCode || !courseName || !department || !semester) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      res.status(400);
      throw new Error("Course already exists");
    }
    const course = await Course.create({
      courseCode,
      courseName,
      department,
      semester,
      year,
    });
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    next(error);
  }
};

export const assignCourseToFaculty = async (req, res, next) => {
  try {
    const { facultyId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "faculty") {
      res.status(400);
      throw new Error("Invalid faculty ID or user is not a faculty");
    }

    course.faculty = faculty._id;
    await course.save();

    res
      .status(200)
      .json({ message: "Course assigned to faculty successfully", course });
  } catch (error) {
    next(error);
  }
};

export const getFacultyCourses = async (req, res, next) => {
  try {
    const facultyId = req.user._id;
    const courses = await Course.find({ faculty: facultyId })
      .populate("students", "email role")
      .select("courseCode courseName department semester year");

    if (!courses.length) {
      return res.status(404).json({ message: "No courses assigned yet" });
    }

    res.status(200).json({
      message: "Assigned courses fetched successfully",
      total: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate("faculty", "email role")
      .populate("students", "email role");

    res.status(200).json({
      total: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};
