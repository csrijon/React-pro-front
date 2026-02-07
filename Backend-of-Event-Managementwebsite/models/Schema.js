import mongoose from "mongoose";


mongoose.connect('mongodb://127.0.0.1:27017/EventDatabase')
    .then(() => console.log('mongodb is Connected!'));

    const categorySchema =new mongoose.Schema({
        title:String,
        Image:String,
        time:{
            type:Date,
            default:Date.now
        }
    })

     const Categorymodel = mongoose.model("Category", categorySchema)

     export default Categorymodel;