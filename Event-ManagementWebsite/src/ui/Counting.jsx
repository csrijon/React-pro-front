/* eslint-disable no-unused-vars */
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import "../css/Category.css";
import { motion } from "framer-motion";

const Countiing =()=>{
    return(
       <motion.div className="counting">
                <KeyboardDoubleArrowLeftIcon className="arrow" />
                <motion.p whileTap={{scale:1.1}} className="numbering">1</motion.p>
                <motion.p whileTap={{scale:1.1}} className="numbering">2</motion.p>
                <motion.p whileTap={{scale:1.1}} className="numbering">3</motion.p>
                <KeyboardDoubleArrowRightIcon  className="arrow" />
            </motion.div>
    )
}

export default Countiing