import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import salonimages from "../assets/salon.jpg"
import "../styles/Servicecard.css"

const Servicecard = ({ title,category,rating,location,image}) => {
    return (
        <div className='Servicecard' >
            <img src={image} alt="" />
            <div className="card-title">
                <h4>{title}</h4>
                <div className="rating">
                    <StarIcon sx={{ fontSize: 16,color:"#ad98d5" }} className='star-icon' />
                    <span>{rating}</span>
                </div>
            </div>

            <p className='sub-title'>{category}</p>

            <div className="location">
                <LocationOnIcon sx={{ fontSize: 16,color:"#616174" }} />
                <p>{location}</p>
            </div>
        </div>
    )

}

export default Servicecard