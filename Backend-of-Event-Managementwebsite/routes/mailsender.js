import express from "express"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config()

const router = express.Router()

router.post("/",async (req, res) => {
    
    try {
        const { name, number, email, msg } = req.body;
        console.log(name, number, email, msg)
        const trasporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.GMAIL,
                pass:process.env.APP_PASS
            }
        })

        const mainstructure = {
            from:`Event Management Website ${email}`,
            to:process.env.GMAIL,
            replyTo:email,
            subject:`Message from ${name} via Event Management Website`,
            text:`Name: ${name}\nPhone Number: ${number}\nEmail: ${email}\nMessage: ${msg}`
        }

        const sendmail = await trasporter.sendMail(mainstructure)
        console.log("email sent successfully")
    } catch (error) {
        console.log(error)
    }

    res.status(200).json({
        mess:"email sent successfully",
        success:true
    })
})


export default router