import "../styles/Bookingpage.css"
const Continuebutton = ({ title }) => {
    return (
        <a style={{ backgroundColor: title === "Cancel" ? "#efeaf9" : "#ad98d5", color: title === "Cancel" ? "#2c2c3d" : "#141327" }} className="Continuebutton" href="">
            {title}
        </a>
    )
}

export default Continuebutton