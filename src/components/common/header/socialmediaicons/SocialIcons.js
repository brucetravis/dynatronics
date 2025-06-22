import React from 'react'
import './SocialIcons.css'
import {  Facebook, Instagram } from 'lucide-react'
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6'
import { Tooltip } from 'react-tooltip'

export default function SocialIcons() {
  return (
    <div className='social-media-icons '>
        <Facebook 
            size={28} 
            className='social-icon facebook'
            data-tooltip-id="facebookTip"
            onClick={() => window.open('https://facebook.com/dynatronics', '_blank')}

        />

        <FaWhatsapp 
            size={28} 
            className='social-icon whatsapp' 
            data-tooltip-id='whatsappTip' 
            onClick={() => window.open('https:/whatsapp.com/dynatronics', '_blank')} 
        
        />

        <Instagram 
            size={28} 
            className='social-icon instagram' 
            data-tooltip-id="instagramTip" 
            onClick={() => window.open('https://instagram.com/dynatronics', '_blank')}
        />

        <FaXTwitter 
            size={28} 
            className='social-icon x' 
            data-tooltip-id="xTip" 
            onClick={() => window.open("https://x.com/dynatronics", '_blank')}
        />
        
        <Tooltip id='facebookTip' effect="solid" place='bottom' className='custom-social-tooltip facebook-tooltip' >Facebook</Tooltip>
        <Tooltip id='whatsappTip' effect="solid" place='bottom' className='custom-social-tooltip whatsapp-tooltip' >WhatsApp</Tooltip>
        <Tooltip id='instagramTip' effect='solid' place='bottom' className='custom-social-tooltip instagram-tooltip' >Instagram</Tooltip>
        <Tooltip id='xTip' effect="solid" place='bottom' className='custom-social-tooltip x-tooltip' >twitter</Tooltip>

    </div>
  )
}
