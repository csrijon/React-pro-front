
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Venuemodel } from "../models/Schema.js";


const router = express.Router();

router.post("/", multer().single("image"), async (req, res) => {
    try {
        const { venueTitle, location, rating, guests } = req.body;
        const image = req.file;
        console.log(venueTitle, location, rating, guests, image);
        fs.writeFile(`./uploads/${image.originalname}`, image.buffer, (err) => {
            if (err) {
                console.error("Error saving file:", err);
                return res.status(500).json({ error: "Failed to save image" });
            }
        });
        let imagePath = `http://localhost:3000/uploads/${image.originalname}`;
        const venuedata = new Venuemodel({
            venueTitle,
            location,
            rating,
            guests,
            image: imagePath
        })
        await venuedata.save()
        res.status(200).json({ message: "Venue added successfully", imagePath,venueTitle,location,rating,guests });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add venue" });
    }

});



export default router;