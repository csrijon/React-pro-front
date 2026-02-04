import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Mailsendr from './routes/Mailsendr.js';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/sendmail', Mailsendr);


app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})