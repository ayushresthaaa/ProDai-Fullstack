import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Profile from "../models/profile/profile.model.js";

// controllers/user.controller.js
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    // Check for duplicate username
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already taken" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username;
    await user.save();

    res.json({ message: "Username updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//change email
export const updateCredEmail = async (req, res) => {
  try {
    const { email_address } = req.body;
    if (!email_address)
      return res.status(400).json({ message: "Email address is required" });

    const existing = await User.findOne({ email: email_address });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = email_address;
    await user.save();

    res.json({ message: "Email updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    // Prevent using the same password
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld)
      return res
        .status(400)
        .json({ message: "New password must be different from old password" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//change the user to professional
export const switchToProfessional = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usertype === "professional")
      return res.status(400).json({ message: "Already a professional" });

    user.usertype = "professional";
    await user.save();

    // Create empty profile
    const profile = new Profile({ userId: user._id });
    await profile.save();
    res.json({ message: "Switched to professional successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const switchToUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.usertype = "user";
    await user.save();

    await Profile.findOneAndDelete({ userId: user._id });

    res.json({ message: "Switched to regular user successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
