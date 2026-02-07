import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import multer from "multer"
import fs from "fs"
import mailsender from "./routes/mailsender.js"
import supply from "./routes/Supply.js"
import Categorymodel from "./models/Schema.js"
dotenv.config()


const app = express()
const port = 3000
app.use("/uploads", express.static('uploads'));
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use("/api/mailsend", mailsender)
app.use("/supplyers", supply)

app.get("/", (req, res) => {
    res.send("hello i am server can i run in broswer")
})
app.post("/supplyers", multer().single("Image"), async (req, res) => {
    const { newCategory } = req.body;
    const Image = req.file;
    fs.writeFile(`./uploads/${Image.originalname}`, Image.buffer, (err) => {
        if (err) {
            console.error("Error saving file:", err);
            return res.status(500).json({ error: "Failed to save image" });
        }
    });
    let imagePath = `http://localhost:3000/uploads/${Image.originalname}`
    const categorydata = new Categorymodel({
        title: newCategory,
        Image: imagePath
    })
    await categorydata.save()
    console.log(Categorymodel.collection.name);

    console.log(categorydata)
    console.log("file is saved successfully")
    res.status(200).json({ message: "Category added successfully", newCategory, Image });
})
app.listen(port, () => {
    console.log(`app is listen ${port} number `)
})