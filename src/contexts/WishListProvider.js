import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../components/configs/firebase/firebase";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";


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


    // function to fetch WishList products
    const fetchWishListProduct = async (productId) => {

       try {
        // Create a reference to a specific product in the database according to the product Id
        const wishListProductRef = doc(db, "Products", productId)

        // Get the product data
        const wishListProductSnapShot = await getDoc(wishListProductRef)

        // Update the function to display the added product
        setWishListProducts((prev) => {

            // Check If the product has already been added to the cart
            const alreadyInWish = prev.some(item => item.id === productId)

            // If It is true that the Item is already in the WishList
            if (alreadyInWish) {
                // Notify the user
                toast.warning("Product Already In WishList")
                // Return all the current wishList products
                return prev
            } else {
                // Update the function with an array
                const updateWishList = [
                    ...prev, {
                        // Get the product Id which has been stored separartely from the other products data
                        id: wishListProductSnapShot.id,
                        ...wishListProductSnapShot.data()
                    }
                ]

                // Notify the user that the product has already been added to the WishList
                toast.success("Product Added To WishList Successfully.")

                // Return all WishList Products
                return updateWishList
            }

        })

        // save the product to a sub-collection according to the userId

        // A specific user
        const user = auth.currentUser

        // If It is the current logged in user
        if (user) {
            // Create a reference to where the product will be saved when It is added to the wishList
            const savedWishProductRef = doc(db, "users", user.uid, "WishList", productId)
            // save the document to the defied location/reference
            await setDoc(savedWishProductRef, {
                // spread out the wishList product data
                ...wishListProductSnapShot.data()
            })
        }


       } catch (err) {
        console.error(" Error Fetching Product from firestore: ", err)
       }

    }


    // useEffect to fetch the products from the "WishList" subcollection in the database
    // This is to display the products even after page reload/ refresh
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            
            // If the current state is null, menaing no user
            if (!user) {
                // clear the wishList
                setWishListProducts([])
                return
                
            } else {
                // Create a reference to the withList subcollection to get all products
                const userWishProdRef = collection(db, "users", user.uid, "WishList")
                // Get a SnapShot of those Products
                const savedWishSnapShot = await getDocs(userWishProdRef)

                const wishProductData = savedWishSnapShot.docs.map(product => ({
                    // Get the Id that has been stored separately
                    id: product.id,
                    // Get the other product data
                    ...product.data()
                }))

                // Update the WishList function with the products
                setWishListProducts(wishProductData)
            }
            
        })

        return () => unsubscribe() // clean up the listener
    }, [])



    // function to remove a product from wishList
    const removeWishItem = async (productId) => {

        // Update the function
        setWishListProducts((prev) => {

            // Filter the current Items and remain with Items that are not equal to the removed Item
            const filteredWishList = prev.filter(item => item.id !== productId)

            // return the Itsm saved in the WishList
            return filteredWishList
        })

        // Notify the user that the product has been removed from the WishList
        toast.success("Product removed from WishList successfully")

        try {
            // Get the current user Id
            const user = auth.currentUser

            // Create a reference to the document that you want to remove
            const removedWishListProductRef = doc(db, "users", user.uid, "WishList", productId)

            // Remove the product
            await deleteDoc(removedWishListProductRef)
        
        } catch (err) {
            console.error("Error removing Product from WishList: ", err)
        }
    }

    // function to clear the wishList
    const clearWish = async () => {
        
        // If the wishlist is empty
        if (wishListProducts.length === 0) {
            // Notify the user that wishlist is empty
            toast.info("WishList Empty")
        } else {
            // Clear the WishList
            setWishListProducts([])
            
            // Notify the user that the wishList has been cleared successfully
            toast.success("WishList cleared Successfully")
            
            try {

                // Get the current user
                const user = auth.currentUser
                // create a reference to the wishlist collection in firebase
                const userWishListRef = collection(db, "users", user.uid, "WishList")
                // get the snapshot
                const userWishCollectionSnap = await getDocs(userWishListRef)

                // Loop through each document deleting It
                const deleteDocs = userWishCollectionSnap.docs.map(doc => deleteDoc(doc.ref))

                // wait for the deletion to complete
                await Promise.all(deleteDocs)

            } catch (err) {
                console.error(`Error referencing the users colection to clear WishList: ${err}`)
            }
        
        }
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

