import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./Button.css"
import { NavLink } from 'react-router';
/* eslint-disable no-unused-vars */
import {motion} from "framer-motion"

const Button = () => {
    return (
        <motion.button 
            className="custom-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
        >
            <NavLink to= "/allprojects">View more<ArrowForwardIosIcon /></NavLink>
        </motion.button>
    )
}

export default Button;