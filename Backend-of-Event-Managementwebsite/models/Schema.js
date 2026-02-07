import mongoose from "mongoose";


mongoose.connect('mongodb://127.0.0.1:27017/EventDatabase')
    .then(() => console.log('mongodb is Connected!'));

const categorySchema = new mongoose.Schema({
    title: String,
    Image: String,
    time: {
        type: Date,
        default: Date.now
    }
})

const VenueSchema = new mongoose.Schema({
    venueTitle: String,
    location: String,
    rating: Number,
    guests: Number,
    image: String,
    time: {
        type: Date,
        default: Date.now
    }
})

const Categorymodel = mongoose.model("Category", categorySchema)
const Venuemodel = mongoose.model("Venue", VenueSchema)

export { Categorymodel, Venuemodel };