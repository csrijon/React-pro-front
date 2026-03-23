import Logo from "../common/Logo"
import "../../css/Loginheader.css"

const Loginheader = () => {
    return (
        <section className="login-header" >
            <div className="container">
                <div className="login-header">
                    <Logo />
                    <div className="secend-login-header">
                   <ul>
                    <li><a href="">Documentation</a></li>
                    <li><a href="">Support</a></li>
                   </ul>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Loginheader