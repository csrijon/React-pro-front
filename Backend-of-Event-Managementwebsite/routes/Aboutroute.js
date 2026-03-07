import express from  "express";
import multer  from "multer";
import fs from "fs"
import {AboutmainModel} from "../models/Schema.js"

const router = express.Router();

router.post("/", multer().single("mainImage"), async (req, res) => {
    try {
        const { title, para1, para2 } = req.body;
    const mainImage = req.file;
    console.log(title, para1, para2, mainImage);
    let filename = Date.now() + "-" + mainImage.originalname
    fs.writeFileSync(`./uploads/${
        filename
    }`, mainImage.buffer)
    let imagePath = `http://localhost:3000/uploads/${filename}`
    const aboutmaindata = new AboutmainModel({
        title: title,
        para1: para1,
        para2: para2,
        mainImage: imagePath
    });
    await aboutmaindata.save();
    res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

router.get("/", async (req, res) => {
    try {
        let aboutmaindata = await AboutmainModel.find()
        res.status(200).json(aboutmaindata);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

export default router;