import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";

export const ProfessionalNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem("username");
  const username = storedUsername ? JSON.parse(storedUsername) : "Professional";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div
          className={styles.logo}
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          Pro Dai.
        </div>

        <div className={styles.rightSection}>
          <div className={styles.links}>
            <Link
              to="/profile"
              className={
                location.pathname === "/profile" ? styles.activeLink : ""
              }
            >
              Your Profile
            </Link>
            <Link
              to="/recommendation"
              className={
                location.pathname === "/recommendation" ? styles.activeLink : ""
              }
            >
              Recommendation
            </Link>
            {/* <Link
              to="/connections"
              className={
                location.pathname === "/connections" ? styles.activeLink : ""
              }
            >
              Connections
            </Link> */}
          </div>

          <div
            className={styles.iconPlaceholder}
            ref={dropdownRef}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
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

            {dropdownOpen && (
              <div className={styles.dropdown}>
                {/* <button onClick={() => navigate("/")}>Profile</button> */}
                <button onClick={() => navigate("/configCredentials")}>
                  Settings
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
