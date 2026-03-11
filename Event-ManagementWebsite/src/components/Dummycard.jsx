import firstimage from "../assets/forthimages.jpg"
import "../css/Dummycard.css"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25
    }
  }
}

const leftAnimation = {
  hidden: { opacity: 0, x: -80, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
}

const rightAnimation = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
}

const textAnimation = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

const Dummycard = () => {
  return (
    <section className="dummy-section">
      <div className="container">

        <motion.div
          className="main-cards"
          variants={container}
          initial="hidden"
          whileInView="show"
        //   viewport={{ once: true, amount: 0.3 }}
        >

          {/* Left Image */}
          <motion.div className="left-dummy" variants={leftAnimation}>
            <motion.img
              src={firstimage}
              alt="dummy-images"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Right Content */}
          <motion.div className="right-dummy" variants={rightAnimation}>
            <div className="right-details">

              <motion.h4 variants={textAnimation}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, omnis.
              </motion.h4>

              <motion.p variants={textAnimation}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque magni quibusdam id alias ratione perferendis?
              </motion.p>

            </div>

            <motion.button
              variants={textAnimation}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              CTA
            </motion.button>

          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}

export default Dummycard