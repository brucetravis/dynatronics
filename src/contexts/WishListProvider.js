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

    // State to contain all the wishList products when they are added to the WishList
    const [ wishListProducts, setWishListProducts ] = useState([]) // Initial state is an empty array


    // Function to fetch the wishlist products
    const fetchWishListProduct = async (ProductId) => {

        try {
            // Create a reference of the specific product in firestore
            const wishListProductRef = doc(db, "Products", ProductId)

            // Get the actaul product data by taking a snap shot of It
            const wishProductSnapShot = await getDoc(wishListProductRef)

            // Chekc If the product exists
            if (wishProductSnapShot.exists()) {
                // If It does, take all that data and Update the wishList ProductState with that data
                setWishListProducts((prev) => {

                    // First check if the product has already been adde to the wishList 
                    const wishProductCheck = prev.some(item => item.id === wishProductSnapShot.id)
                    
                    // If there is a match meaning that at east one product matches the product snapshot
                    if (wishProductCheck) {
                        // Inform the user that the product has aready been added to wishList
                        toast.warning("Product Already in WishList")
                        // Just return products and do not add the new products
                        return prev
                    }

                    const updatedWishProducts = [
                        ...prev, {
                            id: wishProductSnapShot.id,
                            ...wishProductSnapShot.data()
                        }
                    ]
                    
                    // save the products to localstorage so that they do not disapear whe refreshing the page
                    localStorage.setItem("WishListItems", JSON.stringify(updatedWishProducts))
                    
                    // Inform the User that The product has been saved to wishlist
                    toast.success("Product Saved To WishList")

                    // return the updated array which is a completely different array
                    return updatedWishProducts
                })
                
            }

        } catch (err) {
            console.error("Error Getting from database")
        }
    }
    
    // useEffect to read/load products from the wishliat when the page mounts
    useEffect(() => {
        // Load the products from the local storage to the WishList
        const storedWishItems = localStorage.getItem("WishListItems")
        
        // If there are stored Items in localStorage
        if (storedWishItems) {
            // Parse the Items to the state from the localStorage
            setWishListProducts(JSON.parse(storedWishItems))
        }
    }, [])

    // function to remove Items from wishList
    const removeWishItem = (productId) => {
        // Function to update the state
        setWishListProducts((prev) => {

            // Filter the products to only remain with the products not removed 
            const updatedWishList = prev.filter(item => item.id !== productId)

            // Store the new set of Items in local storage
            localStorage.setItem("WishListItems", JSON.stringify(updatedWishList))

            // Inform the user that the product has been successfuly removed from the wishlist
            toast.success("Product removed from WishList successfully.")

            // Return the new refernce of the filterd products
            return updatedWishList
        })
    }

    // function to clear the WishList completely
    const clearWish = () => {
        // Clear the entire array
        setWishListProducts([])

        // overwrite the entire wishList state to be empty
        localStorage.setItem("WishListItems", JSON.stringify([]))
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

