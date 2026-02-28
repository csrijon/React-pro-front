import { useEffect,useState } from "react"
import Topsection from "../ui/Topsection"
import "../css/Media.css"
import Latestdata from "../Latestdata.js"
import Countiing from "../ui/Counting.jsx"

const Media = () => {

    const [mediainfo,setmediainfo] = useState([])

    useEffect(() => {
        let getresponse = async () => {
            try {
                let fetchmedia = await fetch("http://localhost:3000/fetchmedia")
                let res = await fetchmedia.json()
                setmediainfo(res)
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
        getresponse()
    }, [])

    return (
        <section className="Mediasection" >
            <div className="container">
                <Topsection title="Latest Media" number="23" />
                <div className="media-card-section">
                    {
                        mediainfo.map((item) => (
                            <div className="info-card" key={item.id} >
                                <div className="info-image">
                                    <img src={item.image} alt="card" />
                                </div>

                                <div className="info-content">
                                    <h4>{item.heading}</h4>
                                    <p>
                                        {item.discreption}
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