import { useState, useEffect, useRef } from "react";
import styles from "./explore.module.css";
import {
  searchByCategory,
  searchProfiles,
  searchByAvailability,
  getTopProfiles,
  suggestProfilesAPI,
} from "../../shared/config/api";
import { Navbar } from "../../components/ui/navbar/Navbar";
import { useLocation } from "react-router-dom";
import { Footer } from "../../components/ui/footer/Footer";
import { useNavigate } from "react-router-dom";
interface Experience {
  title: string;
  company?: string;
  startYear: string;
  endYear: string;
}
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
  experience?: Experience[];
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

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
  // const handleSearch = async () => {
  //   if (!query.trim()) return;
  //   try {
  //     const data = await searchProfiles(query);
  //     setResults(data);
  //     setNoResults(data.length === 0);
  //     setErrormessage("");
  //     setSearchPerformed(true);

  //     setSelectCat("");
  //     setSelectedAvail(null);
  //     setQuery("");
  //   } catch (err) {
  //     const error = err as { message: string };

  //     setResults([]);
  //     setErrormessage(error.message);
  //   }
  // };
  const handleSearch = async (
    event?: React.MouseEvent<HTMLButtonElement> | string
  ) => {
    const q = typeof event === "string" ? event : query; // if string, use it, else use state
    if (!q.trim()) return;

    try {
      const data = await searchProfiles(q);
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms delay

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch suggestions whenever debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // pass the JWT token if your backend needs authentication
        // const token = localStorage.getItem("token") || "";
        const data = await suggestProfilesAPI(debouncedQuery);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  //autocomplete feature // To fetch suggestions as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // only update the query, debouncedQuery handles API call
  };
  return (
    <>
      <Navbar></Navbar>
      <div className={styles.exploreContainer}>
        <section className={styles.topSection}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <h1>Search here</h1>
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
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(s); // set input to clicked suggestion
                        setShowSuggestions(false); // hide dropdown
                        handleSearch(); // trigger search with the selected keyword
                      }}
                      className={styles.suggestionItem} // optional: add hover styling
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Category Dropdown */}
            <div className={styles.categorySection}>
              <div ref={categoryRef} className={styles.dropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => setDropDownOpen(!dropdownOpen)}
                >
                  <span className={styles.selectedText}>
                    {selectedCat || "Select Category"}
                  </span>

                  {/* Clear button shows only when a category is selected */}
                  {/* Clear button shows only when a category is selected */}
                  {selectedCat && (
                    <span
                      className={styles.clearBtn}
                      onClick={async (e) => {
                        e.stopPropagation(); // prevent dropdown toggle
                        setSelectCat("");
                        setQuery("");
                        setSelectedAvail(null);
                        setSearchPerformed(false);
                        // fetch top profiles again
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
                      }}
                    >
                      <img
                        src="/src/assets/clear.png"
                        alt="clear"
                        className={styles.clearIcon}
                      />
                    </span>
                  )}
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
                  {/* Clear button shows only when an availability is selected */}
                  {selectedAvail && (
                    <span
                      className={styles.clearBtn}
                      onClick={async (e) => {
                        e.stopPropagation(); // prevent dropdown toggle
                        setSelectedAvail(null);
                        setQuery("");
                        setSelectCat("");
                        setSearchPerformed(false);
                        // fetch top profiles again
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
                        // Add this line
                      }}
                    >
                      <img
                        src="/src/assets/clear.png"
                        alt="clear"
                        className={styles.clearIcon}
                      />
                    </span>
                  )}
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
          </div>

          {/* Suggestions */}
          <div className={styles.suggestionContainer}>
            <h3>Trending</h3>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("javascript");
              }}
            >
              JavaScript
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("web design");
              }}
            >
              Web Design
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("cloud");
              }}
            >
              Cloud
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("devops");
              }}
            >
              DevOps
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("ui/ux");
              }}
            >
              UI/UX
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("frontend");
              }}
            >
              Frontend
            </span>
            <span
              className={styles.suggestionItems}
              onClick={() => {
                handleSearch("backend");
              }}
            >
              Backend
            </span>
          </div>

          <div className={styles.resultCounter}>
            {searchPerformed &&
              (noResults ? (
                <p>No results found</p>
              ) : (
                <p>
                  {results.length}{" "}
                  {results.length === 1 ? "profile" : "profiles"} found for your
                  search
                </p>
              ))}
          </div>
        </section>

        {/* Results Section */}
        <section className={styles.bottomSection}>
          <div className={styles.resultContainer}>
            {results.map((profile) => (
              <div
                className={styles.resultsCard}
                key={profile._id}
                onClick={() => navigate(`/getprofile/${profile.userId._id}`)}
              >
                <div className={styles.avatarSection}>
                  <img src={profile.avatar} alt="profile avatar" />
                </div>

                <div className={styles.detailsSection}>
                  <div className={styles.nameWithTitle}>
                    <h2 className={styles.detailName}>
                      {profile.userId.fullname}
                    </h2>
                    {profile.experience && profile.experience.length > 0 && (
                      <span className={styles.jobTitle}>
                        {profile.experience[profile.experience.length - 1]
                          .endYear === "Present"
                          ? `${
                              profile.experience[profile.experience.length - 1]
                                .title
                            }`
                          : profile.experience[profile.experience.length - 1]
                              .title}
                      </span>
                    )}
                  </div>

                  <div className={styles.addressAvailContainer}>
                    {profile.location && (
                      <span className={styles.address}>
                        <img src="/src/assets/location.png"></img>
                        <div>
                          {profile.location.length > 15 ? (
                            profile.location
                              .split(", ")
                              .map((part, idx) => (
                                <p key={idx}>{part.trim()}</p>
                              ))
                          ) : (
                            <p>{profile.location}</p>
                          )}
                        </div>
                      </span>
                    )}
                    {profile.availability && (
                      <span className={styles.Avail}>
                        <img src="/src/assets/calendar.png"></img>
                        <p style={{ textAlign: "right" }}>
                          {" "}
                          {profile.availability.filter(Boolean).length}{" "}
                          days/week
                        </p>
                      </span>
                    )}
                  </div>
                  {profile.bio && (
                    <p className={styles.profileBio}>
                      {profile.bio.split(" ").slice(0, 15).join(" ") +
                        (profile.bio.split(" ").length > 6 ? "..." : "")}
                    </p>
                  )}

                  <div className={styles.skillContainer}>
                    {profile.skills.slice(0, 6).map((skill) => (
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

                  {/* <button
                    className={styles.viewProfile}
                    onClick={() =>
                      navigate(`/getprofile/${profile.userId._id}`)
                    }
                  >
                    View Profile
                  </button> */}
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
