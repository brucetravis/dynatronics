import React, { useState } from 'react'
import './HeaderIcons.css'
import { Heart, Info, LogOut, Search, ShoppingCart, User2 } from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../../configs/firebase/firebase'
import { useAuth } from '../../../../contexts/AuthProvider'
import LogOutModal from '../../../modals/logout/LogOutModal'
import { toast } from 'react-toastify'

export default function HeaderIcons() {

  // initialize useNavigate() to navigate to another page onClick
  const navigate = useNavigate()
  // Use the user context
  const { user } = useAuth()
  // state to display the logout modal
  const [ showLogOutModal, setShowLogOutModal ] = useState(false) // initial state is false meaning hide the card

  // function to navigate to another page
  const handleNavigate = () => {
    navigate('/register', { replace: true })
  }

  // function to open and close the log outModal
  const openModal = () => setShowLogOutModal(true) // when opening show the log out Modal
  const closeModal = () => setShowLogOutModal(false) // when logging out hide the modal

  // function to handle the log out
  const handleLogOut = async () => {
    // sign out or log out
    await signOut(auth)
    // Hide the Modal
    closeModal()
    // alert the user that they have been logged out
    toast.success("Logging Out......")
    // After logging Out navigate to another page
    navigate('/home', { replace: true })
  }

  // Get the cart function from Auth state in order to display the shopping Cart
  const { setShowCart, setShowWish, setShowSearch } = useAuth()

  
  return (
    <>
      <div className='header-icons '>
        <Search
          size={30} 
          data-tooltip-id="searchTip" 
          className='icon search'
          onClick={() => setShowSearch(prev => !prev)}
        />
        
        {user ? (
          <LogOut 
            size={30}
            className='icon logout'
            data-tooltip-id="logoutTip"
            onClick={openModal} // when cicked open the logoutModal
          />
        ) : (
          <User2 
            size={30} 
            data-tooltip-id="userTip" 
            className='icon user' 
            onClick={handleNavigate}
          />
        )}

        <Heart 
          size={30} 
          data-tooltip-id="heartTip" 
          className='icon heart' 
          onClick={() => setShowWish(prev => !prev)}
        />

        <ShoppingCart 
          size={30} 
          data-tooltip-id="cartTip" 
          className='icon cart'
          onClick={() => setShowCart(prev => !prev)}
        />

        <Info size={30} data-tooltip-id="aboutTip" className='icon about' />

        <Tooltip id="searchTip" effect="solid" place="bottom" className="custom-tooltip search-tooltip" >search</Tooltip>
        <Tooltip id="userTip" effect="solid" place="bottom" className="custom-tooltip user-tooltip">Sign Up</Tooltip>
        <Tooltip id="logoutTip"  place="bottom" className="custom-tooltip logout-tooltip">Log out</Tooltip>
        <Tooltip id="heartTip" effect="solid" place="bottom" className="custom-tooltip heart-tooltip">WishList</Tooltip>
        <Tooltip id="cartTip" effect="solid" place="bottom" className="custom-tooltip cart-tooltip" >Cart</Tooltip>
        <Tooltip id="aboutTip" effect="solid" place="bottom" className="custom-tooltip about-tooltip" >About</Tooltip>
    
      </div>

      {/* Show the component only when the state is true */}
      {showLogOutModal && (
        <LogOutModal onClose={closeModal} onLogOut={handleLogOut}/>
      )}
    
    </>
  )
}
