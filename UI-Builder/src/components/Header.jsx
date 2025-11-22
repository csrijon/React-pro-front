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
            {/* <h3>UXify</h3> */}
          </div>
          <div className="right-header">
            <div className="user-image">
              <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dperson&psig=AOvVaw1C7FtEnQA8zJvclOdPs4cE&ust=1763925089242000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNj9n5W7hpEDFQAAAAAdAAAAABAE" alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Header;