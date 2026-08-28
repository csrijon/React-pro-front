import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ─── ADDED FIELDS FOR SECURE PASSWORD RESET LIFE-CYCLE (OTP) ───
    // Removing 'default: undefined' ensures these fields simply don't exist
    // on a user document until a reset cycle is actively triggered.
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  },
);

export default mongoose.model("User", UserSchema);
