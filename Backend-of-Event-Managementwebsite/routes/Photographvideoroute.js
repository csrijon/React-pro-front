import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { PhotographvideorouteModel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST
router.post("/", upload.single("videoimage"), async (req, res) => {
  try {
    const { videoname, videolocation } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const videophotographerdata = new PhotographvideorouteModel({
      videoname: videoname,
      videolocation: videolocation,
      videoimage: imageUrl
    });

    await videophotographerdata.save();

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
    let videophotographerdata = await PhotographvideorouteModel.find();
    res.status(200).json(videophotographerdata);
  } catch (error) {
    res.status(400).json({ mess: "Data not found" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    let pvid = req.params.id;
    await PhotographvideorouteModel.findByIdAndDelete(pvid);

    res.status(200).json({ mess: "Data deleted" });

  } catch (error) {
    res.status(500).json({ mess: "Delete failed" });
  }
});

export default router;