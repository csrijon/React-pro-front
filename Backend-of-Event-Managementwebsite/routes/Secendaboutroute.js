import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Aboutblock1Model } from "../models/Schema.js"

const router = express.Router();

router.post("/", multer().single("Image"), async (req, res) => {
    try {
        const { title, blockpara1, blockpara2 } = req.body;
        const Image = req.file;
        console.log(title, blockpara1, blockpara2, Image);
        let filename = Date.now() + "-" + Image.originalname
        fs.writeFileSync(`./uploads/${filename}`, Image.buffer);
        let imagePath = `http://localhost:3000/uploads/${filename}`
        const aboutblock1data = new Aboutblock1Model({
            title: title,
            blockpara1: blockpara1,
            blockpara2: blockpara2,
            Image: imagePath
        });
        await aboutblock1data.save();
        res.status(200).json({ message: "Data received successfully" });
    }
    catch (error) {
        console.error("Error receiving data:", error);
        res.status(500).json({ error: "Failed to receive data" });
    }
}
)

router.get("/", async (req, res) => {
    try {
        let aboutblock1data = await Aboutblock1Model.find()
        console.log(aboutblock1data)
        res.status(200).json(aboutblock1data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }

})

export default router;