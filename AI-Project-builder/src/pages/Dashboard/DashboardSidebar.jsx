import Logo from "../../components/common/Logo"
import "../../css/DashboardSidebar.css"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


const DashboardSidebar = () => {
    return (
        <section className="DashboardSidebar-section" >
            <div className="dashboard-sidecontainer">
                {/* {start top dashboard sidebar} */}
                <div className="top-dashboard-sidebar">
                    <div className="top-sidebar" >
                        <Logo />
                        <p>Build Faster With AI</p>
                    </div>
                    <div className="gen-project-section">
                        <AddCircleOutlineIcon />
                        Generate Project
                    </div>
                    <div className="menu-text">
                        <p>MENU</p>
                    </div>
                    <div className="menu-project">
                        <div className="first-menu">
                            <FolderZipIcon />
                            <p>My Projects</p>
                        </div>
                        <div className="secend-menu">
                            <HistoryIcon />
                            <p>History</p>
                        </div>
                        <div className="third-menu">
                            <SettingsIcon />
                            <p>Account Setting</p>
                        </div>
                    </div>
                </div>
                {/* {End dashboard sidebar } */}
                {/* {strat bottom logout} */}
                <div className="bootom-logout">
                    <LogoutIcon />
                    <p>Logout</p>
                </div>
                {/* {end bottom logout} */}
            </div>
        </section>
    )
}
export default DashboardSidebar