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

  // Loop through categories
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const keywordList = keywords.split(" ");
    // If user has at least one skill in this category
    if (userSkills.some((skill) => keywordList.includes(skill.toLowerCase()))) {
      // Recommend skills they don't have yet
      const missingSkills = keywordList.filter(
        (k) => !userSkills.map((s) => s.toLowerCase()).includes(k)
      );
      if (missingSkills.length) {
        recs.push(
          `Based on your interest in ${category}, consider learning: ${missingSkills.join(
            ", "
          )}`
        );
      }
    }
  }

  // Generic growth recommendations
  if (!recs.length) {
    recs.push(
      "Explore foundational skills in web development (HTML, CSS, JavaScript) or Python for AI/ML."
    );
  }

  recs.push(
    "Focus on soft skills: communication, teamwork, and problem-solving.",
    "Consider online courses and certifications to strengthen your profile."
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
