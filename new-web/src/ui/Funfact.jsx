import aboutlogo from "../assets/aboutlogo.webp"
import './Fanfact.css'

const Funfact = () => {

    const data = [
        { fact: "I love hiking and exploring new trail" },
        { fact: "I can code for hours if there’s" },
        { fact: "I once built a website entirel" },
        { fact: "My favorite debugging tool is a" },
        { fact: "I enjoy solving logic puzzles" },
        { fact: "I can remember CSS color codes" },
        { fact: "I’m a night owl developer — most of" },
        { fact: "I once spent 3 hours fixing a bug" },
        { fact: "I enjoy learning random tech facts" },
        { fact: "I love clean, minimal, and" }
    ];

    return (
        <div className="about-fun-text" >
            <h1><span>#</span>my-fun-facts</h1>
            <div className="funfact-content" >
                <div className="left-section-funfact">
                    {data.map((item, index) =>
                        <p key={index}>{item.fact}</p>)
                    }
                </div>
                <div className="right-section-funfact">
                    <img src={aboutlogo} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Funfact;