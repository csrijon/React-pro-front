import profileImage from "../assets/Image.png"
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"
const Aboutmeimage = () => {
    return (
        <div className="about-me-image-section">
            <div className="dots dots-top"></div>
            <motion.img
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                whileHover={{ scale: 2 }}
                transition={{ duration: 0.5 }}
                src={profileImage}
                alt="srijon"
                className="profile-image"
            />

            <div className="dots dots-bottom"></div>
        </div>
    )
}

export default Aboutmeimage;