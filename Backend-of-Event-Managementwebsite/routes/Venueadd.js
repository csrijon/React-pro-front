import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { Venuemodel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { venueTitle, location, rating, guests } = req.body;

    if (!venueTitle || !location || !rating || !guests || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const venuedata = new Venuemodel({
      venueTitle: venueTitle,
      location: location,
      rating: rating,
      guests: guests,
      image: imageUrl
    });

    await venuedata.save();

    res.status(200).json({
      message: "Venue added successfully",
      imageUrl: imageUrl
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;