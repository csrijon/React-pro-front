import Webcam from "react-webcam";
import { useState } from "react";

const Scaner = () => {

    const [showWebcam, setShowWebcam] = useState(false);

    const turnOnCamera = () => {
        console.log("hey i am clicked")
        setShowWebcam(true);
    };

    const TurnOfCamera =()=>{
        setShowWebcam(false)
    }

    return (
        <>
            <div>Camera Test</div>

            <button onClick={turnOnCamera} >turnOnCamera</button>

            <div className="oncamera">
                {showWebcam ? <Webcam /> : <div>Camera is Off</div>}
            </div>

            <button onClick={TurnOfCamera} >TurnofCamera</button>
        </>
    );
};

export default Scaner;
