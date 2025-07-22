import { createContext, useContext, useState, useEffect } from "react"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../components/configs/firebase/firebase";


// Create the shopContext
const ShopContext = createContext()

// Create a custom hook instead of using the actual context in the other pages
export const useShop = () => useContext(ShopContext)

export default function ShopProvider({ children }) {

    // state to display the shopping Cart when the shopping cart icon is clicked
    const [ showCart, setShowCart ] = useState(false) // Initial state is false meaning that the shopping cart is hidden
    
    // state to display the products in the cart
    const [ cartProducts, setCartProducts ] = useState([]) // initial state is an empty array

    // function to add a product to cart
    const fetchCartProduct = async (productId) => {

      try {
        // Create a reference to the product/document in Firebase accroding to It's Id
        const productRef =  doc(db, "Products", productId)
        // Take a snapShot of the product data
        const productSnapShot = await getDoc(productRef)

        // Check If the product exists
        if (productSnapShot.exists()) {
          // Update the state with the latest product
          setCartProducts((prev) => {

            // Check If the product is already in the cart
            const alreadyInCart = prev.some(item => item.id === productSnapShot.id)
            
            // If the product already exists in the cart
            if (alreadyInCart) {
              // Inform the user that the product already exists in cart
              toast.warning("Product Already exists in Cart")
              // Exit the function to stop the product from being added to the cart and return the old cart unchanged
              return prev
            }

            // Function to update the cart
            const updatedCartProduct = [
              // Copy all the previous cart Items to keep track of them
              ...prev,
              {
                // Get the unique Id of a product
                id: productSnapShot.id,
                ...productSnapShot.data()
              }
            ]

            // Save the updated product to local storage
            localStorage.setItem("CartItems", JSON.stringify(updatedCartProduct))

            // Inform the user that the product has been added to the cart successfully
            toast.success("Product Added to cart successfully")

            // Return the updated array of products with the new product so that the cart is updated too
            return updatedCartProduct
          })
          
        }

      } catch (err) {
        console.log( "Product Does not exists. Kindly Choose another product or add this one to wishList")

      } 
    }

    // useEffect to run some login on mount
    useEffect(() => {
      // Get the product from local storage so that the cart is not cleared when we refresh the page
      const storedData = localStorage.getItem("CartItems")

      // If It is the stored data
      if (storedData) {
        // Parse the stored cart JSON string into a real array/object
        setCartProducts(JSON.parse(storedData))
      }
    }, [])

    // function to remove a product from the cart
    const removeCartProduct = (productId) => {
      // Update the function to remove the product
      setCartProducts((prev) => {

        // Filter the cart to remove a product from the cart
        const updatedCart = prev.filter(item => item.id !== productId)

        // Update the local storage by saving the new list of Items
        localStorage.setItem("cartItems", JSON.stringify(updatedCart))

        // Inform the user that the Item has been removed successfully
        toast.success("Product removed from cart successfully")

        // return the updated array with all the products except the product that has just been removed
        return updatedCart
      })
    }

    // function to enable a user to own a product during checkout
    const checkOut = async (cartProducts) => {

      // Get the Id of the currently logged in user so that they can own the product
      const userId = auth.currentUser?.uid

      // If it is not the current user,
      if (!userId) {
        // Display an error
        toast.error("You Must be Logged In to checkOut")
        return // We will return undefined the actual value returned when there is not user
      }

      // Create a reference to a specific users subcollection to save the products they purchase in firestore
      const usersProductsRef = collection(db, "users", userId, "purchasedProducts")

      // Loop though the users cart products using for... of
      for (const product of cartProducts) {

        // Add the product
        try {
          // await while adding each product to that specific users subcollection
          await addDoc(usersProductsRef, {
            ...product, // spread all the products Details
            userId: userId,
            purchasedAt: serverTimestamp() // Record the time of purchase
          })

        } catch (err) {
          console.error("Error saving Product", err)
        }
      }

      // Clear the cart
      setCartProducts([])

      // Clear the local storage
      localStorage.removeItem("CartItems")

      toast.success("Order placed — complete payment to proceed 🔐")
  }

    return (
        <ShopContext.Provider value={{
            showCart, setShowCart,
            cartProducts, setCartProducts,
            fetchCartProduct,
            removeCartProduct,
            checkOut
        }}>
            { children }
        </ShopContext.Provider>
    )
}