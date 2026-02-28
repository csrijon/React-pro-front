import express from "express"
import multer from "multer"
import fs from "fs/promises"
import { MediaModel } from "../models/Schema.js"
import path from "path"

const router = express.Router()

router.put("/", multer().single("image"), async (req, res) => {
    try {
        const { heading, discreption } = req.body
        const image = req.file
        let imgpath = path.join(process.cwd(), "uploads", image.originalname)
        await fs.writeFile(imgpath, image.buffer)

        let imagepaths = `http://localhost:3000/uploads/${image.originalname}`
        const Mediadata = MediaModel({
            heading: heading,
            discreption,
            image: imagepaths
        })
        await Mediadata.save()
        res.status(200).json({ mess: "data is save " })
    } catch (error) {
        console.log(error, "showing error")
        res.status(400).json({ mess: "not working" })
    }

})

router.get("/",async (req,res) => {
   try {
     let mediavalue = await MediaModel.find()
     console.log(mediavalue)
     res.status(200).json(mediavalue)
   } catch (error) {
    console.log(error,"data is missing")
    res.status(400).json({mess:"data can not find"})
   }
}
)
export default router