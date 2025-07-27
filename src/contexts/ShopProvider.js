import { createContext, useContext, useState, useEffect } from "react"
import { auth, db } from '../components/configs/firebase/firebase'
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"



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


    // function to fetch a specific cart product fro firestore and add It to the cart
    const fetchCartProduct = async (productId) => {

      try {
        // Create a reference to the product in firestore
        const productRef = doc(db, "Products", productId)

        // Take a SnapShot of the current product data to Get the curent data as of now
        const productSnapShot = await getDoc(productRef)
        
        // Update the cart state with the product data
        setCartProducts((prev) => {
          
          // Check If the product has alreday been added to the cart
          const alreadyCartItem = prev.some(item => item.id === productSnapShot.id)

          // If It is true that the product has already been added to cart
          if (alreadyCartItem) {
            // Notify the user that the product is already in the cart
            toast.warning("Product Already in Cart")
            // Do not add the product to Cart
            return
          
          } else {
            // Add the product to cart

            // A new array to return
            const updatedCart = [
              // Get all the previous cart Items to keep track of them
              ...prev, {
                // Get the product Id since It is stored separately
                id: productSnapShot.id,
                // Spread out all the product data (details of the product)
                ...productSnapShot.data()
              }
            ]
            
            // Another Problem we have to solve is that when we refresh the page the cart will be cleared
            // solution: store the product to localStorage
            
            // Storing in Local Storage
            // localStorage.setItem("CartItems", JSON.stringify(updatedCart))
            
            // Notify the use that the product has been added successfully
            toast.success("Product Added to Cart Successfully")


  


            // return the updated cart
            return updatedCart
          }
      })

      // save the products of the current user to the users cart
      const user = auth.currentUser

      // If It is the current user
      if (user) {

        // create a refernce to where the product will be saved to each users cart under each Id
        const userCartRef = doc(db, "users", user.uid, "Cart", productId)

        // save the document to the referenced location
        // setDoc creates or references a document to the reference I just made
        await setDoc(userCartRef, {
          // Get the id since It is stored separately from the other data
          id: productSnapShot.id,
          // spread out the product data
          ...productSnapShot.data()
        })
      }
      } catch (err) {
        console.error("There was a Problem Fetching the Document from firestore", err)
      }
    }


    // Another Problem is Even afteer we have stored the Products in firestore, teh cart is still cleared on refresh
    // since we have not taken the products from firestore to render them later
    useEffect(() => {
      // // Get the products from firestore
      // const storedItems = localStorage.getItem("CartItems")
    
      // // If they have been stored in firestore
      // if (storedItems) {
      //   // Parse the Items as JavaScript object to get the Item
      //   setCartProducts(JSON.parse(storedItems))
      // }

      const fetchUserCart = async () => {

        // The current user 
        const user = auth.currentUser
        
        // If It Is not the user return nothing 
        if (!user) return

        try {
          // create a reference to the users cart in the database
          const cartCollectionRef = collection(db, "users", user.id, "Cart")
          // products in the database
          const cartSnapShot = await getDocs(cartCollectionRef)

          const userCartItems = cartSnapShot.docs.map(document => ({
            // Get the document I=d which is stored separately
            id: document.id,
            ...document.data()
          }))

          // Update the state with the cart Items
          setCartProducts(userCartItems)

        } catch (err) {
          console.error("Error fetching Items", err)
        }
      }

      fetchUserCart() // call the function 
    }, [])


    // Function to remove an Item from the cart
    const removeCartProduct = (productId) => {

      setCartProducts((prev) => {
        // Filter and keep all Items except the removed Item
        const updatedCart = prev.filter(item => item.id !== productId)
        
        // Update the localStorage with the new array of Items
        localStorage.setItem("CartItems", JSON.stringify(updatedCart))

        // Notify the user that the product has been removed from Cart Successfully
        toast.success("Product Removed from Cart Successfully")
        
        // return the updated cart array
        return updatedCart
      })
    }


    // function to checkout products and enable a user own products
    const checkOut = async (cartProducts) => {

      // Get the current Id of the logged In user
      const userId = auth.currentUser?.uid

      // If no user is logged In, meaning that auth.current.user is undefined
      if (!userId) {
        // Notify the user that they cannot checkout unless thay Log in first
        toast.warning("You cannot CheckOut unless you log in")
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
            purchasedAt: serverTimestamp() // record the time of purchase
          })

        } catch (err) {
          console.error("Error Adding products to database", err)
        }
      }

      // Clear the cart
      setCartProducts([])

      // Clear the localStorage
      localStorage.removeItem("CartItems")

      // Inform the user that order is in progress
      toast.success("Order placed — complete payment to proceed 🔐")

      // navigate to the payment page which is dynamic for each specific user
      navigate(`/payment/${userId}`)
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