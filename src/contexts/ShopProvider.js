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


    // function to add a product to cart by the productId from the database
    const fetchCartProduct = async (productId) => {

      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || []

        // check if the product alreayd exists in local storage
        const existingProductInLocal = localCart.some(item => item.id === productId)

        if (existingProductInLocal) {
          // Inform the user
          toast.warning("Product Already in Cart.")
          return

        }

        // Add to localstorage instantly
        const updatedLocalCart = [...localCart, { id: productId, qty: 1 }]
        localStorage.setItem("cart", JSON.stringify(updatedLocalCart))        

        // create a reference to the cart product
        const cartProductRef = doc(db, "Products", productId)
        // Get the product SnapShot
        const cartProductSnap = await getDoc(cartProductRef)

        // 5. Update React state (UI updates instantly)
        setCartProducts(prev => [
          ...prev,
          { id: cartProductSnap.id, ...cartProductSnap.data(), qty: 1 }
        ]);

        toast.success("Product added to cart.");

      } catch (err) {
        console.error("Error Fetching cart Product: ", err)
      }

    }

    // fetch the cacrt products from the cart on user Login
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {

        // If the user is not logged in
        if (!user) {
          // clear the cart
          setCartProducts([])
          localStorage.removeItem("cart")
          // Exit the function
          return
        }
        
        // Read cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || []

        // instant UI update
        setCartProducts(savedCart)
        

        // background fetch from firebase
        const detailedCart = await Promise.all(
          savedCart.map(async (item) => {
            // fetch product details from the products collection
            const productRef = doc(db, "Products", item.id)
            const productSnap = await getDoc(productRef)

            // Return full product object
            return {
              id: productSnap.id,
              ...productSnap.data(),
              qty: item.qty
            }

          })
        )

        setCartProducts(detailedCart)
        localStorage.setItem("cart", JSON.stringify(detailedCart))

        return () => unsubscribe() // clean up the listener

      }, [])

    }, [])


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


    // function to remove a product from cart
    const removeCartProduct = async (productId) => {
      // Remove by altering the state function
      setCartProducts((prev) => {
        const remProducts = prev.filter((product) => product.id !== productId)
        
        // Notify the user that the product has been removed from the cart
        toast.success("Product removed from cart.")

        // Return the remaining cart products
        return remProducts
      })

      const localCart = JSON.parse(localStorage.getItem("cart")) || []
      const updatedLocalCart = localCart.filter(item => item.id !== productId)
      localStorage.setItem("cart", JSON.stringify(updatedLocalCart))
      
      // try {
      //   // Check if It is the current user
      //   const user = auth.currentUser

      //   // Create a reference to the cart Product by the Id
      //   const removedProductRef = doc(db, "users", user.uid, "cart", productId)
      //   // delete the document
      //   await deleteDoc(removedProductRef)

      // } catch(err) {
      //   console.error("Error removing a product from cart.")
      // }
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