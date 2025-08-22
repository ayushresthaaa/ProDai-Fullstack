import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./animatedHero.json";
import styles from "./ai_recommendation.module.css";
import { getAIRecommendationsAPI } from "../../shared/config/api";
import { ProfessionalNavbar } from "../../components/ui/navbar/ProNavbar";
import { Footer } from "../../components/ui/footer/Footer";

type AIResponse = {
  user: string;
  currentSkills: string[];
  aiRecommendations: string;
};

export const AIRecommendation: React.FC = () => {
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const animationContainer = useRef<HTMLDivElement>(null);

  // Initialize Lottie animation
  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => anim.destroy(); // cleanup on unmount
    }
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setAiData(null);

      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not found. Please log in.");

      const recs = await getAIRecommendationsAPI(userId);
      setAiData(recs);
    } catch (err: unknown) {
      const error = err as { message: string };
      setError(error.message || "Failed to fetch AI recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAiData(null);
    setError(null);
  };

  return (
    <>
      <ProfessionalNavbar />
      <div className={styles.container}>
        {/* Lottie Animation */}
        <div ref={animationContainer} className={styles.animationWrapper}></div>

        {/* Generate Button */}
        <button
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Recommendations"}
        </button>

        {/* Recommendation Section */}
        {aiData && (
          <div className={styles.recommendationCard}>
            <button className={styles.closeButton} onClick={handleClose}>
              ×
            </button>
            <h3>Suggestions for You</h3>
            <p>
              <strong>Current Skills:</strong>{" "}
              {aiData.currentSkills?.length
                ? aiData.currentSkills.join(", ")
                : "None"}
            </p>
            <ul>
              {aiData.aiRecommendations
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
            </ul>
            <a href="/profile" className={styles.backLink}>
              ← Back to Profile
            </a>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>
      <Footer />
    </>
  );
};
