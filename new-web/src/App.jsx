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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/contact",
    element: <><Header /><Contact icon="/" /><Footer /><Scrolltop /></>
  }
])
function App() {
  return (
    <RouterProvider router={router} >
      <Scrolltop />
    </RouterProvider>
  )
}

export default App
