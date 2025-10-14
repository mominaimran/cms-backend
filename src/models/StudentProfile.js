import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Software Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Business Administration",
      ],
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    batchTerm: {
      type: String,
      enum: ["Spring", "Summer", "Fall"],
      required: true,
    },
    batchYear: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
