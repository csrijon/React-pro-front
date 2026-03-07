import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { BrowsebycategoryModel } from "../models/Schema.js"

const router = express.Router();

router.post("/", multer().single("categoryImage"), async (req, res) => {
    try {
        const { categoryName } = req.body;
        const categoryImage = req.file;
        console.log(categoryName, categoryImage);
        let filename = Date.now() + "-" + categoryImage.originalname
        fs.writeFileSync(`./uploads/${filename}`, categoryImage.buffer)
        let imagePath = `http://localhost:3000/uploads/${filename}`
        const browsecategorydata = new BrowsebycategoryModel({
            title: categoryName,
            Image: imagePath
        })
        await browsecategorydata.save()

        res.status(200).json({ message: "Category added successfully", categoryName, imagePath });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
})

router.get("/", async (req, res) => {
    try {
        let browsecategorydata = await BrowsebycategoryModel.find()
        console.log(browsecategorydata)
        res.status(200).json(browsecategorydata)
    }
    catch (error) {
        console.log(error, "data is missing")
        res.status(400).json({ mess: "data can not find" })
    }
}
)

export default router;