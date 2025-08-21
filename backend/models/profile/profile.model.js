import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    avatar: { type: String },
    location: { type: String },
    bio: { type: String },

    skills: [{ type: String }],

    availability: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false],
    },

    contact: {
      email: { type: String },
      github: { type: String },
      linkedin: { type: String },
    },

    qualifications: [
      {
        title: { type: String, required: true },
        institute: { type: String },
        year: { type: String },
      },
    ],

    experience: [
      {
        title: { type: String, required: true },
        company: { type: String },
        startYear: { type: String },
        endYear: { type: String }, // "Present" or year
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);
ProfileSchema.index({
  name: "text",
  bio: "text",
  skills: "text",
  location: "text",
  "experience.title": "text",
  "experience.company": "text",
});
export default mongoose.model("Profile", ProfileSchema);
