import User from "../models/User.js";
import Course from "../models/Course.js";
import StudentProfile from "../models/StudentProfile.js";
import generateToken from "../utils/generateToken.js";
import validateEmailAndRole from "../utils/validateEmailAndRole.js";
import { parseEmailInfo } from "../utils/parseEmailInfo.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const { valid, role } = validateEmailAndRole(email);
    if (!valid) {
      res.status(403);
      throw new Error("Only university emails are allowed for registration");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // ✅ Create new user
    const user = await User.create({ email, password, role });

    // ✅ If the user is a student, parse email info and auto-enroll
    if (role === "student") {
      const { rollNumber, department, batchTerm, batchYear, semesterNumber } =
        parseEmailInfo(email);

      // Create student profile
      await StudentProfile.create({
        user: user._id,
        rollNumber,
        department,
        semester: semesterNumber,
        batchTerm,
        batchYear,
      });

      // Determine target year based on batchYear + semesterNumber
      const targetYear =
        parseInt(batchYear) + Math.floor((semesterNumber - 1) / 2);

      const courses = await Course.find({
        department,
        semesterNumber,
        term: batchTerm, // optional: ya batchTerm rakh sakti ho
        year: targetYear,
      });

      // Enroll student in each
      for (const course of courses) {
        if (!course.students.some((id) => id.equals(user._id))) {
          course.students.push(user._id);
          await course.save();
        }
      }
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { valid, role } = validateEmailAndRole(email);
    if (!valid) {
      res.status(403);
      throw new Error("Only university emails are allowed");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (role !== user.role) {
      res.status(403);
      throw new Error("Email role mismatch");
    }

    if (await user.matchPassword(password)) {
      // ✅ Generate token
      generateToken(res, user._id, user.role);

      // ✅ Auto-enroll if student not enrolled yet
      if (role === "student") {
        const { rollNumber, department, batchTerm, batchYear, semesterNumber } =
          parseEmailInfo(email);

        // Check existing profile
        let profile = await StudentProfile.findOne({ user: user._id });
        if (!profile) {
          profile = await StudentProfile.create({
            user: user._id,
            rollNumber,
            department,
            semester: semesterNumber,
            batchTerm,
            batchYear,
          });
        } else {
          // 🧠 Update semester if it changed (auto shift)
          if (profile.semester !== semesterNumber) {
            profile.semester = semesterNumber;
            await profile.save();
          }
        }

        // Enroll in the current semester courses
        const courses = await Course.find({
          department,
          semesterNumber,
          term: batchTerm,
          year: batchYear + Math.floor((semesterNumber - 1) / 2),
        });

        for (const course of courses) {
          if (!course.students.some((id) => id.equals(user._id))) {
            course.students.push(user._id);
            await course.save();
          }
        }
      }

      res.status(200).json({
        message: "User logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, logoutUser };
