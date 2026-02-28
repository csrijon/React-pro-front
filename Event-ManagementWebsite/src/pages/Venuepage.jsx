import Header from "../components/Header";
import Herosection from "../components/Herosection";
import FilterBar from "../components/FilterBar";
import VenueGrid from "../components/VenueGrid";
import PopularVenu from "../components/PopularVenu";
import Dummycard from "../components/Dummycard";
import Footer from "../components/Footer";

const Venuepage = () => {
    return (
        <>
            <Header />
            <Herosection heading="Our Wedding Venues" />
            <FilterBar />
            <VenueGrid  title="Wedding Venue" number="49" />
            <PopularVenu title="Popular Venue" number="39" />
            <Dummycard />
            <Footer />

        </>
    )
}
export default Venuepage;