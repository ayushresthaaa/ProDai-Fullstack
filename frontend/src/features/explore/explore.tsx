import { useState, useEffect, useRef } from "react";
import styles from "./explore.module.css";
import {
  searchByCategory,
  searchProfiles,
  searchByAvailability,
  getTopProfiles,
} from "../../shared/config/api";
import { Navbar } from "../../components/ui/navbar/Navbar";
import { useLocation } from "react-router-dom";
import { Footer } from "../../components/ui/footer/Footer";
import { useNavigate } from "react-router-dom";
interface Profile {
  _id: string;
  avatar?: string;
  location?: string;
  bio?: string;
  availability: boolean[];
  skills: string[];
  contact: {
    email?: string;
    linkedin?: string;
  };
  userId: {
    _id: string;
    username: string;
    fullname?: string;
  };
}

export const Explore = () => {
  //to get the query from the home page
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("query") || "";

  //for clicking outside the drop downs
  const categoryRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);

  const dropDownCategories = [
    "Web Design",
    "Web Development",
    "DevOps",
    "AI/ML",
    "Frontend",
    "Backend",
    "Mobile Apps",
    "UI/UX",
  ];

  const availabilityOptions = [
    { label: "6 days or less", value: 6 },
    { label: "5 days or less", value: 5 },
    { label: "4 days or less", value: 4 },
    { label: "3 days or less", value: 3 },
    { label: "2 days or less", value: 2 },
    { label: "1 day or less", value: 1 },
  ];

  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [selectedCat, setSelectCat] = useState("");
  const [dropdownAvailOpen, setDropdownAvailOpen] = useState(false);
  const [selectedAvail, setSelectedAvail] = useState<number | null>(null);
  const [results, setResults] = useState<Profile[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setErrormessage] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  //for fetching data acc to the home page's structure
  useEffect(() => {
    if (!initialQuery) return;

    const fetchQuerySearch = async () => {
      try {
        const data = await searchProfiles(initialQuery);
        setResults(data);
        setNoResults(data.length === 0);
        setErrormessage("");
        setSearchPerformed(true);
        setQuery(initialQuery);
      } catch (err) {
        const error = err as { message: string };
        setResults([]);
        setNoResults(true);
        setErrormessage(error.message);
      }
    };
    fetchQuerySearch();
  }, [initialQuery]);

  //for fetching data from the top profiles
  useEffect(() => {
    if (initialQuery) return;
    const fetchTopProfiles = async () => {
      try {
        const data = await getTopProfiles();
        setResults(data);
        setNoResults(data.length === 0);
      } catch (err) {
        const error = err as { message: string };
        setErrormessage(error.message);
        setResults([]);
        setNoResults(true);
      }
    };

    fetchTopProfiles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
      if (
        availabilityRef.current &&
        !availabilityRef.current.contains(event.target as Node)
      ) {
        setDropdownAvailOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //to handle the saerch  from the input
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const data = await searchProfiles(query);
      setResults(data);
      setNoResults(data.length === 0);
      setErrormessage("");
      setSearchPerformed(true);

      setSelectCat("");
      setSelectedAvail(null);
      setQuery("");
    } catch (err) {
      const error = err as { message: string };

      setResults([]);
      setErrormessage(error.message);
    }
  };

  //to handle the categorical search
  const handleSelect = async (category: string) => {
    setSelectCat(category);
    setDropDownOpen(false);

    try {
      const data = await searchByCategory(category.toLowerCase());
      setResults(data);
      setNoResults(data.length === 0);
      setErrormessage("");
      setSearchPerformed(true);

      setQuery("");
      setSelectedAvail(null);
    } catch (err) {
      const error = err as { message: string };
      setResults([]);
      setNoResults(true);
      setErrormessage(error.message);
    }
    setQuery("");
  };

  //to handle the searches based on avaialbility
  const handleSelectAvailability = async (value: number) => {
    setSelectedAvail(value);
    setDropdownAvailOpen(false);

    try {
      const data = await searchByAvailability(value);
      setResults(data);
      setNoResults(data.length === 0);
      setErrormessage("");
      setSearchPerformed(true);

      setQuery("");
      setSelectCat("");
    } catch (err) {
      const error = err as { message: string };
      setResults([]);
      setNoResults(true);
      setErrormessage(error.message);
    }

    setQuery("");
    setSelectCat("");
  };

  //autocomplete feature // To fetch suggestions as user types
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Call your backend API with query `q`
      const data = await searchProfiles(value);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.exploreContainer}>
        <section className={styles.topSection}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <h1>Search Pros</h1>
            <div className={styles.heroSearchBar}>
              <div className={styles.inputWithButton}>
                <input
                  type="text"
                  id="explore-search"
                  placeholder=" "
                  className={styles.formInput}
                  value={query}
                  autoComplete="off"
                  onChange={handleInputChange} // ✅ use your live suggestions handler
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  } // allow click on suggestion
                />

                <label htmlFor="explore-search">Search Here...</label>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <img src="/src/assets/searchicon.png" alt="search" />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionsList}>
                  {suggestions.map((profile) => (
                    <li
                      key={profile._id}
                      onClick={() => {
                        setQuery(profile.userId.username); // set input to clicked suggestion
                        setShowSuggestions(false);
                        handleSearch(); // optionally trigger search on click
                      }}
                    >
                      {profile.userId.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className={styles.suggestionContainer}>
            <h3>Suggestions</h3>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("javascript");
              }}
            >
              JavaScript
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("spotify web design");
              }}
            >
              Spotify Web Design
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("cloud");
              }}
            >
              Cloud
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("devops");
              }}
            >
              DevOps
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("ui/ux");
              }}
            >
              UI/UX
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("frontend");
              }}
            >
              Frontend
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                setQuery("backend");
              }}
            >
              Backend
            </span>
          </div>

          {/* Category Dropdown */}
          <div className={styles.categorySection}>
            <div ref={categoryRef} className={styles.dropdown}>
              <button
                className={styles.dropdownButton}
                onClick={() => setDropDownOpen(!dropdownOpen)}
              >
                {selectedCat || "Select Category"}
              </button>
              {dropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  {dropDownCategories.map((cat) => (
                    <li key={cat} onClick={() => handleSelect(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              ref={availabilityRef}
              className={styles.dropdown}
              style={{ marginLeft: "10px" }}
            >
              <button
                className={styles.dropdownButton}
                onClick={() => setDropdownAvailOpen(!dropdownAvailOpen)}
              >
                {selectedAvail
                  ? `≤ ${selectedAvail} days`
                  : "Select Availability"}{" "}
              </button>
              {dropdownAvailOpen && (
                <ul className={styles.dropdownMenu}>
                  {availabilityOptions.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => handleSelectAvailability(opt.value)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.resultCounter}>
            {searchPerformed &&
              (noResults ? (
                <p>No results found</p>
              ) : (
                <p>
                  {results.length}{" "}
                  {results.length === 1 ? "profile" : "profiles"} found
                </p>
              ))}
          </div>
        </section>

        {/* Results Section */}
        <section className={styles.bottomSection}>
          <div className={styles.resultContainer}>
            {results.map((profile) => (
              <div className={styles.resultsCard} key={profile._id}>
                <div className={styles.avatarSection}>
                  <img src={profile.avatar} alt="profile avatar" />
                </div>

                <div className={styles.detailsSection}>
                  <h2 className={styles.detailName}>
                    {profile.userId.username}
                  </h2>

                  <div className={styles.addressAvailContainer}>
                    {profile.location && (
                      <span className={styles.address}>
                        <img src="/src/assets/location.png"></img>
                        <p>{profile.location}</p>
                      </span>
                    )}
                    {profile.availability && (
                      <span className={styles.Avail}>
                        <img src="/src/assets/calendar.png"></img>
                        <p>
                          {" "}
                          {profile.availability.filter(Boolean).length} days a
                          week
                        </p>
                      </span>
                    )}
                  </div>
                  {profile.bio && (
                    <p className={styles.profileBio}>
                      {profile.bio.split(" ").slice(0, 3).join(" ") +
                        (profile.bio.split(" ").length > 6 ? "..." : "")}
                    </p>
                  )}

                  <div className={styles.skillContainer}>
                    {profile.skills.slice(0, 4).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className={styles.moreSkills}>
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className={styles.contactSection}>
                    {/* {profile.contact.email && (
                      <span>Email: {profile.contact.email}</span>
                    )} */}
                    {/* {profile.contact.linkedin && (
                      <span>LinkedIn: {profile.contact.linkedin}</span>
                    )} */}
                  </div>

                  <button
                    className={styles.viewProfile}
                    onClick={() =>
                      navigate(`/getprofile/${profile.userId._id}`)
                    }
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Modal for errors */}
        {error && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <p className={styles.errorText}>{error}</p>
              <button
                className={styles.modalClose}
                onClick={() => setErrormessage("")}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
