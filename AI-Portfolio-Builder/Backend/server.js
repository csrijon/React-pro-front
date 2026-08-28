import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-load environment configuration perfectly using an absolute path reference
dotenv.config({ path: path.resolve(__dirname, "./.env") });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import router from "./routes/index.js";

// Establish Secure Connection Layout to MongoDB
connectDB();

// ─── FIX: Casing synchronized with your physical folder setup ("Frontend") ───
const frontendPath = path.join(__dirname, "../Frontend"); 
const app = express();

// Global Core Infrastructure Middlewares
app.get("/",(req,res) => {
  res.send("sever is running")
}
)
app.use(cors({
    origin:"http://127.0.0.1:5500"
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.static(frontendPath));

// Mount Scaled API Route Layout Architecture
app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));