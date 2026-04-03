import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import mailsender from "./routes/mailsender.js";
import supply from "./routes/Supply.js";
import Venueadd from "./routes/Venueadd.js";
import Mediaroute from "./routes/Mediaroute.js";
import PopularVenu from "./routes/PopulerVenu.js";
import Trandingroute from "./routes/Trandingroute.js";
import Photographvideoroute from "./routes/Photographvideoroute.js";
import FeaturedVideosroute from "./routes/FeaturedVideosroute.js";
import Category from "./routes/Category.js";
import Aboutroute from "./routes/Aboutroute.js";
import Thirdabouteroute from "./routes/Thirdabouteroute.js";
import Secendaboutroute from "./routes/Secendaboutroute.js";
import Statistics from "./routes/Statistics.js";
import Searchquery from "./routes/Searchquery.js";
import { Categorymodel, Venuemodel } from "./models/Schema.js";
import cloudinary from "./routes/cloudinary.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({ origin: "https://event-management-gamma-two.vercel.app" }));
app.use(express.json());

// Multer memory storage (for Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.use("/api/mailsend", mailsender);
app.use("/api/fetchtreding", Trandingroute);
app.use("/apitrending", Trandingroute);
app.use("/trending", Trandingroute);
app.use("/supplyers", supply);
app.use("/venueadd", Venueadd);
app.use("/addcategory", Category);
app.use("/search", Searchquery);
app.use("/addaboutmain", Aboutroute);
app.use("/api/fetchaboutblock2", Thirdabouteroute);
app.use("/addaboutblock2", Thirdabouteroute);
app.use("/api/fetchaboutmain", Aboutroute);
app.use("/addaboutstats", Statistics);
app.use("/addaboutblock1", Secendaboutroute);
app.use("/api/fetchaboutblock1", Secendaboutroute);
app.use("/api/fetchaboutstats", Statistics);
app.use("/api/fetbrowcategory", Category);
app.use("/deletecategory", Category);
app.use("/featuredvideo", FeaturedVideosroute);
app.use("/apifeaturedvideo", FeaturedVideosroute);
app.use("/videophotographer", Photographvideoroute);
app.use("/apivideophotographer", Photographvideoroute);
app.use("/popvenue", PopularVenu);
app.use("/api/fetchvenu", PopularVenu);
app.use("/removepopular", PopularVenu);
app.use("/Addmedia", Mediaroute);
app.use("/fetchmedia", Mediaroute);
app.use("/deletesupply", supply);
app.use("/pvdeleted", Photographvideoroute);
app.use("/mediadelete", Mediaroute);

// MongoDB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Upload to Cloudinary
app.post("/supplyers", upload.single("Image"), async (req, res) => {
  try {
    const { newCategory } = req.body;

    const result = await cloudinary.uploader.upload(
      "data:image/png;base64," + req.file.buffer.toString("base64"),
      { folder: "event-management" }
    );

    const imageUrl = result.secure_url;

    const categorydata = new Categorymodel({
      title: newCategory,
      Image: imageUrl,
    });

    await categorydata.save();

    res.status(200).json({
      message: "Category added",
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Fetch venue
app.get("/api/venue", async (req, res) => {
  try {
    const venuedata = await Venuemodel.find();
    res.status(200).json(venuedata);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

app.get("/testcloud", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );
    res.send("Cloudinary Working");
  } catch (err) {
    console.log(err);
    res.send("Cloudinary Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});