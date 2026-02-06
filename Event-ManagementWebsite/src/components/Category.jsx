import "../css/Category.css";
import data from "../components/data.js"
import Topsection from "../ui/Topsection.jsx";
import Countiing from "../ui/Counting.jsx";

const Category = ({ title, number }) => {
    return (
        <section className="Browsecategory-section">
            <div className="container">
                <Topsection title={title} number={number} />
                <div className="Bottom-section">
                    {
                        data.map((item, index) => (
                            <div className="cards" key={index}>
                                <img src={item.Imageurl} alt="card-images" />
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