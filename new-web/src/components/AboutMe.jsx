import './AboutMe.css';
import profileImage from '../assets/Image.png';


const AboutMe = () => {
  return (
    <section id='about' className="about-me-container">
      <div className="about-me-content">
        <h2 className="about-me-heading">
          <span className="accent-text">#</span>about-me
        </h2>
        <div className="about-me-text">
          <p>Hello, I'm Srijon!</p>
          <p>
            I'm a self-taught front-end developer based in Kyiv, Ukraine. I can
            develop responsive websites from scratch and raise them into modern
            user-friendly web experiences.
          </p>
          <p>
            Transforming my creativity and knowledge into a websites has been my
            passion for over a year. I have been helping various clients to
            establish their presence online. I always strive to learn about the
            newest technologies and frameworks.
          </p>
          <button className="read-more-btn">
            Read more <span className="arrow">→</span>
          </button>
        </div>
      </div>
      <div className="about-me-image-section">
        <div className="dots dots-top"></div>
        <img src={profileImage} alt="Elias" className="profile-image" />
        <div className="dots dots-bottom"></div>
      </div>
    </section>
  );
};

export default AboutMe;