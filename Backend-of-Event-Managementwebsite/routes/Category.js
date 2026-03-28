import express from "express";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { BrowsebycategoryModel } from "../models/Schema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("categoryImage"), async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    // Save to MongoDB
    const browsecategorydata = new BrowsebycategoryModel({
      title: categoryName,
      Image: imageUrl,
    });

    await browsecategorydata.save();

    res.status(200).json({
      message: "Category added successfully",
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    let browsecategorydata = await BrowsebycategoryModel.find();
    res.status(200).json(browsecategorydata);
  } catch (error) {
    res.status(400).json({ mess: "Data not found" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let finddata = await BrowsebycategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      mess: "Data deleted",
      finddata,
    });

  } catch (error) {
    res.status(500).json({ mess: "Data not found" });
  }
});

export default router;