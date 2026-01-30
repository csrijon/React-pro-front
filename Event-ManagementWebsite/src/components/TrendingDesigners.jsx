import Topsection from "../ui/Topsection"
import VenueCard from "./VenueCard"
import Countiing from "../ui/Counting"
import "../css/venue.css"

const cities = ["ABU DHABI", "AL AIN", "DUBAI"]
const TrendingDesigners = ({title}) => {
    return (
        <section className="Trending-Designerssection" >
            <Topsection title={title} />
            <div className="venue-grid">
                {Array.from({ length: 5 }).map((_, index) => (
                    <VenueCard key={index} city={cities[index % 3]} />
                ))}
            </div>
            <Countiing/>
        </section>
    )
}
export default TrendingDesigners