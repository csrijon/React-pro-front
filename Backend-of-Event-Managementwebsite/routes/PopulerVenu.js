import express from "express"
import multer from "multer"
import fs from "fs"
import { PopularVenuModel } from "../models/Schema.js"

const router = express.Router()

router.post("/", multer().single("popimage"), async (req,res) => {

  try{

    const {popular, poplocation} = req.body
    const popimage = req.file

    if(!popular || !poplocation || !popimage){
      return res.status(400).json({message:"All fields required"})
    }

    const filename = Date.now() + "-" + popimage.originalname

    fs.writeFileSync(`./uploads/${filename}`, popimage.buffer)

    let imagePath = `http://localhost:3000/uploads/${filename}`

    let popularvenue = new PopularVenuModel({
        venuename: popular,
        location: poplocation,
        image: imagePath
    })

    await popularvenue.save()

    res.json({
      message:"data accepted",
      popular,
      poplocation
    })

  }catch(error){
    console.log(error)
    res.status(500).json({error:"server error"})
  }

})

router.get("/", async (req,res) => {
    try {
        let popularvenues = await PopularVenuModel.find()
        res.status(200).json(popularvenues)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "server error" })
    }
})

router.delete("/:id",(req,res) => {
  
}
)

export default router