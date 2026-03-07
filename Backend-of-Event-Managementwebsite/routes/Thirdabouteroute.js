import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Aboutblock2Model } from "../models/Schema.js"

const router = express.Router();

router.post("/", multer().single('Image'), async (req, res) => {
    try {
        const { blockpara1, blockpara2, title } = req.body;
        let image = req.file
        console.log(blockpara1, blockpara2, title, image)
        let filename = Date.now() + "-" + image.originalname
        fs.writeFile(`./uploads/${filename}`, image.buffer, (err) => {
            if (err) {
                console.error("Error saving file:", err);
                return res.status(500).json({ error: "Failed to save image" });
            }
        });
        let imagePath = `http://localhost:3000/uploads/${filename}`
        const aboutblock2data = new Aboutblock2Model({
            title: title,
            blockpara1: blockpara1,
            blockpara2: blockpara2,
            Image: imagePath
        })
        await aboutblock2data.save()
        res.status(200).json({ mess: "data is save " })
    }
    catch (error) {
        console.log(error, "showing error")
        res.status(400).json({ mess: "not working" })
    }
}
)

router.get("/", async (req, res) => {
    try {
        let aboutblock2data = await Aboutblock2Model.find()
        console.log(aboutblock2data)
        res.status(200).json(aboutblock2data)
    }
    catch (error) {
        console.log(error, "data is missing")
        res.status(400).json({ mess: "data can not find" })
    }
}
)

export default router;