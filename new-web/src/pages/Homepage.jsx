import HeroSection from "../components/HeroSection"
import ProjectSection from "../components/ProjectSection"
import Skillsection from "../components/Skillsection"
import AboutMe from "../components/AboutMe"
import Contact from "../components/Contact"
import Fixed from "../components/Fixed"

const Homepage = () => {
    return (
        <>
            <HeroSection />
            <ProjectSection />
            <Skillsection />
            <AboutMe />
            <Contact icon="#" />
            <Fixed />
            </>
        
        
    )
}
export default Homepage