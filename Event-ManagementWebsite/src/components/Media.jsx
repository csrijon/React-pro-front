import Topsection from "../ui/Topsection"
import "../css/Media.css"
import Latestdata from "../Latestdata.js"
import Countiing from "../ui/Counting.jsx"

const Media = () => {
    return (
        <section className="Mediasection" >
            <div className="container">
            <Topsection title="Latest Media" number="23" />
            <div className="media-card-section">
                {
                    Latestdata.map((item, index) => (
                        <div className="info-card" key={index} >
                            <div className="info-image">
                                <img src={item.img} alt="card" />
                            </div>

                            <div className="info-content">
                                <h4>{item.heading}</h4>
                                <p>
                                    {item.title}
                                </p>
                                <a href="#" className="read-more">Read More</a>
                            </div>
                        </div>
                    ))
                }

            </div>
            <Countiing />
            </div>
        </section>
    )
}
export default Media