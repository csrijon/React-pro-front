import express from 'express';
import { StatisticsModel } from '../models/Schema.js';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { stats } = req.body;
        console.log("Received Stats:", stats);
        const statisticsData = new StatisticsModel({
            stats: stats
        });
        await statisticsData.save();
        res.status(200).json({ message: "Stats received successfully", stats });
    } catch (error) {
        res.status(500).json({ error: "Failed to receive stats" });
    }
});

router.get("/", async (req, res) => {
    try {
        let statisticsData = await StatisticsModel.find()
        console.log(statisticsData)
        res.status(200).json(statisticsData);
    }
    catch (error) {
        console.log(error, "data is missing")
        res.status(400).json({ mess: "data can not find" })
    }
}
)

export default router;