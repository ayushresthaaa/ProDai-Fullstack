import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ViewProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const data = await getProfileById(userId);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-main">
          {/* Left Container */}
          <div className="profile-left">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {profile.avatar && !profile.avatar.includes("example.com") ? (
                    <img src={profile.avatar} alt="Avatar" />
                  ) : (
                    <span className="avatar-placeholder">👤</span>
                  )}
                </div>
                <h1 className="profile-name">{profile.userId.fullname}</h1>
                {profile.location && (
                  <h2 className="profile-address">{profile.location}</h2>
                )}
                {profile.bio && (
                  <div className="bio-section">
                    {/* <h3>Bio</h3> */}
                    <p className="bio-content">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Weekly Availability */}
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
              </div>

              {/* Skills */}
              <div className="skills-section">
                <h3>Skills</h3>
                <div className="skill-collection">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
            </div>
          </div>

          {/* Right Container */}
          <div className="profile-right">
            {/* Experience */}
            {profile.experience?.length > 0 && (
              <div className="profile-card experience-card experience-section">
                <h2>Experience</h2>
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="exp-item">
                    <h3 className="item-title">{exp.title}</h3>
                    <p className="item-subtitle">
                      {exp.company} • {exp.startYear}-{exp.endYear || "Present"}
                    </p>
                    <p className="item-description">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Qualifications */}
            {profile.qualifications?.length > 0 && (
              <div className="profile-card qualifications-section">
                <h2>Education</h2>
                {profile.qualifications.map((qual, idx) => (
                  <div key={idx} className="edu-item">
                    <h3 className="item-title">{qual.title}</h3>
                    {qual.institute && (
                      <p className="item-subtitle">
                        {qual.institute} • {qual.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contact Info (moved below Qualifications) */}
            <div className="profile-card contact-section">
              <h2>Contact</h2>
              {profile.contact?.email && (
                <div className="contact-item">
                  <span className="contact-icon">-</span>
                  <span className="contact-text">{profile.contact.email}</span>
                </div>
              )}
              {profile.contact?.github && (
                <div className="contact-item">
                  <span className="contact-icon"></span>
                  <span className="contact-text">{profile.contact.github}</span>
                </div>
              )}
              {profile.contact?.linkedin && (
                <div className="contact-item">
                  <span className="contact-icon"></span>
                  <span className="contact-text">
                    {profile.contact.linkedin}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
