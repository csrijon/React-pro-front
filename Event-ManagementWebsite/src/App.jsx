import React from "react";
import Header from "./components/Header.jsx";
import Herosection from "./components/Herosection.jsx";
import Category from "./components/Category.jsx";
import Dummycard from "./components/Dummycard.jsx"
import FeaturedVideo from "./components/FeaturedVideo.jsx"
import ImageSliderUI from "./components/ImageSliderUI.jsx"
import Media from "./components/Media.jsx";
import Footer from "./components/Footer.jsx"

const App = () => {
  return (
    <>
      <Header />
      <Herosection />
      <Category title="Browse by Category" number="9" />
      <Category title="Popular Venue" number="1000" />
      <Dummycard />
      <FeaturedVideo />
      <ImageSliderUI />
      <Media />
      <Footer/>
    </>
  )
}

export default App;