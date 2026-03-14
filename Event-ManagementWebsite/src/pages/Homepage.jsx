import Header from "../components/Header"
import Herosection from "../components/Herosection"
import Category from "../components/Category"
import Dummycard from "../components/Dummycard"
import FeaturedVideo from "../components/FeaturedVideo"
import ImageSliderUI from "../components/ImageSliderUI"
import Media from "../components/Media"
import Footer from "../components/Footer"
import PopularVenu from "../components/PopularVenu"
import { useState } from "react"

const Homepage = () => {
     const [searchResults, setSearchResults] = useState([]);
    return (
        <>
        {/* <Header /> */}
            <Herosection heading="Your Wedding," setSearchResults={setSearchResults} subheading="Your Way" />
            <Category title="Features Category" searchResults={searchResults} number="9" />
            <PopularVenu title="Popular Venue" number="1000" />
            <Dummycard />
            <FeaturedVideo />
            <ImageSliderUI />
            <Media />
            {/* <Footer /> */}
        </>
    )
}

export default Homepage