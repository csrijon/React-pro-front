import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { featuredVideoModel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("videoimage"), async (req, res) => {
  try {
    const { title } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const featuredVideoData = new featuredVideoModel({
      title: title,
      thumbnail: imageUrl
    });

    await featuredVideoData.save();

    res.status(200).json({
      message: "Featured video saved",
      imageUrl: imageUrl
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ mess: "Upload failed" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    let featuredVideos = await featuredVideoModel.find();
    res.status(200).json(featuredVideos);
  } catch (error) {
    res.status(400).json({ mess: "Data not found" });
  }
});

export default router;