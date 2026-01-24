import firstimage from "../assets/forthimages.jpg"
import "../css/Dummycard.css"

const Dummycard = () => {
    return (
        <section className="dummy-section" >
            <div className="main-cards">
                <div className="left-dummy">
                <img src={firstimage} alt="dummy-iamges" />
            </div>
            <div className="right-dummy">
                <div className="right-details">
                    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, omnis.</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque magni quibusdam id alias ratione perferendis?</p>
                </div>
                <button>CTA</button>
            </div>
            </div>
            
        </section>
    )
}
export default Dummycard