import logo from "../../assets/logo.png";
import   "../../css/Header.css"

const Logo = () => {
  return (
    <div className="Navbar-Logo">
      <div className="first-Nav">
        <img src={logo} alt="logo" />
        <p>Note-GTP</p>
      </div>
    </div>
  );
};

export default Logo;