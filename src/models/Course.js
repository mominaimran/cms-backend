import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    creditHours: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Software Engineering",
        "Information Technology",
      ],
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    term: {
      type: String,
      enum: ["Spring", "Summer", "Fall"],
      required: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assigned faculty
      default: null,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // enrolled students
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
