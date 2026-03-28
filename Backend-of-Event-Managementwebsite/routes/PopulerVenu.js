import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { PopularVenuModel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("popimage"), async (req, res) => {
  try {
    const { popular, poplocation } = req.body;

    if (!popular || !poplocation || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    let popularvenue = new PopularVenuModel({
      venuename: popular,
      location: poplocation,
      image: imageUrl
    });

    await popularvenue.save();

    res.status(200).json({
      message: "Popular venue added",
      imageUrl: imageUrl
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    let popularvenues = await PopularVenuModel.find();
    res.status(200).json(popularvenues);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    let popid = req.params.id;
    await PopularVenuModel.findByIdAndDelete(popid);

    res.status(200).json({ message: "Popular venue deleted" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;