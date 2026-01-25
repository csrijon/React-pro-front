import Topsection from "../ui/Topsection"
import "../css/FeaturedVideo.css"
import dummydata from "../dummydata.js"


const FeaturedVideo = () => {
    return (
        <section className="FeaturedVideosection" >
            <Topsection title="Featured Videos" number="49" />
            <div className="featured-video">
                {
                    dummydata.map((item, index) => (
                        <div className="simple-card" key={index}  >
                            <div className="card-image"><img src={item.img} alt="img" /></div>
                            <div className="card-titless">
                                <p>{item.title}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default FeaturedVideo