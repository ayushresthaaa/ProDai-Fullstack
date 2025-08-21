import Profile from "../models/profile/profile.model.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ userId }).populate(
      "userId",
      "username fullname email usertype"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    let profile = await Profile.findOne({ userId });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true }
      );
      return res.json(profile);
    } else {
      profile = new Profile({ userId, ...profileData });
      await profile.save();
      return res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
