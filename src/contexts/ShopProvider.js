import { createContext, useContext, useState, useEffect } from "react"
import { auth, db } from '../components/configs/firebase/firebase'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"



// Create the shopContext
const ShopContext = createContext()

// Create a custom hook instead of using the actual context in the other pages
export const useShop = () => useContext(ShopContext)

export default function ShopProvider({ children }) {

    const navigate = useNavigate()

    // state to display the shopping Cart when the shopping cart icon is clicked
    const [ showCart, setShowCart ] = useState(false) // Initial state is false meaning that the shopping cart is hidden

    // state that will display all the cart products
    const [ cartProducts, setCartProducts ] = useState([]) // The initial state is an array

    // state to control the products count
    const [ prodCount, setProdCount ] = useState(1) // The initial state is one


    // function to add products to cart
    const fetchCartProduct = async (productId) => {

      try {
        // Create a reference to a specific product according to It's Id
        const cartProductRef = doc(db, "Products", productId)
        // Take a SnapShot of the product to get It's data
        const cartProductSnapShot = await getDoc(cartProductRef)
        
        // Update the state using the function
        setCartProducts((prev) => {

          // Check If the product already exists in the cart
          const existingProduct = prev.some(item => item.id === productId)

          // If the product already exists
          if (existingProduct) {
            // Notigy the user that the product already exists
            toast.warning("Product already exists in Cart")
            // return all previous products
            return prev // If we don't undefined will be returned and cause an error
          
          } else {

            // Update the state with an array of the products from the database
            const updatedCart = [
              // spread out/Copy all previous products into the cart
              ...prev, {
                // Get the Id which was stored separately
                id: cartProductSnapShot.id,
                ...cartProductSnapShot.data() // spread out the product data
              }
            ]

            console.log(updatedCart)

            // Notify the user that the product has been added to Cart successfully
            toast.success("Product Added to cart successfully.")

            // return all the products
            return updatedCart
          }

        })

        // save the products to the cart according to the userId

        // Get the current user
        const user = auth.currentUser

        // If It is the current user
        if (user) {
          
          // Create a reference to where the product will be stored in the cart of each users Id
          const userCartRef = doc(db, "users", user.uid, "Cart", productId)

          // Save the users cart products in that referenced sub-collection
          await setDoc(userCartRef, {
            // Spread out all the other product details in the cart
            ...cartProductSnapShot.data()
          })
        
        }
        
      } catch (err) {
        console.error("Error fetching Products from cart: ", err)
      }
    }


    // useEffect to fetch the cart products from the "Cart" sub-collection on mount/ when the page mounts
    useEffect(() => {
      
      // function to fetch a users cart
      const unsubscribe = onAuthStateChanged(auth, async (user) => {

        // If the user is not logged in, meaning that user is undefined
        if (!user) {
          // Clear the cart
          setCartProducts([])

          return

        } else {
          // Fetch the logged in users cart from the database

          
          // Create a reference to the exact location where the products have been stored
          const userCartCollectionRef = collection(db, "users", user.uid, "Cart")

          // Get the data of all documents from that collection
          const productSnapShot = await getDocs(userCartCollectionRef)

          // log the products for debugging purposes
          console.log(productSnapShot)

          // Map through all the documents to get the Id and the data
          const userCart = productSnapShot.docs.map(document => ({
            // Get the Id that has been stored separately
            id: document.id,
            // Spread out the rest of the data
            ...document.data()
          }))

          // console.log(userCart)

          // Update the cart with the products that have been saved to each users cart collection
          setCartProducts(userCart)
        }

      })

      return () => unsubscribe() // clean up the listener
    }, [])



    // function to remove an Item from the cart
    const removeCartProduct = async (productId) => {

      // Update the state to remain with all products except from the product removed
      setCartProducts((prev) => {
        // filter the state to only remain with products the are not the removed product
        const filteredProducts = prev.filter(product => product.id !== productId)

        // Return the products
        return filteredProducts
      })

      // Notify the user that the product has been removed
      toast.success("Product removed from Cart Successfully.")

      // Remove the product from the data base subcollection
      try {

        // Get the current user
        const user = auth.currentUser
        // Create a reference to the sub-collection
        const removedProductRef = doc(db, "users", user.uid, "Cart", productId)

        // Remove the document
        await deleteDoc(removedProductRef)

      } catch (err) {
        console.error("Error Removing Product from database")
      }

    }


    // function to checkout products and enable a user own products
    const checkOut = async (cartProducts) => {

      // Get the current Id of the logged In user
      const userId = auth.currentUser?.uid

      // If no user is logged In, meaning that auth.current.user is undefined
      if (!userId) {
        // Notify the user that they cannot checkout unless thay Log in first
        toast.warning("You cannot Check out unless you have an Account / Log In")
        navigate('/register')
        return // Return undefined the current value of auth
      }

      // Create a reference to a specific user subcollection to save the product to firestore
      const usersProductRef = collection(db, "users", userId, "purchasedProducts")

      // Loop through each product in cart to add the products to firestore
      for (const product of cartProducts) {

        // Add the purchased products to that collection
        try {
          // await while adding products to that specific users subcollection
          await addDoc(usersProductRef, {
            ...product, // spread all the products
            user: userId,
            purchasedAt: serverTimestamp(), // record the time of purchase
            selectedQuantity: product.selectedQuantity || 1
          })

        } catch (err) {
          console.error("Error Adding products to database", err)
        }
      }

      // Clear the localStorage
      // localStorage.removeItem("CartItems")

      // Inform the user that order is in progress
      toast.success("Order placed — complete payment to proceed 🔐")

      // navigate to the payment page which is dynamic for each specific user
      navigate(`/payment/${userId}`)

      // Clear the cart
      // setCartProducts([])
    }
    

    return (
        <ShopContext.Provider value={{
            showCart, setShowCart,
            cartProducts, setCartProducts,
            fetchCartProduct,
            removeCartProduct,
            checkOut,
            prodCount, setProdCount
        }}>
            { children }
        </ShopContext.Provider>
    )
}