import CheckIcon from '@mui/icons-material/Check';
import Continuebutton from "../ui/Continuebutton"
import "../styles/BookingSuccess.css"
const BookingSuccess = () => {
    return (
        <div className="Bokkingsuccess-container">
            <div className="Bookingsuccess-card">
            <div className="check">
                <CheckIcon />
            </div>

            <div className="bookingsuccess-message">
                <h2>You're booked ✨</h2>
                <p>A confirmation is on the way.</p>
            </div>
            <div className="Check-booking">
            <Continuebutton title={"See my booking"} />
            </div>
            </div>
        </div>
    )
}

export default BookingSuccess