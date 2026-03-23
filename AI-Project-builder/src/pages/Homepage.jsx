// import Header from "../components/common/Header"
import Homepageheader from "../components/headers/Homepageheader"
import Footer from "../components/common/Footer"
import Featuresection from "../components/home/Herosection"
import Herosection from "../components/home/Herosection"
import Pricingsection from "../components/home/Pricingsection"
import Loginheader from "../components/headers/Loginheader"

const Homepage=()=>{
    return(
        <section>
       {/* <Header/> */}
       <Loginheader/>
       {/* <Homepageheader/> */}
       {/* <Herosection/> */}
       <Featuresection/>
       <Pricingsection/>
       <Footer/>
        </section>
    )
}

export default Homepage