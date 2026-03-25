import Loginheader from "../components/headers/Loginheader"
import "../css/Signuppage.css"
import NeonButton from "../components/common/NeonButton"
import Socialbutton from "../components/common/Socialbutton"
import Signuppagefooter from "../components/Footer/Signuppagefooter"

const Signuppage = () => {
    return (
        <section className="Signup-section" >
            <Loginheader />
            <div className="signup-page">
                <div className="signup-text">
                    <h2>Create Account</h2>
                    <p>Start building your next AI project in minutes.</p>
                </div>
                <div className="form-container">
                    <div className="form-box">
                        <div className="input-group">
                            <label>FULL NAME</label>
                            <input type="text" placeholder="John Doe" />
                        </div>

                        <div className="input-group">
                            <label>EMAIL ADDRESS</label>
                            <input type="email" placeholder="name@company.com" />
                        </div>

                        <div className="input-group password-group">
                            <label>PASSWORD</label>
                            <div className="password-wrapper">
                                <input type="password" placeholder="Create a strong password" />
                                <span className="eye">👁</span>
                            </div>
                        </div>

                        <div className="input-group password-group">
                            <label>CONFIRM PASSWORD</label>
                            <div className="password-wrapper">
                                <input type="password" placeholder="Repeat your password" />
                                <span className="eye">👁</span>
                            </div>
                        </div>
                    </div>
                </div>
                <NeonButton />
                <p className="continue" >OR CONTINUE WITH</p>
                <div className="signup-buttons">
                    <Socialbutton />
                    <Socialbutton />
                </div>
                <div className="login-details">
                    <p>Already have an account?</p>
                    <a href="">Log in</a>
                </div>
            </div>
 <Signuppagefooter/>
        </section>
    )
}

export default Signuppage