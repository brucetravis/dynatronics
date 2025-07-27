import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../components/configs/firebase/firebase";
import { toast } from "react-toastify";


// Create the WishList context
const WishListContext = createContext()

// Create a cutom hook so that we don't have to manually use the wishlist context
export const useWish = () => useContext(WishListContext)

// Export the WishProvider
export default function WishProvider({ children }) {

    // state to display the wishlist component when the wishlist icon is clicked
    const [ showWish, setShowWish ] = useState(false) // initial state is false meaning that the component is hidden

    // state to hold all the wishList products
    const [ wishListProducts, setWishListProducts ] = useState([]) // Initial state is an array


    // Function to fetch a specific product/document from the database
    const fetchWishListProduct = async (productId) => {

        try {
            // Create a reference to a specific document in firestore
            const wishProdRef = doc(db, "Products", productId)

            // SnapShot of the product
            const wishProdSnapShot = await getDoc(wishProdRef)
            
            // Update the state that will render the product data
            setWishListProducts((prev) => {

                // Check If the product has already been added to WishList
                const alreadyInWishList = prev.some(item => item.id === productId)

                if (alreadyInWishList) {
                    // Notify the user thet the product is already in the WishList
                    toast.warning("Product already in WishList")
                    // Exit the function and return the remaining Items
                    return prev 
                }

                // An array to update the state when a new product is added
                const updatedWishList = [
                    // Get all the previous wishList products to keep track of them
                    ...prev,
                    {
                        // Get the data that has been stored searately in firestore
                        id: wishProdSnapShot.id,
                        // Spread all the product data
                        ...wishProdSnapShot.data()
                    }
                ]

                // store the products in localStorage to prevent the wishList from being cleared when the page is refreshed
                localStorage.setItem("WishListItems", JSON.stringify(updatedWishList))

                // Inform the user that the product has been added to the wishList
                toast.success("Product Added To WishList")

                // Return all the products so that they can be rendered
                return updatedWishList
            })
            
        } catch (err) {
            console.error("Error fetching Product fro WishList", err)
        }
    }


    // useEffect to fetch the products from localStorage when the page is refreshed os mounted
    useEffect(() => {
        // Get the products stored in localStorage
        const storedProducts = localStorage.getItem("WishListItems")
        
        // Check If It exists
        if (storedProducts) {
            // Update the state with the a parsed version
            setWishListProducts(JSON.parse(storedProducts))
        }
    }, [])


    // Function to remove an Item stored in the WishList
    const removeWishItem = (productId) => {

        // Function to update the wishList
        setWishListProducts((prev) => {

            // Filter the wishList to only remain with the products that you want
            const updatedWishList = prev.filter(item => item.id !== productId)

            // Update local storage wiht a new array of Items
            localStorage.setItem("WishListItems", JSON.stringify(updatedWishList))

            // Inform the user that the product has been removed from wishList
            toast.success("Product Removed from WishList successfully")
        
            return updatedWishList
        })

    }

    // function to clear the wishList
    const clearWish = () => {

        // Clear the WishList
        setWishListProducts([])

        // Remove the localStorage folder
        localStorage.setItem("WishListItems", JSON.stringify([]))
    
        // Notify the user that the wishList has been cleared successfully
        toast.success("WishList cleared Successfully")
    }

    return (
        <WishListContext.Provider value={{
            showWish, setShowWish,
            wishListProducts,
            fetchWishListProduct, 
            removeWishItem,
            clearWish
        }}>
            { children }
        </WishListContext.Provider>
    )
}

