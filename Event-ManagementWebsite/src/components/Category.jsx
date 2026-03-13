/* eslint-disable no-unused-vars */
import "../css/Category.css";
import Topsection from "../ui/Topsection.jsx";
import Countiing from "../ui/Counting.jsx";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Category = ({ title, searchResults }) => {
    // console.log(searchResults, "search results in category")
    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const cardAnimation = {
        hidden: { opacity: 0, y: 40 },
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



    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        let handelfetchcategory = async () => {
            let response = await fetch("http://localhost:3000/api/fetbrowcategory")
            let data = await response.json()
            setCategoryData(data);
        }
        handelfetchcategory();
    }, []);
    const filterdata = searchResults.length > 0 ?
        categoryData.filter(item => searchResults.some(result => result.title === item.title)) :
        categoryData;
    console.log(categoryData, "categorydata in category component")

    return (
        <section className="Browsecategory-section">
            <div className="container">
                <Topsection title={title} number={categoryData.length} />
                <motion.div variants={container} initial="hidden" animate="show" className="Bottom-section">
                    {
                        filterdata.map((item, index) => (
                            <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 200 }} variants={cardAnimation} className="cards" key={index}>
                                <motion.img src={item.Image} alt="card-images" />
                                <p className="card-title">{item.title}</p>
                            </motion.div>
                        ))
                    }
                </motion.div>
                <Countiing />
            </div>
        </section>
    )
}
export default Category;