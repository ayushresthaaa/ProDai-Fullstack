import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getProfile, createOrUpdateProfile } from "../../../shared/config/api";
import "./profileForm.css";
import { ProfessionalNavbar } from "../../../components/ui/navbar/ProNavbar";

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

type Contact = {
  email?: string;
  github?: string;
  linkedin?: string;
};

type ProfileFormData = {
  avatar?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  availability?: boolean[];
  contact?: Contact;
  qualifications?: Qualification[];
  experience?: Experience[];
};

export const ProfileForm = () => {
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      skills: [],
      availability: Array(7).fill(false),
      contact: {},
      qualifications: [{ title: "" }],
      experience: [{ title: "" }],
    },
  });

  const {
    fields: qualFields,
    append: appendQual,
    remove: removeQual,
  } = useFieldArray({
    control,
    name: "qualifications",
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        reset({
          avatar: data.avatar || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills || [],
          availability: data.availability || Array(7).fill(false),
          contact: data.contact || {},
          qualifications: data.qualifications?.length
            ? data.qualifications
            : [{ title: "" }],
          experience: data.experience?.length
            ? data.experience
            : [{ title: "" }],
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [reset]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Upload avatar to Cloudinary
  const uploadAvatar = async (): Promise<string | undefined> => {
    if (!avatarFile) return profile?.avatar;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", avatarFile);
    formData.append("upload_preset", "profile_upload"); // your unsigned preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgvhwxtqp/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      console.log("Cloudinary upload response:", data);
      return data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const avatarUrl = await uploadAvatar();
      const payload: ProfileFormData = { ...data, avatar: avatarUrl };

      // Remove empty optional fields
      if (!payload.skills?.length) delete payload.skills;
      if (!payload.availability?.length) delete payload.availability;
      if (payload.contact && Object.keys(payload.contact).length === 0)
        delete payload.contact;
      if (payload.qualifications?.every((q) => !q.title))
        delete payload.qualifications;
      if (payload.experience?.every((e) => !e.title)) delete payload.experience;

      const response = await createOrUpdateProfile(payload);
      alert("Profile saved successfully!");
      console.log("Profile update response:", response);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Check console.");
    }
  };

  return (
    <>
      <ProfessionalNavbar />
      <div className="profile-form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          <h2>Edit Profile</h2>

          {/* Avatar Upload */}
          <div className="form-group">
            <label>Avatar</label>
            <input type="file" onChange={handleAvatarChange} />
            {uploading && <p>Uploading...</p>}
            {profile?.avatar && !avatarFile && (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="avatar-preview"
              />
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              {...register("location")}
              placeholder={profile?.location || "City, Country"}
              className={`form-input ${errors.location ? "error" : ""}`}
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Bio</label>
            <textarea
              {...register("bio")}
              placeholder={profile?.bio || "Tell us about yourself..."}
              className={`form-textarea ${errors.bio ? "error" : ""}`}
              rows={4}
            />
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              {...register("skills", {
                setValueAs: (v) =>
                  typeof v === "string" ? v.split(",").map((s) => s.trim()) : v,
              })}
              placeholder={
                profile?.skills?.join(", ") || "JavaScript, React, Node.js"
              }
              className={`form-input ${errors.skills ? "error" : ""}`}
            />
          </div>

          {/* Availability */}
          <div className="form-group">
            <label>Availability</label>
            <div className="availability-grid">
              {Array.from({ length: 7 }, (_, i) => (
                <label key={i}>
                  <input type="checkbox" {...register(`availability.${i}`)} />
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="form-group">
            <label>Email</label>
            <input
              {...register("contact.email", {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              placeholder={profile?.contact?.email || "your.email@example.com"}
              className={`form-input ${errors.contact?.email ? "error" : ""}`}
            />
          </div>
          <div className="form-group">
            <label>GitHub</label>
            <input
              {...register("contact.github")}
              placeholder={
                profile?.contact?.github || "https://github.com/username"
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              {...register("contact.linkedin")}
              placeholder={
                profile?.contact?.linkedin || "https://linkedin.com/in/username"
              }
              className="form-input"
            />
          </div>

          {/* Qualifications */}
          <h3>Qualifications</h3>
          {qualFields.map((field, index) => (
            <div key={field.id} className="field-group">
              <input
                {...register(`qualifications.${index}.title`)}
                placeholder={
                  profile?.qualifications?.[index]?.title ||
                  "Degree / Certificate"
                }
              />
              <input
                {...register(`qualifications.${index}.institute`)}
                placeholder={
                  profile?.qualifications?.[index]?.institute || "Institute"
                }
              />
              <input
                {...register(`qualifications.${index}.year`)}
                placeholder={profile?.qualifications?.[index]?.year || "Year"}
              />
              <button type="button" onClick={() => removeQual(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendQual({ title: "" })}>
            Add Qualification
          </button>

          {/* Experience */}
          <h3>Experience</h3>
          {expFields.map((field, index) => (
            <div key={field.id} className="field-group">
              <input
                {...register(`experience.${index}.title`)}
                placeholder={profile?.experience?.[index]?.title || "Job Title"}
              />
              <input
                {...register(`experience.${index}.company`)}
                placeholder={profile?.experience?.[index]?.company || "Company"}
              />
              <input
                {...register(`experience.${index}.startYear`)}
                placeholder={
                  profile?.experience?.[index]?.startYear || "Start Year"
                }
              />
              <input
                {...register(`experience.${index}.endYear`)}
                placeholder={
                  profile?.experience?.[index]?.endYear || "End Year"
                }
              />
              <textarea
                {...register(`experience.${index}.description`)}
                placeholder={
                  profile?.experience?.[index]?.description || "Description"
                }
              />
              <button type="button" onClick={() => removeExp(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendExp({ title: "" })}>
            Add Experience
          </button>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit">Save Profile</button>
          </div>
        </form>
      </div>
    </>
  );
};
