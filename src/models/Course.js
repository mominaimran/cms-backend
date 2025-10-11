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
    department: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    student: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //later push student IDs here
      },
    ],
    semester: {
      type: String,
      enum: ["Spring", "Summer", "Fall"],
      required: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
