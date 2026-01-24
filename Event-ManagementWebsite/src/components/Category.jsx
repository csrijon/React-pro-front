import "../css/Category.css";
import data from "../components/data.js"
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const Category = () => {
    return (
        <section className="Browsecategory-section">
            <div className="top-section">
                <p className="heading" >Browse by Category</p>
                <p className="view-all" >View All(7)</p>
            </div>
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
            <div className="counting">
                <KeyboardDoubleArrowLeftIcon className="arrow" />
                <p className="numbering">1</p>
                <p className="numbering">2</p>
                <p className="numbering">3</p>
                <KeyboardDoubleArrowRightIcon className="arrow" />
            </div>
        </section>
    )
}
export default Category;