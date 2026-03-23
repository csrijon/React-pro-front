import VisibilityIcon from '@mui/icons-material/Visibility';
import "../../css/Herosection.css"


const Herosection = () => {
    return (
        <section className="Herosection" >
            <div className="container hero-container ">

                <div className="hero-first">
                    <li>v2.0 NOW LIVE</li>
                </div>
                <div className="secend-hero">
                    <h2>Generate Full-Stacks <span>Projects With Ai</span></h2>
                </div>
                <div className="third-hero">
                    <p>Transform your concepts into production-ready codebases in
                        seconds. Architecture, authentication, and deployment scripts
                        included.</p>
                </div>
                <div class="input-box">
                    <div class="input-content">
                        <span class="icon">💬</span>
                        <input
                            type="text"
                            placeholder="Create a MERN blog app with authentication and dashboard"
                        />
                    </div>

                    <button class="generate-btn">
                        Generate ✨
                    </button>
                </div>
                <div className="vire-button">
                    <VisibilityIcon/>
                    <p>View Examples</p>
                </div>
            </div>

        </section>
    )
}

export default Herosection