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
import HomePages from './pages/HomePages'
import ProjectSectionPages from "./pages/ProjectSectionPages"
import AboutPage from "./pages/AboutPage"
import ExperiencePage from "./pages/ExperiencePage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <><HomePages /></>
  },
  {
    path: "/allprojects",
    element: <><ProjectSectionPages /></>
  },
  {
    path: "/aboutme",
    element: <><AboutPage /></>
  },
  {
    path: "/experience",
    element: <><ExperiencePage/></>
  }
  , {
    path: "/contact",
    element: <><Header /><ContactRoutepage /><Footer /><screenTop /></>
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
