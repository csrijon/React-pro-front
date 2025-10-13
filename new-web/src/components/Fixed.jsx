import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import "./Fixed.css"

const Fixed = () => {
  return (
    <section className='fixed-container' >
      <div className="linne"></div>
      <div className="social-icon">
        <a href=""><LinkedInIcon/></a>
        <a href=""><GitHubIcon/></a>
        <a href=""><InstagramIcon/></a>
      </div>
    </section>
  )
}

export default Fixed
