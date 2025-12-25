import "./Media.css"
import TwitterIcon from "@mui/icons-material/Twitter"
import { motion } from "framer-motion"

const Media = () => {
  return (
    <motion.div
      className="media-container"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span>#</span>all-media
      </motion.h2>

      <motion.div
        className="media-item"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.a
          href="https://twitter.com/srijon"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TwitterIcon />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          @srijon
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default Media
