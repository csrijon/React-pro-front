/* eslint-disable no-unused-vars */
import "../css/Topsection.css"
import { motion } from "framer-motion"
import { useNavigate } from "react-router";



const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
}

const Topsection = ({ title, number, path }) => {

const navigate = useNavigate();

  return (
    <section>
      <motion.div
        className="top-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.p className="heading" variants={item}>
          {title}
        </motion.p>

        <motion.p
          className="view-all"
          variants={item}
          whileHover={{ scale: 1.05, x: 4 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={() => navigate(path)}
        >
          View All ({number})
        </motion.p>
      </motion.div>
    </section>
  )
}

export default Topsection