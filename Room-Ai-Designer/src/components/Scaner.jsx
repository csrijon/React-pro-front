import Webcam from "react-webcam";
import { useState,  } from "react";
import "../css/Scanner.css";

const Scaner = () => {
    const [showWebcam, setShowWebcam] = useState(false);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const turnOnCamera = () => {
        setLoading(true);
        setTimeout(() => {
            setShowWebcam(true);
            setLoading(false);
        }, 1200); 
    };

    const turnOffCamera = () => {
        setShowWebcam(false);
    };

    return (
        <div className={darkMode ? "scanner-wrapper dark" : "scanner-wrapper"}>
            <div className="top-bar">
                {/* Dark Mode Toggle */}
                <button 
                  className="dark-btn" 
                  onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            {/* Camera Box */}
            <div className={showWebcam ? "camera-box glow" : "camera-box"}>
                {loading && (
                    <div className="loader"></div>
                )}

                {!loading && showWebcam && (
                    <Webcam
                        className="camera-preview round"
                        videoConstraints={{
                            width: 1280,
                            height: 720,
                            facingMode: "user",
                        }}
                    />
                )}

                {!loading && !showWebcam && (
                    <div className="camera-placeholder">
                        <p>Camera is OFF</p>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="button-group">
                {!showWebcam ? (
                    <button className="btn primary" onClick={turnOnCamera}>
                        Turn ON Camera
                    </button>
                ) : (
                    <button className="btn danger" onClick={turnOffCamera}>
                        Turn OFF Camera
                    </button>
                )}
            </div>
        </div>
    );
};

export default Scaner;
