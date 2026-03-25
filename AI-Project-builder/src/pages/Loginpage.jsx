import Loginheader from "../components/headers/Loginheader"
import NeonButton from "../components/common/NeonButton"
import Socialbutton from "../components/common/Socialbutton"
import Loginpagefooter from "../components/Footer/Loginpagefooter"
import "../css/Loginpage.css"

const Loginpage = () => {
    return (
        <section className="Login-pagsecton" >
            <Loginheader />
            <div className="mainlogin-section" >
                <div className="loginpage">
                    <div className="login-text">
                        <h1>Welcome Back</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                    <div className="login-middle">
                        <p>Email Address</p>
                        <input className="text" type="text" placeholder="jel" />
                        <div className="password">
                            <p>PASSWORD</p>
                            <p>Forget Password</p>
                        </div>
                        <input type="text" className="text" />
                        <p>logoye</p>

                        <div className="check-box">
                            <input className="check-boxinput" type="checkbox" />
                            <p>Remember this device</p>
                        </div>
                        <NeonButton />
                        <p>OR CONTINUE WITH</p>
                        <div className="buttens">
                            <Socialbutton />
                            <Socialbutton />
                        </div>

                        <div className="account">
                            <p>
                                NEW HERE?<span>Create an account</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Loginpagefooter/>
        </section>
    )
}
export default Loginpage