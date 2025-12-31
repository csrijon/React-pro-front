import React from "react";
import "./Experience.css"

const Experience = () => {
    return (
        <section className="Experience-section">
            <h1 className="Conatact-heading" ><span>/</span>Experience</h1>

            <div className="middle-main">
                <div className="timeline-item">
                    <span className="line" ></span>
                    <p>Software Developer</p>
                    <p>Hp Edit Entireprise</p>
                    <p>2025-ongoing</p>
                    <div className="timeline-content">
                        <ul>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex.</li>
                        </ul>
                    </div>
                </div>
                <div className="timeline-item">
                    <span className="dots" ></span>
                    <div className="timeline-content">
                    <h3>Web Developer Internship</h3>
                    <p>2022-2022</p>
                    <p>Kolkata,West Bengal</p>
                    <ul>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quisquam?</li>
                        <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium voluptates illum beatae?</li>
                    </ul>
                    </div>
                </div>

                <div className="timeline-item">
                    <span className="dots" ></span>
                    <div className="timeline-content">
                        <h3>React Js Developer</h3>
                        <p>2024-2025</p>
                        <p>Esplande,Kolkata,West Bengal</p>
                        <div className="timeline-content">
                            <ul>
                                <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</li>
                                <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                                <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Experience