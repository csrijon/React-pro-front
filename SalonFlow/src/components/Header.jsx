
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import "../styles/Header.css"

const Header = () => {
    return (
        <header>
            <div className="container header-container ">
                <div className="logo">
                  <span>🌸</span>
                    <p>SFlow</p>
                </div>
                <div className="search-section">
                    <SearchIcon />
                    <input type="text" placeholder="Find a service near you..." />
                </div>
                <div className="header-lasticon">
                    <button className="Calendericon" >
                        < EventAvailableIcon />
                    </button>
                    <button className="Profile-icon">
                        <PermIdentityIcon/>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header