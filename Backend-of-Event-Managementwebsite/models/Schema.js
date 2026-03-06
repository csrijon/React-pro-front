import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/EventDatabase')
    .then(() => console.log('mongodb is Connected!'))

const categorySchema = new mongoose.Schema({
    title: String,
    Image: String,
    time: {
        type: Date,
        default: Date.now
    }
})
const PhotographvideorouteSchema = new mongoose.Schema({
    videoname: String,
    videolocation: String,
    videoimage: String,
    time: {
        type: Date,
        default: Date.now
    }
})

const TrendingSchema = new mongoose.Schema({
    designername: String,
    location: String,
    image: String
})
const PopularVenueSchema = new mongoose.Schema({
    venuename: String,
    location: String,
    image: String
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

const MediaSchema = new mongoose.Schema({
    heading: String,
    discreption: String,
    image: String,
    time: {
        type: Date,
        default: Date.now
    }
})

const Categorymodel = mongoose.model("Category", categorySchema)
const Venuemodel = mongoose.model("Venue", VenueSchema)
const MediaModel = mongoose.model("Media", MediaSchema)
const Trendingmodel = mongoose.model("Trending",TrendingSchema)
const PopularVenuModel = mongoose.model("PopularVenue",PopularVenueSchema)
const PhotographvideorouteModel = mongoose.model("Photographvideoroute", PhotographvideorouteSchema)

export { Categorymodel, Venuemodel, MediaModel,Trendingmodel, PopularVenuModel, PhotographvideorouteModel }