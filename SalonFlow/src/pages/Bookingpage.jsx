import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import "../styles/Bookingpage.css"
import Datecard from "../ui/Datecard.jsx"
import TimeCard from "../ui/TimeCard.jsx"

const timeSlots = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: false },
    { time: "17:00", available: true }
];

const Bookingpage = () => {
    return (
        <div className="Bookingsection">
            <div className="top-section-titles">
                <ArrowBackIcon sx={{ fontSize: 10 }} />
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

            <div className="date-picker-container">
                <div className="top-calendertitle">
                    <CalendarMonthIcon />
                    <p>Pick a date</p>
                </div>
                <Datecard />
            </div>

            <div className="Available-time-section">
                <h3>Available times</h3>
                <div className="time-stamp">
                    {
                        timeSlots.map((slot) => (

                            <TimeCard time={slot.time} />

                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Bookingpage