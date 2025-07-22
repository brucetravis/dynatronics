import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import ElectricMap from '../../electricmap/ElectricMap'

export default function Footer() {
  return (
    <footer className='footer-section'>
      <div className='footer-container'>

        <div className='footer-logo'>
          <Link to='/'>DY<span>naTronics</span></Link>
          <p>Powering the Future</p>
        </div>

        <div className='footer-links'>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to='/home'>Home</Link></li>
            <li><Link to='/'>Shop</Link></li>
            <li><Link to='/about'>About</Link></li>
            <li>
              <a
                href='tel:+254 712 345 678'
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className='footer-socials'>
          <h4>Connect</h4>
          <div className='footer-social-icons'>
            <a 
              href="https://facebook.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className=''
            >
              <Facebook size={30} />
            </a>
            <a 
              href="https://instagram.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className=''
            >
              <Instagram size={30} />
            </a>
            <a 
              href="https://twitter.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className=''
            >
              <FaXTwitter size={30} />
            </a>
          </div>
        </div>

        <div className='footer-map'>
          <ElectricMap />
        </div>

      </div>

      <div className='footer-bottom'>
        &copy; { new Date().getFullYear() } DYnaTronics. All Rights Reserved
      </div>
    </footer>
  )
}
