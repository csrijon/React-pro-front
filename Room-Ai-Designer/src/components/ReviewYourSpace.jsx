import roomview from "../assets/view of the room.jpg"
import "../css/ReviewYourSpace.css"


const ReviewYourSpace = () => {
    return (
        <>
            <section className="section-Space" >
                <div className="Space-Container" >
                    <div className="heading-container">
                        <h3>Review Your Space</h3>
                    </div>
                    <div className="middle-container">
                        <div className="left">
                            <img src={roomview} alt="" />
                        </div>
                        <div className="right">
                            <h2>Extracted Details</h2>
                            <div className="1st-line">
                                <p>Room Dimemsicns</p>
                                <input type="text" />
                            </div>
                            <div className="2nd-line">
                                <p>Ceilling Height</p>
                                <input type="text" />
                            </div>
                            <div className="3rd-line">
                                <p>Railing Height</p>
                                <input type="text" />
                            </div>
                            <div className="4th-line">
                                <p>Number of Windows</p>
                                <input type="text" />
                            </div>
                            <div className="5th-line">
                                <p>Number Of Doors</p>
                                <input type="text" />
                            </div>
                            <button className="btn-button" >Confirm & Proceed</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ReviewYourSpace;