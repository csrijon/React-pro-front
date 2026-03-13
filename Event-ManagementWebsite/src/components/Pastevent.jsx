import React from "react";
import dummyData from "./data.js"
import "../css/Pastevent.css"
import Topsection from "../ui/Topsection.jsx";
// import FilterBar from "./FilterBar.jsx";

const Pastevent = () => {
    return (
        <section className="Pastevent-section"> 
            {/* <FilterBar/> */}

            <div className="container">
                <Topsection title="Past Events" />

                <div className="Event-grid">
                    {dummyData.map((item) => (
                        <div className="Event-card" key={item.id}>
                            <img src={item.Imageurl} alt="event images" />

                            <div className="card-content">
                                <h3>{item.title}</h3>

                                <div className="rating">
                                    ⭐ {item.rating} / 5
                                </div>

                                <p>{item.description}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pastevent