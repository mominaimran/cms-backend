import User from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

