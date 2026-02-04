import nodemailer from 'nodemailer';
import express from 'express';

const router = express.Router();

router.post("/",(req,res) => {
  const {name, email, message} = req.body;
  console.log(name, email, message);
  res.status(200).json({message: "Mail sent successfully", status: true})
}
)
export default router;