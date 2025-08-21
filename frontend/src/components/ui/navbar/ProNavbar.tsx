import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./navbar.module.css";

export const ProfessionalNavbar: React.FC = () => {
  const location = useLocation();

  // Get username from localStorage
  const storedUsername = localStorage.getItem("username");
  const username = storedUsername ? JSON.parse(storedUsername) : "Professional";

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>Pro Dai.</div>

        <div className={styles.links}>
          <Link
            to="/explore"
            className={
              location.pathname === "/explore" ? styles.activeLink : ""
            }
          >
            Explore
          </Link>
          <Link
            to="/home"
            className={location.pathname === "/home" ? styles.activeLink : ""}
          >
            Home
          </Link>
          <Link
            to="/regress-user"
            className={
              location.pathname === "/regress-user" ? styles.activeLink : ""
            }
          >
            Become User
          </Link>
          <Link
            to="/ai-recommendation"
            className={
              location.pathname === "/ai-recommendation"
                ? styles.activeLink
                : ""
            }
          >
            AI Recommendation
          </Link>
        </div>

        <div className={styles.iconPlaceholder}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="profileGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9780E5" />
                <stop offset="50%" stopColor="#E666CC" />
                <stop offset="100%" stopColor="#53CEDA" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="8" r="4" fill="url(#profileGradient)" />
            <path
              d="M4 20c0-4 4-6 8-6s8 2 8 6"
              stroke="url(#profileGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className={styles.username}>{username}</span>
        </div>
      </div>
    </nav>
  );
};
