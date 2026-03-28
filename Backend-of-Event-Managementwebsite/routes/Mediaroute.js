import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { MediaModel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PUT - Upload Media
router.put("/", upload.single("image"), async (req, res) => {
  try {
    const { heading, discreption } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const Mediadata = new MediaModel({
      heading: heading,
      discreption: discreption,
      image: imageUrl
    });

    await Mediadata.save();

    res.status(200).json({
      mess: "Media saved",
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
    let mediavalue = await MediaModel.find();
    res.status(200).json(mediavalue);
  } catch (error) {
    res.status(400).json({ mess: "Data not found" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    let mediaid = req.params.id;
    await MediaModel.findByIdAndDelete(mediaid);

    res.status(200).json({ mess: "Media deleted" });

  } catch (error) {
    res.status(500).json({ mess: "Delete failed" });
  }
});

export default router;