import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ProjectSection from "../components/ProjectSection";
import Skillsection from "../components/SkillsSection";
import AboutMe from "../components/AboutMe"
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Fixed from "../components/Fixed"

const HomePages = () => {
    return (
        <>
            <Header />
            <HeroSection />
            <ProjectSection />
            <Skillsection />
            <AboutMe />
            <Contact icon="#" />
            <Footer />
            <Fixed />
        </>
    )
}

export default HomePages;