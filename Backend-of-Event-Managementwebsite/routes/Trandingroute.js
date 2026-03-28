import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { Trendingmodel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("images"), async (req, res) => {
  try {
    const { designername, location } = req.body;

    if (!designername || !location || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const trendingdata = new Trendingmodel({
      designername: designername,
      location: location,
      image: imageUrl
    });

    await trendingdata.save();

    res.status(200).json({
      message: "Trending designer added",
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
    let trendingdata = await Trendingmodel.find();
    res.status(200).json(trendingdata);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    let trendid = req.params.id;
    await Trendingmodel.findByIdAndDelete(trendid);

    res.status(200).json({ message: "Data deleted permanently" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;