import aboutlogo from "../assets/aboutlogo.webp"
import './Fanfact.css'

const Funfact = () => {

    const data = [
        { fact: "I love hiking and exploring new trails." },
        { fact: "I can code for hours if there’s coffee involved." },
        { fact: "I once built a website entirely on my phone during a train ride." },
        { fact: "My favorite debugging tool is a cup of chai and some lo-fi music." },
        { fact: "I enjoy solving logic puzzles and brain teasers." },
        { fact: "I can remember CSS color codes better than phone numbers." },
        { fact: "I’m a night owl developer — most of my best ideas come after midnight." },
        { fact: "I once spent 3 hours fixing a bug that needed just one missing semicolon." },
        { fact: "I enjoy learning random tech facts just for fun." },
        { fact: "I love clean, minimal, and responsive UI design." }
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