import User from "../models/User.js";
import Course from "../models/Course.js";

export const createCourse = async (req, res, next) => {
  try {
    let { courseCode, courseName, creditHours, department, semesterNumber, term, year } = req.body;

    if (!courseCode || !courseName || !creditHours || !department || !semesterNumber || !term || !year) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      res.status(400);
      throw new Error("Course already exists");
    }

    const course = await Course.create({
      courseCode,
      courseName,
      creditHours,
      department,
      semesterNumber,
      term,
      year
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

export const enrollStudent = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    if (course.students.includes(studentId))
      return res.status(400).json({ message: "Student already enrolled" });

    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: "Student enrolled successfully", course });
  } catch (error) {
    next(error);
  }
};

export const removeStudent = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.students = course.students.filter(
      (id) => id.toString() !== studentId
    );
    await course.save();

    res.status(200).json({ message: "Student removed successfully", course });
  } catch (error) {
    next(error);
  }
};

export const getEnrolledStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "students",
      "email role"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course.students);
  } catch (error) {
    next(error);
  }
};
