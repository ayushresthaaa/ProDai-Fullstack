import { useState, useEffect, useRef } from "react";
import {
  searchProfiles,
  searchByCategory,
  getTopProfiles,
} from "../../shared/config/api";
import "./home.module.css";
interface ProfileData {
  _id: string;
  userId: { username: string; fullname: string; email: string };
  avatar?: string;
  location?: string;
  bio?: string;
  skills?: string[];
}

const categories = ["Developer", "DB Engineer", "DevOps Engineer", "Designer"];

export const Home = () => {
  const [query, setQuery] = useState("");
  const [expandableQuery, setExpandableQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpandedSearch, setIsExpandedSearch] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch top 6 profiles on mount
  useEffect(() => {
    const fetchTopProfiles = async () => {
      setLoading(true);
      try {
        const result = await getTopProfiles();
        setProfiles(result);
      } catch (err) {
        console.error(err);
        alert("Error fetching top profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchTopProfiles();
  }, []);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const result = await searchProfiles(searchQuery);
      setProfiles(result);
      scrollToResults();
    } catch (err) {
      console.error(err);
      alert("Error searching profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandableSearch = async () => {
    if (!expandableQuery) return;
    setLoading(true);
    try {
      const result = await searchProfiles(expandableQuery);
      setProfiles(result);
      setIsExpandedSearch(false);
      scrollToResults();
    } catch (err) {
      console.error(err);
      alert("Error searching profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySearch = async (category: string) => {
    if (!category) return;
    setLoading(true);
    setSelectedCategory(category);
    try {
      const result = await searchByCategory(category.toLowerCase());
      setProfiles(result);
      scrollToResults();
    } catch (err) {
      console.error(err);
      alert("Error fetching category profiles");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandableSearch = () => {
    setIsExpandedSearch(!isExpandedSearch);
    if (isExpandedSearch) {
      setExpandableQuery("");
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>
          Discover Tech Professionals
          <br />
          With Pro Dai
        </h1>
        <div className="search-bar">
          <div className="input-group">
            <input
              type="text"
              id="hero-search"
              autoComplete="off"
              placeholder=" "
              className="form_input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <label htmlFor="hero-search">
              Search for skills, expertise, or professionals...
            </label>
          </div>
          <button onClick={() => handleSearch()}>Find Professionals</button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        {/* Category Dropdown */}
        <div className="category-dropdown">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleCategorySearch(e.target.value);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Expandable Search */}
        <div className="expandable-search">
          <input
            type="text"
            placeholder="Quick search..."
            value={expandableQuery}
            onChange={(e) => setExpandableQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExpandableSearch()}
            className={`expandable-search-input ${
              isExpandedSearch ? "expanded" : ""
            }`}
          />
          <button
            className={`search-toggle ${isExpandedSearch ? "active" : ""}`}
            onClick={toggleExpandableSearch}
          >
            🔍
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section" ref={resultsRef}>
        <div className="profiles">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : profiles.length === 0 ? (
            <p>No profiles found</p>
          ) : (
            profiles.map((p) => (
              <div key={p._id} className="profile-card">
                <img
                  src={p.avatar || "/default-avatar.png"}
                  alt={p.userId.fullname}
                />
                <div className="profile-info">
                  <h3>{p.userId.fullname}</h3>
                  <p className="location">
                    📍 {p.location || "Location not specified"}
                  </p>
                  {p.bio && (
                    <p className="bio">
                      {p.bio.length > 150 ? p.bio.slice(0, 150) + "..." : p.bio}
                    </p>
                  )}
                  {p.skills && p.skills.length > 0 && (
                    <div className="skills">
                      {p.skills.slice(0, 6).map((skill, idx) => (
                        <span key={idx} className="skill-chip">
                          {skill}
                        </span>
                      ))}
                      {p.skills.length > 6 && (
                        <span className="skill-chip">
                          +{p.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="profile-actions">
                  <button
                    className="view-profile-btn"
                    onClick={() => (window.location.href = `/profile/${p._id}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
