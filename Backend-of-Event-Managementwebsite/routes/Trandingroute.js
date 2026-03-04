import express from "express";
import {Trendingmodel} from "../models/Schema.js"
import multer from "multer";
import fs from 'fs';

const router = express.Router()

router.post("/", multer().single("images"), async (req, res) => {
    try {
        const { designername, location } = req.body;
        const image = req.file;

        console.log(designername, location, image);

        if (!designername || !location || !image) {
            return res.status(400).json({ message: "All fields required" });
        }

        // ⭐ small improvement: unique filename
        const filename = Date.now() + "-" + image.originalname;

        fs.writeFile(`./uploads/${filename}`, image.buffer, (err) => {
            if (err) {
                console.error("Error saving file:", err);
                return res.status(500).json({ error: "Failed to save image" });
            }
        });

        let imagePath = `http://localhost:3000/uploads/${filename}`;

        const trendingdata = new Trendingmodel({
            designername,
            location,
            image: imagePath
        });

        await trendingdata.save();

        res.status(200).json({
            message: "Trending designer added successfully",
            designername,
            location,
            image: imagePath
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add designer" });
    }
});

router.get("/",async  (req,res) => {
    let trendingdata = await Trendingmodel.find()
    res.status(200).json(trendingdata)
}
)

export default router