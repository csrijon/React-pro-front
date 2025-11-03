import profileImage from "../assets/Image.png"

const Aboutmeimage = () => {
    return (
        <div className="about-me-image-section">
            <div className="dots dots-top"></div>
            <img src={profileImage} alt="srijon" className="profile-image" />
            <div className="dots dots-bottom"></div>
        </div>
    )
}

export default Aboutmeimage;