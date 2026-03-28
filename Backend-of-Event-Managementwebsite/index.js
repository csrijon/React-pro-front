import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import multer from "multer"
import mongoose from "mongoose"
import fs from "fs"
import mailsender from "./routes/mailsender.js"
import supply from "./routes/Supply.js"
import Venueadd from "./routes/Venueadd.js"
import Mediaroute from "./routes/Mediaroute.js"
import PopularVenu from "./routes/PopulerVenu.js"
import Trandingroute from "./routes/Trandingroute.js"
import Photographvideoroute from "./routes/Photographvideoroute.js"
import FeaturedVideosroute from "./routes/FeaturedVideosroute.js"
import Category from "./routes/Category.js"
import Aboutroute from "./routes/Aboutroute.js"
import Thirdabouteroute from "./routes/Thirdabouteroute.js"
import Secendaboutroute from "./routes/Secendaboutroute.js"
import Statistics from "./routes/Statistics.js"
import Searchquery from "./routes/Searchquery.js"
import { Categorymodel, Venuemodel } from "./models/Schema.js";
dotenv.config()


const app = express()
const port = 3000
app.use("/uploads", express.static('uploads'));
app.use(cors({ origin: "https://event-management-gamma-two.vercel.app/" }))
app.use(express.json())
app.use("/api/mailsend", mailsender)
app.use("/api/fetchtreding", Trandingroute)
app.use("/apitrending", Trandingroute)
app.use("/trending", Trandingroute)
app.use("/supplyers", supply)
app.use("/venueadd", Venueadd)
app.use("/addcategory", Category)
app.use("/search", Searchquery)
app.use("/addaboutmain", Aboutroute)
app.use("/api/fetchaboutblock2", Thirdabouteroute)
app.use("/addaboutblock2", Thirdabouteroute)
app.use("/api/fetchaboutmain", Aboutroute)
app.use("/addaboutstats", Statistics)
app.use("/addaboutblock1", Secendaboutroute)
app.use("/api/fetchaboutblock1", Secendaboutroute)
app.use("/api/fetchaboutstats", Statistics)
app.use("/api/fetbrowcategory", Category)
app.use("/deletecategory", Category);
app.use("/featuredvideo", FeaturedVideosroute)
app.use("/apifeaturedvideo", FeaturedVideosroute)
app.use("/videophotographer", Photographvideoroute)
app.use("/apivideophotographer", Photographvideoroute)
app.use("/popvenue", PopularVenu)
app.use("/api/fetchvenu", PopularVenu)
app.use("/removepopular", PopularVenu)
app.use("/Addmedia", Mediaroute)
app.use("/fetchmedia", Mediaroute)
app.use("/deletesupply", supply)
app.use("/pvdeleted", Photographvideoroute)
app.use("/mediadelete", Mediaroute)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('mongodb is Connected!'))


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
    let imagePath = `https://backend-ofevent.onrender.com/uploads/${Image.originalname}`
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
app.get("/api/venue", async (req, res) => {
    try {
        const venuedata = await Venuemodel.find();
        console.log(venuedata)
        res.status(200).json(venuedata);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch venues" });
    }
});
app.listen(port, () => {
    console.log(`app is listen ${port} number `)
})