import express from "express"
import multer from "multer"

const router = express.Router()

router.post("/", multer().single("popimage"), (req,res) => {

  const {popular, poplocation} = req.body
  const popimage = req.file

  console.log(popular, poplocation, popimage)

  res.json({
    mess:"data accepted",
    popular,
    poplocation
  })
})

export default router