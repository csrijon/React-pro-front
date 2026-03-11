import React, { useState, useEffect } from "react";
import "../css/suppliers.css";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardAnimation = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
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
};

const SuppliersCategories = () => {

  const [dataarray, setdataarray] = useState([])

  useEffect(() => {
    const responsedata = async () => {
      try {
        const response = await fetch("http://localhost:3000/supplyers")
        const data = await response.json()
        setdataarray(data)
      } catch (error) {
        console.log(error)
      }
    }
    responsedata()
  }, [])

  return (
    <div className="suppliers-container">
      <div className="container">

        <motion.h4
          className="suppliers-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Suppliers Categories
        </motion.h4>

        <motion.div
          className="suppliers-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {dataarray.map((item, index) => (
            <motion.div
              className="supplier-card"
              key={index}
              variants={cardAnimation}
              whileHover={{
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 200 }
              }}
            >
              <div className="supplier-circle">
                <motion.img
                  src={item.Image}
                  alt={item.title}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p className="supplier-text">{item.title}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default SuppliersCategories;