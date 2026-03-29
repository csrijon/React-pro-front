import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import images from "../../assets/"

const Workshopheader = () => {
    return (
        <section>
         <div className="workshop-conatiner">
            <div className="search-section">
              <SearchIcon/>
              <input type="text" placeholder='Search Projects' />
            </div>
            <div className="right-side">
           <NotificationsIcon/>
           <div className="user-profile">
            <img src="" alt="" />
           </div>
            </div>
         </div>
        </section>
    )
}
export default Workshopheader