import "../styles/Confirmpage.css"

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Continuebutton from "../ui/Continuebutton.jsx"
const Confirmpage = () => {
  return (
    <div className="Confirmpage-container" >
      <h1 className="Review-title" >Review & confirm</h1>
      <div className="booking-card-confirm">

        <div className="booking-row">
          <div className="icon-box">
            <PersonOutlineOutlinedIcon sx={{ fontSize: 22, color: "#555" }} />
          </div>

          <div className="booking-info">
            <span className="label">Provider</span>
            <h3>Willow Hair Studio</h3>
          </div>
        </div>

        <div className="booking-row">
          <div className="icon-box">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: "#555" }} />
          </div>

          <div className="booking-info">
            <span className="label">Date & time</span>
            <h3>2026–07–29 • 14:00</h3>
          </div>
        </div>

        <div className="booking-row">
          <div className="icon-box">
            <AccessTimeOutlinedIcon sx={{ fontSize: 22, color: "#555" }} />
          </div>

          <div className="booking-info">
            <span className="label">Service</span>
            <h3>Balayage (180 min)</h3>
          </div>
        </div>

        <div className="divider"></div>

        <div className="total-section">
          <span>Total</span>
          <h1>$240</h1>
        </div>

      </div>
      <div className="buttons-section">
        <Continuebutton title={"Cancel"} />
        <Continuebutton title={"Confirm & pay $240"} />
      </div>
    </div>
  )
}

export default Confirmpage