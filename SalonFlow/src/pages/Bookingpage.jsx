import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import "../styles/Bookingpage.css"

const Bookingpage = () => {
    return (
        <div className="Bookingsection">
            <div className="top-section-titles">
                <ArrowBackIcon sx={{fontSize:10}} />
                <p> Back to Petal Nail Atelier</p>
            </div>
            <div className="booking-top-components">
                <div className="first-left">
                    <p>Booking</p>
                    <h3>Signature Pedicure</h3>
                    <p>Petal Nail Atelier</p>
                </div>
                <div className="right-side-components">
                    <div className="timmer">
                        < TimelapseIcon />
                        <p>75 min</p>
                    </div>
                    <div className="rupee">
                        $75
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bookingpage