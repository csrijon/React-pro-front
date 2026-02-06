import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import mongoose from "mongoose"
import mailsender from "./routes/mailsender.js"
dotenv.config()

const app = express()
const port = 3000
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use("/api/mailsend", mailsender)

mongoose.connect('mongodb://127.0.0.1:27017/EventDatabase')
    .then(() => console.log('mongodb is Connected!'));

app.get("/", (req, res) => {
    res.send("hello i am server can i run in broswer")
})
app.post("/supplyers",(req,res) => {
  const { newCategory, Image } = req.body;
  console.log(newCategory, Image);
  res.status(200).json({ message: "Category added successfully", newCategory, Image });
})
app.listen(port, () => {
    console.log(`app is listen ${port} number `)
})