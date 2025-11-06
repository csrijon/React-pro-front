import React from 'react'

const Contacttop = (props) => {
  return (
    <div className="contact-content">
        <h2 className="contact-heading">
          <span className="accent-text">{props.icon}</span>contacts
        </h2>
        <p className="contact-description">
          I'm interested in freelance opportunities. However, if you have other
          requests or questions, don't hesitate to contact me.
        </p>
      </div>
  )
}

export default Contacttop
