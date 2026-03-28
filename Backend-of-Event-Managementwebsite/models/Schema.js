import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const categorySchema = new mongoose.Schema({
    title: String,
    Image: String,
    time: {
        type: Date,
        default: Date.now
    }
})
const BrowsebycategorySchema = new mongoose.Schema({
    title: String,
    Image: String,
    time: {
        type: Date,
        default: Date.now
    }
})
const AboutmainSchema = new mongoose.Schema({
    title: String,
    para1: String,
    para2: String,
    mainImage: String,
    time: {
        type: Date,
        default: Date.now
    }
})
const featuredVideoSchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
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
const StatisticsSchema = new mongoose.Schema({
  stats: [
    {
      number: Number,
      label: String
    }
  ],
  time: {
    type: Date,
    default: Date.now
  }
});

const ABoutblock1Schema = new mongoose.Schema({
    title: String,
    blockpara1: String,
    blockpara2: String,
    Image: String,
    time: {
        type: Date,
        default: Date.now
        }
})
const Aboutblock2Schema = new mongoose.Schema({
    title: String,
    blockpara1: String,
    blockpara2: String,
    Image: String,
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
const featuredVideoModel = mongoose.model("FeaturedVideo", featuredVideoSchema)
const BrowsebycategoryModel = mongoose.model("Browsebycategory", BrowsebycategorySchema)
const AboutmainModel = mongoose.model("Aboutmain", AboutmainSchema)
const StatisticsModel = mongoose.model("Statistics", StatisticsSchema)
const Aboutblock1Model = mongoose.model("Aboutblock1", ABoutblock1Schema)
const Aboutblock2Model = mongoose.model("Aboutblock2", Aboutblock2Schema)

export { Categorymodel, Venuemodel, MediaModel,Trendingmodel, PopularVenuModel, PhotographvideorouteModel, featuredVideoModel, BrowsebycategoryModel, AboutmainModel, StatisticsModel, Aboutblock1Model, Aboutblock2Model }