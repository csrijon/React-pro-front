
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Razorpay from "razorpay"

const app = express()
const port = 5000
dotenv.config()

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello this is razorpay backend")
})
app.post("/create-payment",async (req, res) => {
    const { ammount,currency } = req.body
    console.log(ammount,currency)

      let instance = new Razorpay({
        // eslint-disable-next-line no-undef
        key_id:process.env.TESTAPIKEY,
        // eslint-disable-next-line no-undef
        key_secret:process.env.TESTSECRET
      })
      let orderid = await instance.orders.create({
        amount:ammount,
        currency:currency
      })
      console.log(orderid

      )
    res.json({
        mess: "i get data",
        order:orderid
    })
})

app.listen(port, () => {
    console.log(`app is listen ${port}`)
})