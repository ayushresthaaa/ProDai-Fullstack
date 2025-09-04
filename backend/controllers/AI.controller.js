import Profile from "../models/profile/profile.model.js";

// Define categories and associated keywords
const categoryKeywords = {
  "web design": "figma photoshop illustrator ui ux",
  "web development": "javascript react node angular vue",
  devops:
    "docker kubernetes aws gcp ci/cd terraform jenkins ansible prometheus grafana linux",
  "ai/ml": "python tensorflow pytorch machine learning ai",
  frontend: "html css javascript react vue angular",
  backend: "node express java python php",
  "mobile apps": "react native flutter android ios swift",
  "ui/ux": "figma adobe xd sketch prototyping",
};

// Helper: generate recommendations based on skills
const generateRecommendations = (userSkills = []) => {
  const recs = [];

  // Normalize skills
  const normalizedSkills = userSkills.map((s) => s.toLowerCase());

  // Loop through categories
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const keywordList = keywords.split(" ");
    const matchedSkills = normalizedSkills.filter((s) =>
      keywordList.includes(s)
    );
    const missingSkills = keywordList.filter(
      (k) => !normalizedSkills.includes(k)
    );

    if (matchedSkills.length) {
      recs.push(
        `Since you already have experience with ${matchedSkills.join(", ")}, ` +
          `you could level up in ${category} by learning: ${missingSkills.join(
            ", "
          )}.`
      );

      // Suggest related categories
      const relatedCategories = Object.entries(categoryKeywords)
        .filter(
          ([otherCat, otherKeywords]) =>
            otherCat !== category &&
            otherKeywords.split(" ").some((k) => !normalizedSkills.includes(k))
        )
        .map(([otherCat]) => otherCat);

      if (relatedCategories.length) {
        recs.push(
          `Also, consider exploring related areas like: ${relatedCategories.join(
            ", "
          )} to broaden your skill set.`
        );
      }
    }
  }

  // Generic fallback
  if (!recs.length) {
    recs.push(
      "You haven't listed skills matching our categories yet. Start with foundational skills: HTML, CSS, JavaScript, or Python for AI/ML."
    );
  }

  // Soft skills & learning resources
  recs.push(
    "Focus on soft skills: communication, teamwork, and problem-solving.",
    "Check out free resources on platforms like FreeCodeCamp, MDN Web Docs, and Coursera to strengthen your profile."
  );

  return recs;
};

// Controller function
export const getAIRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const userSkills = profile.skills || [];

    const recommendations = generateRecommendations(userSkills);

    res.json({
      user: profile.userId,
      currentSkills: userSkills,
      aiRecommendations: recommendations.join("\n"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
