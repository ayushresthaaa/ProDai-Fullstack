import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById } from "../../../shared/config/api";
import "./viewProfile.css";
import { Navbar } from "../../../components/ui/navbar/Navbar";
import { Footer } from "../../../components/ui/footer/Footer";

type Contact = {
  email?: string;
  github?: string;
  linkedin?: string;
};

type Qualification = {
  title: string;
  institute?: string;
  year?: string;
};

type Experience = {
  title: string;
  company?: string;
  startYear?: string;
  endYear?: string;
  description?: string;
};

type User = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  usertype: string;
};

type ProfileData = {
  userId: User;
  avatar?: string;
  location?: string;
  bio?: string;
  skills: string[];
  availability: boolean[];
  contact?: Contact;
  qualifications: Qualification[];
  experience: Experience[];
  workMode: string;
  employmentType: string;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ViewProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const data = await getProfileById(userId);
        setProfile(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="loading-container">Loading profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="error-container">{error || "Profile not found"}</div>
        </div>
        <Footer />
      </>
    );
  }

  const availableDays = profile.availability.filter(Boolean).length;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Professional Back Button */}
        <div className="back-btn" onClick={handleBackClick}>
          ← Back
        </div>

        <div className="profile-main">
          {/* Left Sidebar */}
          <div className="profile-left">
            {/* Main Profile Card */}
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {profile.avatar && !profile.avatar.includes("example.com") ? (
                    <img src={profile.avatar} alt="Profile Avatar" />
                  ) : (
                    <img
                      src="/icons/user.png"
                      alt="Default Avatar"
                      className="avatar-placeholder"
                    />
                  )}
                </div>
                <h1 className="profile-name">{profile.userId.fullname}</h1>
                {/* Latest Job Title */}
                {profile.experience && profile.experience.length > 0 && (
                  <span className="latest-job-title">
                    {
                      profile.experience.sort((a, b) => {
                        // Sort by start year descending (most recent first)
                        const yearA = parseInt(a.startYear || "0");
                        const yearB = parseInt(b.startYear || "0");
                        return yearB - yearA;
                      })[0].title
                    }
                  </span>
                )}
                {profile.location && (
                  <div className="profile-address">
                    {/* <img
                      src="/icons/location.png"
                      alt="Location"
                      className="icon-small"
                    /> */}
                    {profile.location}
                  </div>
                )}
              </div>

              {profile.bio && (
                <div className="bio-section">
                  <p className="bio-content">{profile.bio}</p>
                </div>
              )}
            </div>
            {profile.skills.length > 0 && (
              <div className="profile-card skills-section">
                <h3>Skills & Expertise</h3>
                <div className="skill-collection">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Weekly Availability Card */}
            <div className="profile-card accessibility-section">
              <h2>Weekly Availability</h2>
              <div className="week-calendar">
                {profile.availability.map((isAvailable, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${isAvailable ? "active" : ""}`}
                  >
                    {weekdays[index]}
                  </div>
                ))}
              </div>
              {availableDays > 0 && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "16px",
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: "500",
                  }}
                >
                  Available {availableDays}{" "}
                  {availableDays === 1 ? "day" : "days"} per week
                </p>
              )}
            </div>

            {/* Skills Card */}
          </div>

          {/* Right Content Area */}
          <div className="profile-right">
            {/* Experience Section */}
            {profile.experience?.length > 0 && (
              <div className="profile-card experience-section">
                <h2>Professional Experience</h2>
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="exp-item">
                    <h3 className="item-title">{exp.title}</h3>
                    {exp.company && (
                      <p className="item-subtitle">
                        {exp.company}
                        {(exp.startYear || exp.endYear) && (
                          <span>
                            {" • "}
                            {exp.startYear}
                            {exp.endYear && ` - ${exp.endYear}`}
                            {!exp.endYear && " - Present"}
                          </span>
                        )}
                      </p>
                    )}
                    {exp.description && (
                      <p className="item-description">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {profile.qualifications?.length > 0 && (
              <div className="profile-card qualifications-section">
                <h2>Qualifications</h2>
                {profile.qualifications.map((qual, idx) => (
                  <div key={idx} className="edu-item">
                    <h3 className="item-title">{qual.title}</h3>
                    {(qual.institute || qual.year) && (
                      <p className="item-subtitle">
                        {qual.institute}
                        {qual.institute && qual.year && " • "}
                        {qual.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Work Preferences Section */}
            <div className="profile-card work-preferences-section">
              <h2 style={{ fontSize: "18px", fontWeight: 500 }}>
                Work Preferences
              </h2>
              {profile.employmentType && (
                <p className="preference-item">
                  <strong>Employment Type:</strong> {profile.employmentType}
                </p>
              )}
              {profile.workMode && (
                <p className="preference-item">
                  <strong>Work Mode:</strong> {profile.workMode}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="profile-card contact-section">
              <h2>Contact Information</h2>

              {/* Always show email from user data */}
              <div className="contact-item">
                <img
                  src="/src/assets/email.png"
                  alt="Email"
                  className="icon-small"
                />
                <span className="contact-text">{profile.userId.email}</span>
              </div>

              {/* Additional contact info if available */}
              {profile.contact?.email &&
                profile.contact.email !== profile.userId.email && (
                  <div className="contact-item">
                    <img
                      src="/src/assets/email.png"
                      alt="Email"
                      className="icon-small"
                    />
                    <span className="contact-text">
                      {profile.contact.email}
                    </span>
                  </div>
                )}

              {profile.contact?.github && (
                <div className="contact-item">
                  <img
                    src="/src/assets/github.png"
                    alt="GitHub"
                    className="icon-small"
                  />
                  <span className="contact-text">{profile.contact.github}</span>
                </div>
              )}

              {profile.contact?.linkedin && (
                <div className="contact-item">
                  <img
                    src="/src/assets/linkedin.png"
                    alt="LinkedIn"
                    className="icon-small"
                  />
                  <span className="contact-text">
                    {profile.contact.linkedin}
                  </span>
                </div>
              )}

              {/* Username as additional contact method */}
              <div className="contact-item">
                <img
                  src="/src/assets/user.png"
                  alt="Username"
                  className="icon-small"
                />
                <span className="contact-text">@{profile.userId.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
