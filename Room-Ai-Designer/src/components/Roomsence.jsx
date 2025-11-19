import Button from "../components/Button.jsx";
import "../css/Roomsence.css"

const Roomsence = () => {
    return (
        <>
            <section>
                <div className="roomsence-container">
                    <h2>My Room Scenes</h2>
                    <div className="button-container">
                        <Button name="Room Type" />
                        <Button name="Date" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Roomsence;