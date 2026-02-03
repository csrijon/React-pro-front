import profileImage from "../assets/Image.png"
/* eslint-disable no-unused-vars */
import { motion, scale } from "framer-motion"
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
        hidden: { scale: 0.6, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
 
            transition: { type: "spring", stiffness: 100, damping: 20 }
        },
    }
    return (
        <motion.div
            variants={aboutitem}
            initial="hidden"
            whileInView="visible"
            className="about-me-image-section">
            <motion.div  className="dots dots-top"></motion.div>
            <motion.img
                variants={item}
                src={profileImage}
                alt="srijon"
                className="profile-image"
            />

            <motion.div  className="dots dots-bottom"></motion.div>
        </motion.div>
    )
}

export default Aboutmeimage;