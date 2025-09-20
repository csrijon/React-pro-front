import React from 'react'
import logo from "../assets/Logo.png"
import '../components/Header.css'

const Header = () => {
  return (
    <>
      <header>
        <div className="left">
            <img src= {logo} alt="logo" />
            <h4>Srijon</h4>
        </div>
        <div className="right">
            <ul>
            <li><span>#</span><a href="">home</a></li>
            <li><span>#</span><a href="">works</a></li>
            <li><span>#</span><a href="">about-me</a></li>
            <li><span>#</span><a href="">contact</a></li>
            <li><span>#</span><a href="">chat-me</a></li>
            </ul>
        </div>
      </header>
    </>
  )
}

export default Header
