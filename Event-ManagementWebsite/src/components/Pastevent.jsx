import React from "react";
import dummyData from "./data.js"
import "../css/Pastevent.css"

const Pastevent = () => {
    return (
        <section className="Pastevent-section"> 
            <div className="container">
                <div className="Event-grid">
                    {dummyData.map((item) => (
                        <div className="Event-card" key={item.id}>
                            <img src={item.Imageurl} alt="event images" />
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Pastevent