import React, { useEffect, useState } from "react";
import Lottie from "lottie-web";
import styles from "./home.module.css";
import animatedHero from "./animatedhero.json";
import computerzTech from "./computerztech.json";
import { Navbar } from "../../components/ui/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/ui/footer/Footer";
export const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const heroAnimation = Lottie.loadAnimation({
      container: document.getElementById("hero-lottie")!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animatedHero,
    });

    const whyUsAnimation = Lottie.loadAnimation({
      container: document.getElementById("whyus-lottie")!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: computerzTech,
    });

    return () => {
      heroAnimation.destroy();
      whyUsAnimation.destroy();
    };
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/explore?query=${encodeURIComponent(query)}`);
  };
  const handleClick = (category: string) => {
    if (!category.trim()) return;
    navigate(`/explore?query=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1>
              Discover Tech Professionals
              <br />
              With Pro Dai.
            </h1>

            {/* Search Bar */}
            <div className={styles.heroSearchBar}>
              <div className={styles.inputWithButton}>
                <input
                  type="text"
                  id="hero-search"
                  placeholder=" "
                  autoComplete="off"
                  className={styles.formInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <label htmlFor="hero-search">
                  Search for skills, expertise, or professionals
                </label>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <img src="/src/assets/searchicon.png" alt="search" />
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className={styles.heroCategories}>
              <span
                className={styles.categoryChip}
                onClick={() => {
                  handleClick("Web development");
                }}
              >
                Web Development
              </span>
              <span
                className={styles.categoryChip}
                onClick={() => {
                  handleClick("mobile apps");
                }}
              >
                Mobile Apps
              </span>
              <span
                className={styles.categoryChip}
                onClick={() => {
                  handleClick("AI/ML");
                }}
              >
                AI/ML
              </span>
              <span
                className={styles.categoryChip}
                onClick={() => {
                  handleClick("UI/UX");
                }}
              >
                UI/UX Design
              </span>
            </div>
          </div>

          <div className={styles.heroRight} id="hero-lottie"></div>
        </div>
        {/* Categorical Section */}
        <h1
          className={styles.categoricalTitle}
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          Check Out Popular Hires.
        </h1>
        <div className={styles.categoricalSection}>
          <div
            className={`${styles.categoryCard} ${styles.card1}`}
            onClick={() => {
              handleClick("Web Development");
            }}
          >
            <div className={styles.cardHeader}>
              <img src="/src/assets/computer.png" />
              <h2>Web Developers</h2>
            </div>
            <p>Create responsive websites and web apps.</p>
          </div>

          <div
            className={`${styles.categoryCard} ${styles.card2}`}
            onClick={() => {
              handleClick("mobile apps");
            }}
          >
            <div className={styles.cardHeader}>
              <img src="/src/assets/mobile.png" />
              <h2>Mobile Developers</h2>
            </div>
            <p>Build cross-platform mobile applications.</p>
          </div>

          <div
            className={`${styles.categoryCard} ${styles.card3}`}
            onClick={() => {
              handleClick("AI/ML");
            }}
          >
            <div className={styles.cardHeader}>
              <img src="/src/assets/robot.png" />
              <h2>AI/ML Engineers</h2>
            </div>
            <p>Develop intelligent algorithms and models.</p>
          </div>
        </div>

        {/* Why Us Section */}
        <div className={styles.whyUs}>
          <h1>Why Us?</h1>
          <div className={styles.whyUsAnimation} id="whyus-lottie"></div>
          <div className={styles.whyUsRightSide}>
            <p>
              We connect you with Top Tech Professionals quickly and
              efficiently. Every professionals' details will be provided to you
              with a matter of simple search. It's that easy.
              <br />
              <br />
              To boost your efficieny and allow the professional to showcase
              their portfolio we have included the features and design
              engineering full tailored towards our customers.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
