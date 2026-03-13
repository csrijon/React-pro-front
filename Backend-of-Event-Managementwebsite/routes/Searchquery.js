import express from "express";
const router = express.Router();
import { BrowsebycategoryModel } from "../models/Schema.js";


router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    console.log("Search query received:", category);

    const categorydata = await BrowsebycategoryModel.find({ title: category });

    if (categorydata.length === 0) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(categorydata);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});
export default router;