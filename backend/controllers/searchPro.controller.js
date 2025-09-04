import Profile from "../models/profile/profile.model.js";
import User from "../models/user.model.js";
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
// export const searchProfile = async (req, res) => {
//   try {
//     const { q } = req.query;
//     const currentUserId = req.user.id;

//     if (!q || !q.trim()) {
//       return res
//         .status(400)
//         .json({ message: "Please write something to search" });
//     }

//     const query = q.trim();
//     const lowerQuery = query.toLowerCase();
//     const regex = new RegExp(query, "i");

//     let profiles = [];

//     // Category search (skills-based)
//     if (categoryKeywords[lowerQuery]) {
//       const skills = categoryKeywords[lowerQuery].split(" ");
//       profiles = await Profile.find({
//         skills: { $in: skills.map((s) => new RegExp(`^${s}$`, "i")) },
//       })
//         .populate({
//           path: "userId",
//           match: { usertype: "professional" },
//           select: "username fullname email",
//         })
//         .sort({ createdAt: -1 });
//     } else {
//       // General search on Profile fields
//       profiles = await Profile.find({
//         $or: [
//           { bio: regex },
//           { skills: regex },
//           { location: regex },
//           { "experience.title": regex },
//           { "experience.company": regex },
//         ],
//       })
//         .populate({
//           path: "userId",
//           match: { usertype: "professional" },
//           select: "username fullname email",
//         })
//         .sort({ createdAt: -1 });
//     }

//     // Filter results to include only matches and exclude current user
//     const filteredProfiles = profiles.filter((p) => {
//       if (!p.userId || p.userId._id.toString() === currentUserId) return false;

//       if (categoryKeywords[lowerQuery]) return true; // keep all category matches

//       // Check Profile + User fields for regex match
//       return (
//         regex.test(p.userId.fullname) ||
//         regex.test(p.userId.username) ||
//         regex.test(p.bio || "") ||
//         (Array.isArray(p.skills) && p.skills.some((s) => regex.test(s))) ||
//         regex.test(p.location || "") ||
//         (Array.isArray(p.experience) &&
//           p.experience.some(
//             (exp) =>
//               (exp.title && regex.test(exp.title)) ||
//               (exp.company && regex.test(exp.company))
//           ))
//       );
//     });

//     res.json(filteredProfiles);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
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
      .limit(7);

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
export const suggestProfiles = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.trim().length < 3) {
      return res.json([]); // enforce minimum 3 chars
    }

    const regex = new RegExp(q.trim(), "i");

    // Fetch profiles based on fields in Profile itself
    const profiles = await Profile.find({
      $or: [
        { bio: regex },
        { skills: regex },
        { location: regex },
        { "experience.title": regex },
        { "experience.company": regex },
      ],
    })
      .populate({
        path: "userId",
        match: { usertype: "professional" },
        select: "username fullname email",
      })
      .limit(20);

    let suggestions = [];

    profiles.forEach((p) => {
      if (!p.userId || p.userId._id.toString() === userId) return;

      // Skills
      if (Array.isArray(p.skills)) {
        p.skills.forEach((s) => {
          if (regex.test(s)) suggestions.push(s.toLowerCase());
        });
      }

      // Bio
      if (p.bio && regex.test(p.bio)) {
        const matches = p.bio.match(regex);
        if (matches) suggestions.push(...matches.map((m) => m.toLowerCase()));
      }

      // Experience
      if (Array.isArray(p.experience)) {
        p.experience.forEach((exp) => {
          if (exp.title && regex.test(exp.title))
            suggestions.push(exp.title.toLowerCase());
          if (exp.company && regex.test(exp.company))
            suggestions.push(exp.company.toLowerCase());
        });
      }

      // Location
      if (p.location && regex.test(p.location))
        suggestions.push(p.location.toLowerCase());

      // ✅ User full name & username
      if (p.userId.fullname && regex.test(p.userId.fullname))
        suggestions.push(p.userId.fullname.toLowerCase());
      if (p.userId.username && regex.test(p.userId.username))
        suggestions.push(p.userId.username.toLowerCase());
    });

    // Add category keywords (optional)
    Object.values(categoryKeywords).forEach((keywords) => {
      keywords.split(" ").forEach((kw) => {
        if (regex.test(kw)) suggestions.push(kw.toLowerCase());
      });
    });

    // Remove duplicates (case-insensitive) and limit to 10
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 10);

    res.json(uniqueSuggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "server error", error: err.message });
  }
};
export const searchProfile = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || !q.trim()) {
      return res
        .status(400)
        .json({ message: "Please write something to search" });
    }

    const query = q.trim();
    const words = query.split(" ");

    let filteredProfiles = [];

    // Indexed search
    const indexedResults = await Profile.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .populate({
        path: "userId",
        match: { usertype: "professional" },
        select: "username fullname email",
      })
      .sort({ score: { $meta: "textScore" } });

    filteredProfiles = indexedResults.filter(
      (p) => p.userId && p.userId._id.toString() !== currentUserId
    );

    // 2 Regex search if no indexed results
    if (filteredProfiles.length === 0) {
      const regexes = words.map((w) => new RegExp(w, "i"));

      const regexResults = await Profile.find({
        $or: [
          { bio: { $in: regexes } },
          { skills: { $in: regexes } },
          { location: { $in: regexes } },
          { "experience.title": { $in: regexes } },
          { "experience.company": { $in: regexes } },
        ],
      })
        .populate({
          path: "userId",
          match: { usertype: "professional" },
          select: "username fullname email",
        })
        .sort({ createdAt: -1 });

      filteredProfiles = regexResults.filter(
        (p) => p.userId && p.userId._id.toString() !== currentUserId
      );
    }

    //  User fallback if still empty
    if (filteredProfiles.length === 0) {
      const userRegex = new RegExp(query, "i");
      const users = await User.find({
        $or: [{ username: userRegex }, { fullname: userRegex }],
        usertype: "professional",
      });

      if (users.length > 0) {
        const userIds = users.map((u) => u._id);
        const profilesFromUsers = await Profile.find({
          userId: { $in: userIds },
        }).populate({
          path: "userId",
          select: "username fullname email",
        });

        filteredProfiles = profilesFromUsers.filter(
          (p) => p.userId && p.userId._id.toString() !== currentUserId
        );
      }
    }

    // Final response
    res.json(filteredProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
