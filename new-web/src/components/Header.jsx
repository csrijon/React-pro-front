import React ,{useState} from 'react'
import logo from "../assets/Logo.png"
import '../components/Header.css'
import menu from "../assets/menu.svg"
import close from "../assets/close.svg"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

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
             <button onClick={toggleMenu} ><img src = {isOpen ? close: menu} alt="menu_icon" /></button>
            </ul>
        </div>
      </header>
    </>
  )
}

export default Header
