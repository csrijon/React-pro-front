import express from "express"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

router.post("/", (req, res) => {
    const { name, number, email, msg } = req.body
    console.log(name, number, email, msg)
    res.json({
        success: true,
        message: "data is ok"
    })
}
)


export default router