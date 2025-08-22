import Profile from "../models/profile/profile.model.js";
const categoryKeywords = {
  "web design": "figma photoshop illustrator ui ux",
  "web development": "javascript react node angular vue",
  devops: "docker kubernetes aws ci/cd gcp",
  "ai/ml": "python tensorflow pytorch machine learning ai",
  frontend: "html css javascript react vue angular",
  backend: "node express java python php",
  "mobile apps": "react native flutter android ios swift",
  "ui/ux": "figma adobe xd sketch prototyping",
};

// Text-based search controller for the search bar using indexing
export const searchProfile = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q)
      return res
        .status(400)
        .json({ message: "Please write something to search" });

    const profiles = await Profile.find({ $text: { $search: q } })
      .populate({
        path: "userId",
        match: { usertype: "professional" },
        select: "username fullname email",
      })
      .sort({ score: { $meta: "textScore" } })
      .select({ score: { $meta: "textScore" } });

    const filteredProfiles = profiles.filter(
      (p) => p.userId && p.userId._id.toString() !== userId
    );

    res.json(filteredProfiles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Keywords for categorical search
export const categoricalSearch = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user.id;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const keywords = categoryKeywords[category.toLowerCase()];
    if (!keywords) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const results = await Profile.find(
      { $text: { $search: keywords } },
      { score: { $meta: "textScore" } }
    )
      .populate({
        path: "userId",
        match: { usertype: "professional" },
        select: "username fullname email",
      })
      .sort({ score: { $meta: "textScore" } });

    const filteredResults = results.filter(
      (p) => p.userId && p.userId._id.toString() !== userId
    );
    res.json(filteredResults);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTopProfiles = async (req, res) => {
  try {
    const userId = req.user?.id; // optional if you want to exclude current user

    const profiles = await Profile.find()
      .populate({
        path: "userId",
        match: { usertype: "professional" },
        select: "username fullname email",
      })
      .sort({ createdAt: -1 }) // newest first, you can change to any criteria
      .limit(8);

    const filteredProfiles = profiles.filter(
      (p) => p.userId && p.userId._id.toString() !== userId
    );

    res.json(filteredProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//this is the search based on the availability;

export const searchByAvailability = async (req, res) => {
  try {
    const maxDays = parseInt(req.query.days); // <-- match frontend
    const userId = req.user.id;

    if (isNaN(maxDays)) {
      return res.status(400).json({ message: "Availability required" });
    }

    const profiles = await Profile.find().populate({
      path: "userId",
      match: { usertype: "professional" },
      select: "username fullname email",
    });

    const filteredProfiles = profiles.filter((p) => {
      if (!p.userId) return false;
      const availableDays = p.availability.filter(Boolean).length;
      return availableDays <= maxDays && p.userId._id.toString() !== userId;
    });

    res.json(filteredProfiles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
