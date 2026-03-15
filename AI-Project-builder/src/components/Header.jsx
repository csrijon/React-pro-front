import "../css/Header.css"
import logo from "../assets/logo.png"

const Header=()=>{
    return(
      <>
       <header className="Header" >
        <div className="Navbar">
            <div className="first-Nav">
                <img src={logo} alt="logo" />
                 <p>Note-GTP</p>
            </div>
            <div className="secend-Nav">
                <ul>
                    <li><a href="">Features</a></li>
                    <li><a href="">Docs</a></li>
                    <li><a href="">Pricing</a></li>
                    <li><a href="">Github</a></li>
                </ul>
            </div>
            <div className="Third-Nav">
                <p>Login</p>
                <button>Sign Up</button>
            </div>
        </div>
       </header>
      </>
    )
}

export default Header