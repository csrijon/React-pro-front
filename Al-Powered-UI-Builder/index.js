import express from "express"
const app = express();
const port =3000;

app.get("/",(req,res)=>{
    res.send("hello world now youcan check my server is running or not")
})
app.listen(port,() => {
  console.log(`my app is running port number${port}`)
})