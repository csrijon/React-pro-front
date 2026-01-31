import Header from "../components/Header"
import Herosection from "../components/Herosection"
import SuppliersCategories from "../components/SuppliersCategories"
import Videophotopopular from "../components/Videophotopopular"
import TrendingDesigners from "../components/TrendingDesigners"
import Dummycard from "../components/Dummycard"
import Footer from "../components/Footer"


const Supplierpage = () => {
    return (
        <>
            <Header />
            <Herosection heading="Our Suppliers" />
            <SuppliersCategories />
            <Videophotopopular title="Popular Photographers / Videographers" />
            <TrendingDesigners title="Trending Designers" />
            <Dummycard />
            <Footer /></>
    )
}

export default Supplierpage
