import express from "express"
import Categorymodel from "../models/Schema.js"

const router = express.Router();

router.get("/",async(req,res) => {
  try {
    const categoriesdata = await Categorymodel.find()
   console.log(categoriesdata)
   res.status(200).json(categoriesdata)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;