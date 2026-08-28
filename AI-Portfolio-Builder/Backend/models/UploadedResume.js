import mongoose from "mongoose";

const UploadedResumeSchema = new mongoose.Schema(
  {
    // Links this uploaded portfolio version strictly to its authenticated creator account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Holds the complete, raw selectable text layer read from the PDF document
    rawResumeText: {
      type: String,
      default: "",
    },

    // Core Identity Identifiers
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    tagline: { type: String, default: "" },
    summary: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },

    links: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // AI Component Storage Array Blocks
    skills: [{ type: String }],
    skillGroups: [
      {
        category: { type: String },
        items: [{ type: String }],
      },
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        highlights: [{ type: String }],
        link: { type: String, default: "" },
      },
    ],
    experience: [
      {
        role: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String },
        highlights: [{ type: String }],
      },
    ],

    // MAJOR FIX: Upgraded from a flat string array to structured object maps for maximum yield
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        duration: { type: String, default: "" },
      },
    ],

    achievements: [{ type: String }],
    stats: [
      {
        value: { type: String },
        label: { type: String },
      },
    ],
    template: { type: String, default: "template1" },
    theme: {
      backgroundColor: { type: String, default: "#050816" },
      textColor: { type: String, default: "#f8f3ea" },
    },
  },
  { timestamps: true },
);

const UploadedResume =
  mongoose.models.UploadedResume ||
  mongoose.model("UploadedResume", UploadedResumeSchema);
export default UploadedResume;
