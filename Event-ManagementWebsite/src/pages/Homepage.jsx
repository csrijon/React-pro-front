import Header from "../components/Header"
import Herosection from "../components/Herosection"
import Category from "../components/Category"
import Dummycard from "../components/Dummycard"
import FeaturedVideo from "../components/FeaturedVideo"
import ImageSliderUI from "../components/ImageSliderUI"
import Media from "../components/Media"
import Footer from "../components/Footer"

const Homepage = () => {
    return (
        <>
        <Header />
            <Herosection heading="Your Wedding," subheading="Your Way" />
            <Category title="Browse by Category" number="9" />
            <Category title="Popular Venue" number="1000" />
            <Dummycard />
            <FeaturedVideo />
            <ImageSliderUI />
            <Media />
            <Footer />
        </>
    )
}

export default Homepage