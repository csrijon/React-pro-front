import Topsection from "../ui/Topsection"
import "../css/FeaturedVideo.css"
import { useEffect, useState } from "react"


const FeaturedVideo = () => {

    const [featuredVideos, setFeaturedVideos] = useState([])

    useEffect(() => {
        let fetchFeaturedVideos = async () => {
            try {
                let response = await fetch("http://localhost:3000/apifeaturedvideo")
                let data = await response.json()
                console.log(data)
                setFeaturedVideos(data)
            }
            catch (error) {
                console.log(error, "featured video route is not working")
            }
        }
        fetchFeaturedVideos()
    }, [])

    return (
        <section className="FeaturedVideosection" >
            <div className="container">
                <Topsection title="Featured Videos" number="49" />
                <div className="featured-video">
                    {
                        featuredVideos.map((item, index) => (
                            <div className="simple-card" key={index}  >
                                <div className="card-image"><img src={item.thumbnail} alt="img" /></div>
                                <div className="card-titless">
                                    <p>{item.title}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedVideo