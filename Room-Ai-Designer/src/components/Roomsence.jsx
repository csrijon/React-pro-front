import Button from "../components/Button.jsx";
import SceneActions from "./SceneActions.jsx";
import bed10 from "../assets/bed10.jpeg"
import bed9 from "../assets/bed9.jpeg"
import bed8 from "../assets/bed8.jpeg"
import bed7 from "../assets/bed7.jpeg"
import bed6 from "../assets/bed6.jpeg"
import bed5 from "../assets/bed9.jpeg"
import "../css/Roomsence.css"


const Roomsence = () => {

    const roomdata =[
        {
            img:bed10,
            title:"Modern Bedroom Design",
            date:"2023-10-01"
        },
        {
            img:bed9,
            title:"Cozy Bedroom Setup",
            date:"2023-09-15"
        },
        {
            img:bed8,
            title:"Minimalist Bedroom",
            date:"2023-08-20"
        },
        {
            img:bed7,
            title:"Luxury Bedroom Interior",
            date:"2023-07-30"
        },
        {
            img:bed6,
            title:"Rustic Bedroom Style",
            date:"2023-06-25"
        },
        {
            img:bed5,
            title:"Contemporary Bedroom",
            date:"2023-05-10"
        }
    ]
    return (
        <>
            <section className="roomsence-section"> 
                <div className="roomsence-container">
                    <h2>My Room Scenes</h2>
                    <div className="button-container">
                        <Button name="Room Type" />
                        <Button name="Date" />
                    </div>
                    <div className="sence-feature">
                        <SceneActions />
                    </div>
                    <div className="sence-images">
                        {roomdata.map((item,index)=>(
                            <div className="sence-image-card" key={index}>
                                <img src={item.img}
                                    alt={item.title} />
                                <h3>{item.title}</h3>
                                <p>{item.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Roomsence;