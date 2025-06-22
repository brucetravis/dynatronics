import React from 'react'
import './HeaderIcons.css'
import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import { Tooltip } from 'react-tooltip'

export default function HeaderIcons() {
  return (
    <div className='header-icons '>
        <Search size={30} data-tooltip-id="searchTip" className='icon search' />
        <User size={30} data-tooltip-id="userTip" className='icon user' />
        <Heart size={30} data-tooltip-id="heartTip" className='icon heart' />
        <ShoppingCart size={30} data-tooltip-id="cartTip" className='icon cart' />
    
        <Tooltip id="searchTip" effect="solid" place="bottom" className="custom-tooltip search-tooltip" >search</Tooltip>
        <Tooltip id="userTip" effect="solid" place="bottom" className="custom-tooltip user-tooltip">User</Tooltip>
        <Tooltip id="heartTip" effect="solid" place="bottom" className="custom-tooltip heart-tooltip">WishList</Tooltip>
        <Tooltip id="cartTip" effect="solid" place="bottom" className="custom-tooltip cart-tooltip" >Cart</Tooltip>
    
    </div>
  )
}
