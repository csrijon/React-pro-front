import React from 'react'
import './Routeabout.css'
import "../ui/Aboutme.jsx"
import AboutMe from '../ui/Aboutme.jsx'
import Aboutmeimage from '../ui/Aboutmeimage.jsx'
import './AboutMe.css';

const Routeabout = () => {
    return (
            <section className="about-section-route">
                <h1 className="section-title-route">
                    <span className="slash-route">/</span>about-me
                </h1>
                <p className="subtitle-route">Who am i?</p>
                <div>
                    <AboutMe />
            <Aboutmeimage />
                </div>
            </section>
    )
}

export default Routeabout
