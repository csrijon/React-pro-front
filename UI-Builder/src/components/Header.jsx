import React from 'react'
import "../css/Header.css"
import logo from "../assets/logo.png"

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
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Header;