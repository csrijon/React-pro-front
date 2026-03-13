import "../css/Button.css";

const Button = ({ onClick }) => {
    return (
        <button onClick={onClick} className="search-button">Search</button>
    )
}
export default Button;