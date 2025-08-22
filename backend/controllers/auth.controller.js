import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, email_address, usertype, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ username }, { email: email_address }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullname,
      email: email_address,
      password: hashedPassword,
      usertype,
    });
    await newUser.save();
    return res.status(201).json({ message: "user registered sucessfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Unexpected server error", error: err.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    let { identifier, password } = req.body;
    identifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "The user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "The password does not match" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unexpected server error", error: err.message });
  }
};
