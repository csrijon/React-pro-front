import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { Aboutblock2Model } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("Image"), async (req, res) => {
  try {
    const { blockpara1, blockpara2, title } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const aboutblock2data = new Aboutblock2Model({
      title: title,
      blockpara1: blockpara1,
      blockpara2: blockpara2,
      Image: imageUrl
    });

    await aboutblock2data.save();

    res.status(200).json({
      message: "Data saved",
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
    let aboutblock2data = await Aboutblock2Model.find();
    res.status(200).json(aboutblock2data);
  } catch (error) {
    res.status(400).json({ mess: "Data not found" });
  }
});

export default router;