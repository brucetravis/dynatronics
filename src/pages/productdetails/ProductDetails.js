import React, { useEffect, useState } from 'react'
import './ProductDetails.css'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../components/configs/firebase/firebase'
import { useShop } from '../../contexts/ShopProvider'
import { useWish } from '../../contexts/WishListProvider'

export default function ProductDetails() {

    // Get the function to add products to the Cart
    const { fetchCartProduct, checkOut } = useShop()

    // Get the functino to fetchWishListProducts
    const { fetchWishListProduct } = useWish()

    // React hook to navigate to other pages
    const navigate = useNavigate()

    // extract the Id of a specific product
    const { id } = useParams()
    
    // states to update the product info according to It's specific details
    const [ productInfo, setProductInfo ] = useState(null) // Initial state should be nothing since Initially, there wil be no product info in the age

    // State to load the page when fetching product details
    const [ loading, setLoading ] = useState(false)


    // useEffct to keep watch on the id so that we can update the product info from tie to time
    useEffect(() => {
        
        // function to fetch a specific product from firestore according to the Id of the product
        const fetchProduct = async () => {

            // set loading to true
            setLoading(true)

            try {
                // Initialize a reference to a specific product
                // This is just a reference to the actual document according to the id not the product details/info
                const productRef = doc(db, "Products", id)
                // Get the data of a specific product document
                const productSnapShot = await getDoc(productRef)
                
                // check if the document exists
                if (productSnapShot.exists()) {
                    // If It does, update the state with all the product information according to the specific Id
                    setProductInfo({
                        // Get the product id since It is stored separately from the other product data
                        id: productSnapShot.id,
                        ...productSnapShot.data() // Unpack all the data into productSnapShot
                    })
                // Otherwise
                } else {
                    console.log("No such Product exists!!")
                    setProductInfo("Product Not Found")
                }

            } catch (err) {
                console.error("Error fetching product fro database", err)
            } finally {
                setLoading(false)
            }
        }

        // Call the function to fetch the fetch the product
        fetchProduct()
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // If firebase is still getting the product data
    // if (loading) return <div className='product-details-loading text-center'> Loading Product data........</div>

    // if the product data has not been found in the database
    if (productInfo === "Product Not Found") return <div>Product Not Found</div>

  return (
    <>
        {loading || !productInfo ? (
            <div className='product-details-loading'> Loading Product data........</div>
        ) : (
            <div className='product-details-page'>
                <div className='d-flex align-items-center justify-content-center'>
                    <div className='product-details '>
                        <div className='product-details-image '>
                            <img 
                                src={productInfo.imageUrl}
                                alt={productInfo.name}
                                className=''
                            />
                        </div>
                        <div className='details-info '>
                            <div className='detail-categ'>
                                {productInfo.category}
                            </div>
                            <p className='mb-3 detail-desc'>
                                <span className='fs-5 me-1'>Description:</span>{productInfo.description}
                            </p>

                            <p className='mb-3 detail-desc'>
                                <span className='fs-5 me-1'>Name:</span>{productInfo.name}
                            </p>

                            <div className='detail-price'>
                                <p>Price: <span className='fs-5 me-1 text-warning'>Ksh {Number(productInfo.price).toLocaleString()}</span></p>
                            </div>

                            <div className='detail-quantity'>
                                <span className='fs-5 me-1'>Quantity:</span>
                                <input 
                                    type='text'
                                    value={productInfo.quantity}
                                    readOnly
                                />
                                
                            </div>

                            <div className='mb-4'>
                                <button
                                    onClick={() => fetchCartProduct(productInfo.id)}
                                    className='add-to-cart-button-details mt-3'
                                >
                                    Add to cart
                                </button>
                            </div>
                        
                            <div 
                                className='d-flex align-items-center gap-4'
                            >
                                <button 
                                    className='wishlist-button'
                                    onClick={() => fetchWishListProduct(productInfo.id)}
                                >
                                    ♡ Add to Wishlist
                                </button>
                                <button 
                                    className='checkout-button'
                                    onClick={checkOut}
                                >
                                    Proceed to checkOut
                                </button>
                                <button className='pre-order-button'>Pre-Order</button>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <button 
                    className='view-button-details'
                    onClick={() => navigate('/')}
                >
                    View More Products
                </button>
            </div>
        )}
    </>
  )
}
