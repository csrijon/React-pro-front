import './App.css'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProjectSection from './components/ProjectSection'
import Skillsection from './components/Skillsection'
import AboutMe from './components/AboutMe'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Fixed from './components/Fixed'
import Allproject from './components/Allproject'
import Scrolltop from './components/Scrolltop'
import Routeabout from './components/Routeabout'
import Funfact from './ui/Funfact'
import Button from "./ui/Button"
// import Onworking from './ui/Onworking'
// import Media from './ui/Media'
import ContactRoutepage from './pages/ContactRoutepage'
import Experience from './components/Experience'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Button from '@mui/material/Button'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Header />
      <HeroSection />
      <ProjectSection />
      <Skillsection />
      <AboutMe />
      <Contact icon="#" />
      <Footer />
      <Fixed /></>
  },
  {
    path: "/allprojects",
    element: <><Header /><Allproject /><Footer /><Scrolltop /></>
  },
  {
    path: "/aboutme",
    element: <><Header /><Routeabout /><Funfact /><Footer /><Scrolltop /></>
  },
  {
    path: "/experience",
    element: <><Header /><Experience/><Footer /><Scrolltop /></>
  }
  ,{
    path: "/contact",
    element: <><Header/><ContactRoutepage /><Footer/><screenTop/></>
  },
])
function App() {
  return (
    <RouterProvider router={router} >
      <Scrolltop />
    </RouterProvider>
  )
}

export default App
