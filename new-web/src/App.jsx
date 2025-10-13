import './App.css'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import Quote from './components/Quote'
import ProjectSection from './components/ProjectSection'
import Skillsection from './components/Skillsection'
import AboutMe from './components/AboutMe'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Fixed from './components/Fixed'
import DotGrid from './components/DotGrid'

function App() {

  return (
    <>
      <Header />
      <HeroSection />
      {/* <Quote /> */}
      <ProjectSection />
      <Skillsection />
      <AboutMe />
      <Contact />
      <Footer/>
      <Fixed />
      <DotGrid/>
    </>
  )
}

export default App
