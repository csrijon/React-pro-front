import "../css/Featuresection.css"
import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


const Featuresection = () => {
    return (
        <section className="Featuresection">
            <div className="container feature-container ">
                <div className="first-featuresection">
                    <h4>Powerful Features For Developer</h4>
                    <p>Everything you need to jumpstart your next big idea with clean, maintainable, and
                        scalable architecture.</p>
                </div>
                <div className="secend-featuressection">
                    <div className="box">
                        <div className="logo">
                            <PsychologyIcon/>
                        </div>
                        <h5>AL Code Generation</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                    <div className="box">
                        <div className="logo">
                           <BusinessIcon/>
                        </div>
                        <h5>AL Code Generation</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                    <div className="box">
                        <div className="logo">
                            <ArrowCircleDownIcon/>
                        </div>
                        <h5>AL Code Generation</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Featuresection