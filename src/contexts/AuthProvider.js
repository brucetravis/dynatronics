import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../components/configs/firebase/firebase'
import { toast } from 'react-toastify'
import { doc, getDoc } from 'firebase/firestore'

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


    // state to display the products in the cart
    const [ cartProducts, setCartProducts ] = useState([]) // initial state is an empty array

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

    // function to create a reference to a specific product/document by It's specific Id
      const fetchCartProduct = async (cartProductId) => {
    
        try {
          // create a reference to a particular product by It's unique Id
          const cartProductRef = await doc(db, "Products", cartProductId)
    
          // Take a snapshot of the unique cart product ( This is the actual product data)
          const cartProductSnapShot = await getDoc(cartProductRef)
    
    
          // Check If the product exists
          if (cartProductSnapShot.exists()) {
    
            // If It does, update the state with all the product info
            setCartProducts((prev) => [
              
              // Keep track of all the product added
              ...prev,
              {
              // Get the uniqu Id since It is stored separately
              id: cartProductRef.id,
              // Get the rest of the product info
              ...cartProductSnapShot.data()
            }])
    
            // Update the user that the Item has been added to cart successfully
            toast.success("Product Added to Cart successfully")
    
          } else {
            // Check if a product has already been added in the cart
            // cartProducts.some((product) => )

            // If It Is already in the cart, Do not add It to the cart and inform the user that the product is already in the cart
            console.log("Product Does not Exist")
          }
        } catch (err) {
          console.err("Error fetching  product from firestore")
        }
        
      }
    
  return (
    <AuthContext.Provider value={{ 
      user, setUser, 
      showCart, setShowCart, 
      showWish, setShowWish, 
      showSearch, setShowSearch,
      cartProducts, setCartProducts,
      fetchCartProduct
    }}>
        { children }
    </AuthContext.Provider>
  )
}
