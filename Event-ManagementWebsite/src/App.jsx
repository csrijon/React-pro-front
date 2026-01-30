import React from "react";
import Header from "./components/Header.jsx";
import Herosection from "./components/Herosection.jsx";
import Category from "./components/Category.jsx";
import Dummycard from "./components/Dummycard.jsx"
import FeaturedVideo from "./components/FeaturedVideo.jsx"
import ImageSliderUI from "./components/ImageSliderUI.jsx"
import Media from "./components/Media.jsx";
import Footer from "./components/Footer.jsx"
import FilterBar from "./components/FilterBar.jsx";
import VenueGrid from "./components/VenueGrid.jsx"
import PopularVenu from "./components/PopularVenu.jsx"
import SuppliersCategories from "./components/SuppliersCategories.jsx";
import Videophotopopular from "./components/Videophotopopular.jsx"
import TrendingDesigners from "./components/TrendingDesigners.jsx"
import CompanyIntro from "./components/CompanyIntro.jsx";
import FirstAboutSection from "./components/FirstAboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import AboutBlocks from "./components/AboutBlocks.jsx";
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <><Header />
      <Herosection heading="Your Wedding," subheading="Your Way" />
      <Category title="Browse by Category" number="9" />
      <Category title="Popular Venue" number="1000" />
      <Dummycard />
      <FeaturedVideo />
      <ImageSliderUI />
      <Media />
      <Footer /></>
  },
  {
    path: "/venu",
    element: <><Header /><Herosection heading="Our Wedding Venues" /><FilterBar /><VenueGrid title="Wedding Venue" number="49" /><PopularVenu title="Popular Venue
" number="39" /><Dummycard /><Footer /></>
  },
  {
    path: "/Suppliers",
    element: <><Header /><Herosection heading="Our Suppliers" /><SuppliersCategories /><Videophotopopular title="Popular Photographers / Videographers" /><TrendingDesigners title="Trending Designers" /> <Dummycard /><Footer /></>
  },
  {
    path: "/About",
    element: <><Header /><CompanyIntro /><FirstAboutSection /><AboutBlocks /><Dummycard /><Footer /></>
  },
  {
    path: "/Media",
    element: <><Header /><CompanyIntro /><Media /><Dummycard /><Footer /></>
  },
  {
    path:"/Contact",
    element:<><Header/><CompanyIntro/><ContactSection/><Dummycard /><Footer /></>
  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;