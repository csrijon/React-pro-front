import React from "react";
import "./Experience.css"

const Experience = () => {
    return (
        <section className="Experience-section">
            <h1 className="Conatact-heading" ><span>/</span>Experience</h1>

            <div className="middle-main">
                <div className="timeline-item">
                    <span className="line" ></span>
                    <h3 className="ex-heading" ><span>#</span>Software Developer</h3>
                    <div className="detalis-contain">
                        <p>Esplanade, Kolkata,West Bengal</p>
                        <p>Nov 2025 -Ongoing</p>
                    </div>
                    <div className="timeline-content">
                        <ul>
                            <li>Developing responsive websites using HTML, CSS, JavaScript, and React.js with clean and reusable components.</li>
                            <li>Building cross-platform mobile applications using React Native with smooth UI and performance optimization.</li>
                            <li>Implementing backend APIs using Node.js and Express.js and integrating them with frontend applications.</li>
                            <li>Managing application data and authentication using MongoDB and following full-stack development best practices.</li>
                        </ul>

                    </div>
                </div>
                <div className="timeline-item">
                    {/* <span className="dots" ></span> */}
                    <div className="timeline-content">
                        <h3 className="ex-heading" ><span>#</span>Web Developer Internship</h3>
                        <div className="detalis-contain">
                            <p>Saltlake Sector-V,Kolkata,West Bengal</p>
                            <p>Sep 2024-Nov 2024</p>
                        </div>
                        <ul>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quisquam?</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium voluptates illum beatae?</li>
                        </ul>
                    </div>
                </div>

                <div className="timeline-item">
                    {/* <span className="dots" ></span> */}
                    <div className="timeline-content">
                        <h3 className="ex-heading" ><span>#</span>React Js Developer Internship</h3>
                        <div className="detalis-contain">
                            <p>Esplanade, Kolkata,West Bengal</p>
                            <p>Aug 2025-Sep 2025</p>
                        </div>
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