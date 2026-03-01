import express from "express";
import Trendingmodel from "../models/Schema.js"
import multer from "multer";

const router = express.Router()

router.post("/", multer().single("images"), async (req, res) => {
    try {
        const { designername, location } = req.body
        const image = req.file

        if (!designername || !location || !image) {
            return res.status(400).json({ message: "All fields required" })
        }

        const imageUrl = `http://localhost:3000/uploads/${image.filename}`

        // Example database object (replace with MongoDB save)
        const newData = await Trendingmodel.create({
            designername,
            location,
            image: imageUrl
        })

        console.log(data)

        res.status(200).json({
            success: true,
            message: "Trending designer added",
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router