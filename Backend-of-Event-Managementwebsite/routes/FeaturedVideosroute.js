import express from "express";
import multer from "multer";
import fs from "fs"
import {featuredVideoModel} from "../models/Schema.js"

const router = express.Router();

router.post("/", multer().single("videoimage"), async (req, res) => {
    try {
        const { title } = req.body
        const videoimage = req.file
        console.log(title, videoimage)
        res.status(200).json({ mess: "data is save " })
        let filename = Date.now() + "-" + videoimage.originalname
        fs.writeFileSync(`./uploads/${filename}`, videoimage.buffer)
        let imagepath = `http://localhost:3000/uploads/${filename}`
        const featuredVideoData = new featuredVideoModel({
            title: title,
            thumbnail: imagepath
        })
        await featuredVideoData.save()
    }
    catch (error) {
        console.log(error, "showing error")
        res.status(400).json({ mess: "not working" })

    }

}
)

router.get("/", async (req, res) => {
    try {
        let featuredVideos = await featuredVideoModel.find()
        console.log(featuredVideos)
        res.status(200).json(featuredVideos)
    }
    catch (error) {
        console.log(error, "data is missing")
        res.status(400).json({ mess: "data can not find" })
    }
}
)

export default router