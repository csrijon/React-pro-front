

import express from "express"
import cors from "cors"

const app = express()
const port = 5000
app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.send("hello you are a cow")
})

app.post("/payment",(req,res) => {
  const {amount} = req.body
  console.log(amount)
  res.json({mess:"this is ok"})
}
)

app.listen(port,()=>{
    console.log(`app is listen port number${port}`)
})