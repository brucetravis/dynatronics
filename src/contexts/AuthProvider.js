import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../components/configs/firebase/firebase'

// create the context
const AuthContext = createContext()

// create a custom hook/ function to access the context easily
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  

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
    <AuthContext.Provider value={{ 
      user, setUser
    }}>
        { children }
    </AuthContext.Provider>
  )
}
