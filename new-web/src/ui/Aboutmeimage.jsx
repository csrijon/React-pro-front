import profileImage from "../assets/Image.png"
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"
const Aboutmeimage = () => {

    const aboutitem = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.16,
            }
        }
    }
    const item = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1, y: 0,

            transition: { duration: 0.6, ease: "easeOut" }
        },
    }
    return (
        <motion.div
            variants={aboutitem}
            initial="hidden"
            whileInView="visible"
            className="about-me-image-section">
            <div className="dots dots-top"></div>
            <motion.img
                variants={item}
                src={profileImage}
                alt="srijon"
                className="profile-image"
            />

            <div className="dots dots-bottom"></div>
        </motion.div>
    )
}

export default Aboutmeimage;