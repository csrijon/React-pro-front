import express from "express"

const app = express()
const port = 3000

app.get("/",(req,res) => {
  res.send("hello i am server can i run in broswer")
})

app.listen(port,() => {
  console.log(`app is listen ${port} number `)
})