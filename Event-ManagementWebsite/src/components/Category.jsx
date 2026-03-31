/* eslint-disable no-unused-vars */
import "../css/Category.css";
import Topsection from "../ui/Topsection.jsx";
import Countiing from "../ui/Counting.jsx";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";   

const Category = ({ title, searchResults }) => {

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

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
    };

    const [categoryData, setCategoryData] = useState([]);
    const [open, setopen] = useState(false)
    const [photoindex, setphotoindex] = useState(0)

    useEffect(() => {
        const handelfetchcategory = async () => {
            try {
                const response = await fetch("https://react-pro-front.onrender.com/api/fetbrowcategory");
                const data = await response.json();
                setCategoryData(data);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        handelfetchcategory();
    }, []);

    const filterdata =
        searchResults.length > 0
            ? categoryData.filter(item =>
                searchResults.some(result => result.title === item.title)
            )
            : categoryData;

    return (
        <section className="Browsecategory-section">
            <div className="container">
                <Topsection
                    title={title}
                    number={categoryData.length}
                    path="/Allcardsection"
                />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="Bottom-section"
                >

                    {filterdata.slice(0, 6).map((item, index) => (
                        <motion.div
                            key={index}
                            className="cards"
                            variants={cardAnimation}
                            whileHover={{ scale: 1.05, y: -10 }}
                            transition={{ type: "spring", stiffness: 200 }}
                             onClick={() => {
                                    console.log("clicked", index);
                                    setphotoindex(index);
                                    setopen(true);
                                }}
                        >
                            {/* ✅ normal img use korte hobe */}

                            <img
                                loading="lazy"
                                src={item.Image}
                                
                                alt="card-images"
                               
                            />

                            <p className="card-title">{item.title}</p>
                        </motion.div>
                    ))}
                    <Lightbox
                        open={open}
                        close={() => setopen(false)}
                        slides={filterdata.slice(0, 6).map(item => ({
                            src: item.Image,
                             description: item.title
                        }))}
                        plugins={[Captions]}
                        index={photoindex}
                    />
                </motion.div>

                {/* <Countiing /> */}
            </div>
        </section>
    );
};

export default Category;