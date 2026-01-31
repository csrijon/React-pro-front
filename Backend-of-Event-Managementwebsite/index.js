import express from "express"
import dotenv from 'dotenv'
import mailsender from "./routes/mailsender.js"
dotenv.config()

const app = express()
const port = 3000
app.use("/api/mailsend",mailsender)
app.use(express.json())

app.get("/",(req,res) => {
  res.send("hello i am server can i run in broswer")
})

app.listen(port,() => {
  console.log(`app is listen ${port} number `)
})