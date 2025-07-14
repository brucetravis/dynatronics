import React, { useEffect, useState } from 'react'
import './CookieBanner.css'
// import CookieConsent from 'react-cookie-consent'
import { AnimatePresence, motion } from 'framer-motion'

// funtion to save the cookie for a certai a ount of time (i.e 1 year)
const setCookie = (name, value) => {
  const days = 365
  // set he date that the cookie expires
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}


// function to check If a cookie exists
const getCookie = (name) => {
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")
}


export default function CookieBanner() {

  // state to display and hide the cookie banner
  const [ show, setShow ] = useState(true) // Initial state is true meaning the cookie banner is displayed/rendered by default
  
  // use Effect to check If the ookie exists
  useEffect(() => {
    // On mount, check If the cookie exists, If It does hide the banner If It doen't show or hide the banner (Hiding the banner depends on whether the user clicked decline or accept before)
    if (getCookie("dynatronics_consent") === "accepted") {
      // Update the state to false to hide the banner depending on whether the user clicked decline or accept before
      setShow(false)
    }
  }, []) // check only once on mount
  
  // When the accept button is clicked,
  const accept = () => {
    // save the cookie
    setCookie("dynatronics_conset", "accepted"); 
    // then hide the cookie banner
    setShow(false)
  }

  // When the decline button is clicked,
  const decline = () => {
    // Just hide he cookie banner
    setShow(false)
  }

  /* nothing  to show */
  // If show is false, return null
  // if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className='cookie-card'
        >
          <p>
            We use cookies to personalize your experience &amp; analyse traffic.
            <a href="/privacy-policy" className="cookie-link"> Learn more</a>
          </p>
          <div className="btn-row">
            <button 
              className="cookie-btn accept" 
              onClick={accept}
            >
              Accept
            </button>
            <button 
              className="cookie-btn decline" 
              onClick={decline}
            >
              Decline
            </button>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
