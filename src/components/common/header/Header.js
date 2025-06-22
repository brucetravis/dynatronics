import React from 'react'
import './Header.css'
import HeaderIcons from './headericons/HeaderIcons'
import SocialIcons from './socialmediaicons/SocialIcons'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='header-section'>
        <div className='social-icons'>
          <SocialIcons />
        </div>
        <div className='logo'>
          <Link to='/'>
            DY<span>naTronics</span>
          </Link>
        </div>
        <div>
          <HeaderIcons />
        </div>
    </div>
  )
}
