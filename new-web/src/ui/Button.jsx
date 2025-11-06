import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./Button.css"
import { NavLink } from 'react-router';

const Button = () => {
    return (
        <button className="custom-btn">
            <NavLink to= "/allprojects">View more<ArrowForwardIosIcon /></NavLink>
        </button>
    )
}

export default Button;