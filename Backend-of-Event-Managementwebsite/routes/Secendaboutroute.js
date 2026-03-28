import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { Aboutblock1Model } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("Image"), async (req, res) => {
  try {
    const { title, blockpara1, blockpara2 } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const aboutblock1data = new Aboutblock1Model({
      title: title,
      blockpara1: blockpara1,
      blockpara2: blockpara2,
      Image: imageUrl
    });

    await aboutblock1data.save();

    res.status(200).json({
      message: "Data saved",
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    let aboutblock1data = await Aboutblock1Model.find();
    res.status(200).json(aboutblock1data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;