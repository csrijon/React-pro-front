import express from "express";
import multer from "multer";
import fs from "fs"
import { PhotographvideorouteModel } from "../models/Schema.js";

const router = express.Router();

router.post("/", multer().single("videoimage"), async (req, res) => {
    try {
        const { videoname, videolocation} = req.body
        const videoimage = req.file
        console.log(videoname, videolocation, videoimage)
        res.status(200).json({ mess: "data is save " })
        let filename = Date.now() + "-" + videoimage.originalname
        fs.writeFileSync(`./uploads/${filename}`, videoimage.buffer)
        let imagepath = `http://localhost:3000/uploads/${filename}`
        const videophotographerdata = new PhotographvideorouteModel({
            videoname: videoname,
            videolocation: videolocation,
            videoimage: imagepath
        })
        await videophotographerdata.save()
    } catch (error) {
        console.log(error, "showing error")
        res.status(400).json({ mess: "not working" })
    }

})

router.get("/", async (req, res) => {
    try {
        let videophotographerdata = await PhotographvideorouteModel.find()
        console.log(videophotographerdata)
        res.status(200).json(videophotographerdata)
    }
    catch (error) {
        console.log(error, "data is missing")
        res.status(400).json({ mess: "data can not find" })
    }
}
)

router.delete("/:id", async (req,res) => {
  try {
    let pvid = req.params.id
    console.log(pvid)
    await PhotographvideorouteModel.findByIdAndDelete(pvid)
    res.status(200).json({mess:"data is remove from pv model"})
  } catch (error) {
    res.status(500).json({mess:"data is not delete from pv model"})
  }
}
)

export default router
