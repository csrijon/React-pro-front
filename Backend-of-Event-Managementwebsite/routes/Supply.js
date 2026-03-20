import express from "express"
import { Categorymodel } from "../models/Schema.js"

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoriesdata = await Categorymodel.find()
    console.log(categoriesdata)
    res.status(200).json(categoriesdata)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.delete("/:id", async (req, res) => {

  try {
    let getid = req.params.id;
    console.log(getid)
    await Categorymodel.findByIdAndDelete(getid)
    res.status(200).json({ mess: "delete suppplycard", getid })
  } catch (error) {
    res.status(500).json({ mess: "key is not matching" })
  }
}
)

export default router;