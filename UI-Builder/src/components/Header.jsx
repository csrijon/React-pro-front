import React from 'react'
import "../css/Header.css"
import logo from "../assets/logo.png"
import Person from "../assets/person.jpg"

const Header = () => {
  return (
    <>
      <section className='Header-Container' >
        <div className="mini-header">
          <div className="left-header">
            <img className='logo-img' src={logo} alt="logo" />
          </div>
          <div className="right-header">
            <div className="user-image">
              <img src= {Person} alt="person" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Header;