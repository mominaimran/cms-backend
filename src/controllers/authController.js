import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import validateEmailAndRole from "../utils/validateEmailAndRole.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
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

    const user = await User.create({ email, password, role });

    generateToken(res, user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, email: user.email, role: user.role },
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
      generateToken(res, user._id, user.role);
      res.status(200).json({
        message: "User logged in successfully",
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
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
