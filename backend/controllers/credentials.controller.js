import User from "../models/user.model.js";

// Get current user's credentials (no password)
export const getUserCredentials = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const user = await User.findById(userId).select(
      "username fullname email usertype" // exclude password
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
