
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import "../css/Header.css"

const Header = () => {
    return (
        <header className='Headersection' >
            <h2>LearnWiseAi</h2>
            <ul>
                <li><a href="">Features</a></li>
                <li><a href="">Pricing</a></li>
                <li><a href="">Solutions</a></li>
                <li><a href="">Resources</a></li>
            </ul>
            <div>
                <Avatar alt="Remy Sharp" src="../assets/hero.png" />
                <NotificationsIcon />
            </div>
        </header>
    )
}

export default Header