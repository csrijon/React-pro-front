import Topsection from "../ui/Topsection"
import "../css/FeaturedVideo.css"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"


const FeaturedVideo = () => {

    const [featuredVideos, setFeaturedVideos] = useState([])

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
                <motion.div
                    className="featured-video"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    // viewport={{ once: true }}
                >
                    {
                        featuredVideos.map((item, index) => (
                            <motion.div
                                variants={cardAnimation}
                                className="simple-card"
                                key={index}
                            >
                                <motion.div className="card-image">
                                    <motion.img src={item.thumbnail} alt="img" />
                                </motion.div>

                                <motion.div className="card-titless">
                                    <motion.p>{item.title}</motion.p>
                                </motion.div>
                            </motion.div>
                        ))
                    }
                </motion.div>
            </div>
        </section>
    )
}

export default FeaturedVideo