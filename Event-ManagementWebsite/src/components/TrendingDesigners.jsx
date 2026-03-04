import Topsection from "../ui/Topsection"
import { useEffect,useState} from "react"
import VenueCard from "./VenueCard"
import Countiing from "../ui/Counting"
import "../css/venue.css"

// const cities = ["ABU DHABI", "AL AIN", "DUBAI"]



const TrendingDesigners = ({ title }) => {
    const [trendingdata, settrendingdata] = useState([])
    useEffect(() => {
        const fetchTrendingDesigners = async () => {
            try {
                let response = await fetch("http://localhost:3000/api/fetchtreding")
                let data = await response.json()
                settrendingdata(data)
                console.log(data)
            } catch (error) {
                console.log(error, "trending route is not working")
            }
        }
        fetchTrendingDesigners()
    }, [])
    return (
        <section className="Trending-Designerssection" >
            <div className="container">
                <Topsection title={title} />
                <div className="venue-grid">
                    {trendingdata.map((designer, index) => (
                        <VenueCard key={index} designernames={designer.designername} image={designer.image} city={designer.location} />
                    ))}
                </div>
                <Countiing />
            </div>
        </section>
    )
}
export default TrendingDesigners