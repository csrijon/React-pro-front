import "../css/Category.css";
import Topsection from "../ui/Topsection.jsx";
import Countiing from "../ui/Counting.jsx";
import { useState,useEffect } from "react";

const Category = ({ title, number }) => {
    const [categoryData, setCategoryData] = useState([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
     let handelfetchcategory = async () => {
    let  response = await fetch("http://localhost:3000/api/fetbrowcategory")
    let data = await response.json()
    console.log(data)
    setCategoryData(data);
    // setLoading(false);
  }
  handelfetchcategory();
    }, []);

    return (
        <section className="Browsecategory-section">
            <div className="container">
                <Topsection title={title} number={number} />
                <div className="Bottom-section">
                    {
                        categoryData.map((item, index) => (
                            <div className="cards" key={index}>
                                <img src={item.Image} alt="card-images" />
                                <p className="card-title">{item.title}</p>
                            </div>
                        ))

                    }
                </div>
                <Countiing />
            </div>
        </section>
    )
}
export default Category;