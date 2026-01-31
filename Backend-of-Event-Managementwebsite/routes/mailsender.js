import express from "express"
import dotenv from "dotenv"
dotenv.config()

const router = express()

router.get("/",(req,res) => {
  res.send("all is done now")
}
)


export default router