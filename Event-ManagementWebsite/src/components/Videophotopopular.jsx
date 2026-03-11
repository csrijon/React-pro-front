import Topsection from "../ui/Topsection";
import VenueCard from "./VenueCard";
import Countiing from "../ui/Counting";
import "../css/venue.css";
import { useEffect, useState } from "react";


const Videophotopopular = ({ title }) => {

    const [videophotographerdata, setvideophotographerdata] = useState([])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.18,
                delayChildren: 0.2
            }
        }
    }
    const cardAnimation = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.92
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 130,
                damping: 12
            }
        }
    }


    useEffect(() => {
        const fetchvideophotographer = async () => {
            try {
                let response = await fetch("http://localhost:3000/apivideophotographer")
                let data = await response.json()
                setvideophotographerdata(data)
                console.log(data)
            }
            catch (error) {
                console.log(error, "video photographer route is not working")
            }
        }
        fetchvideophotographer()
    }, [])

    return (
        <section className="video-photosection" >
            <div className="container">
                <Topsection title={title} />
                <div className="venue-grid">
                    {videophotographerdata.map((data, index) => (
                        <VenueCard key={index} designernames={data.videoname} image={data.videoimage} city={data.videolocation} />
                    ))}
                </div>
                <Countiing />
            </div>
        </section>
    )
}

export default Videophotopopular;