import mongoose from "mongoose";

const AdditionalContentSchema = new mongoose.Schema(
  {
    type: String,
    value: String,
  },
  {
    _id: false,
  },
);

const AdditionalDetailSchema = new mongoose.Schema(
  {
    heading: String,
    contents: [AdditionalContentSchema],
  },
  {
    _id: false,
  },
);

/* =========================================
   ARTWORK SCHEMA
========================================= */
const ArtworkSchema = new mongoose.Schema(
  {
    title: String,
    images: [String],
  },
  {
    _id: false,
  },
);

/* =========================================
   TYPOGRAPHY SCHEMA PARAMETERS
========================================= */
const StructuralIssueSchema = new mongoose.Schema(
  {
    layer: String,
    msg: String,
  },
  {
    _id: false,
  },
);

const ResumeSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },

    name: String,
    email: String,
    phone: String,
    location: String,
    template: String,

    theme: {
      backgroundColor: String,
      textColor: String,
      fontFamily: {
        type: String,
        default: "'Inter', sans-serif",
      },
      // Integrated the structural typographic size and evaluation layers
      fontSizes: {
        layers: {
          title: { type: Number, default: 8 },
          subtitle: { type: Number, default: 6 },
          heading1: { type: Number, default: 5 },
          heading2: { type: Number, default: 4 },
          body: { type: Number, default: 2 },
        },
        scaleScore: { type: Number, default: 100 },
        structuralIssues: [StructuralIssueSchema],
      },
    },

    education: [
      {
        school: String,
        degree: String,
        duration: String,
      },
    ],

    skills: [String],

    projects: [
      {
        title: String,
        technologies: [String],
        link: { type: String, default: "" },
        description: String,
        image: String,
      },
    ],

    artworks: [ArtworkSchema],

    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],

    achievements: [String],
    additionalDetails: [AdditionalDetailSchema],

    socials: [
      {
        platform: String,
        link: String,
        display: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Resume", ResumeSchema);