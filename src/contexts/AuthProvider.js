import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../components/configs/firebase/firebase'

// create the context
const AuthContext = createContext()

// create a custom hook/ function to access the context easily
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  
    // state to display the shopping Cart when the shopping cart icon is clicked
    const [ showCart, setShowCart ] = useState(false) // Initial state is false meaning that the shopping cart is hidden

    // state to display the wishlist component when the wishlist icon is clicked
    const [ showWish, setShowWish ] = useState(false) // initial state is false meaning that the component is hidden

    
    // State to display the search input when the search Icon is clicked
    const [ showSearch, setShowSearch ] = useState(false) // Initial state is false meaning that the search input is initially hidden

    // state to store the firebase user context
    const [ user, setUser] = useState(null) // initlal state is null/ nothing

    // useEffect to check If the auth state has changed
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (u) => {
            
          // If It is the user
          if (u) {
            // Update the user state(variable to store the user) to true
            setUser(u)
            // Update the console with the users email
            console.log(u)
          } else {
            // Update the state to null meaning
            setUser(null)
            console.log('No user logged in')
          }
        })
        return () => unSubscribe() // stop listening If the user is logged in or not when the component is unmounted
    }, [])
    
  return (
    <AuthContext.Provider value={{ user, setUser, showCart, setShowCart, showWish, setShowWish, showSearch, setShowSearch }}>
        { children }
    </AuthContext.Provider>
  )
}
