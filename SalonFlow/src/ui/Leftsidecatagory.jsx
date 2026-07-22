import FilterListIcon from '@mui/icons-material/FilterList';;
import Salondata from '../Salondata';
import "../styles/Leftsidecatagory.css"

const Leftsidecatagory = () => {
    return (
        <div className='leftside_catagory' >

            <div className="filtericons">
                <FilterListIcon />
                <h3>filter</h3>
            </div>
            <div className="category">
                <p>Category</p>
                <div className="salon-container">
                    {Salondata.map((salon) => (
                        <div className="salon-card" key={salon.id}>
                            <div className="salon-icon">
                                {salon.icon}
                            </div>

                            <span className="salon-name">
                                {salon.item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="location_filter">
                <p>LOCATION</p>
                <input type="text" placeholder='CITY OR ZIP' />
            </div>

            <div className="rating_filter">
                <p>MIN RATING: 0.0</p>
                <input type="range" min="0" max="100" />
            </div>
        </div>
    )
}
export default Leftsidecatagory