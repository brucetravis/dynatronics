import React, { useEffect, useState } from 'react'
import './Shop.css'
import CategoryCards from '../../components/cards/categorycards/CategoryCards'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../components/configs/firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../../contexts/ShopProvider'


export default function Shop() {

  // React state to render all the products
  const [ showProducts, sethowProducts ] = useState([]) // Initially It is an empty array

  // loading state to control the page loading
  const [ loading, setLoading ] = useState(false) // Initial state is false

  // Get the cart function from the ShopProvider in order to update the function
  // const { fetchCartProduct } = useShop()

  // function to fetch products from firestore
  const fetchProducts = async () => {
    // Set loading to true before the fetch starts
    setLoading(true)
    
    try {
      // Get all the products data as of now
      // This line gets 3 things (queryProductsSnapShot.empty, queryProductsSnapShot.size, queryProuctsSnapshot.docs)
      const queryProductsSnapShot = await getDocs(collection(db, "Products"))

      // You're taking each product doc, attaching its ID, spreading its data, and putting everything in 
      // a nice array called productsData.
      // map through all the product documents
      const productsData = queryProductsSnapShot.docs.map(doc => ({
        // Get the product .id since It is stored separately and not with the product data
        id: doc.id,
        // Get the rest of the product data
        ...doc.data() // Unpack all of this into productsData
      }))

      // Show the product data in the console for debugging purposes
      console.log(productsData)
      // Update the state in order to display all the products
      sethowProducts(productsData)

    } catch (err) {
      console.error("Error fetching products", err)
    } finally {
      // Set loading to false after loading is done
      setLoading(false)
    }
  }

  // useEffect to fetch all poducts once on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Initialize useNavigate in order to naviage to a page displaying all the product details
  const navigate = useNavigate()

  // function to handle the Click of each card in order to display all the information about each product
  const handleClick = (productId) => {
    navigate(`/productdetails/${productId}`)
  }
  
  // use useEffect to scroll to the top o the page onMount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

 

  return (
    <div className='shop-page '>
      <div className=''>
        <CategoryCards />
      </div>

      <div className='products-section'>
        {loading ? (
          <div className='shop-loading'>
            Fetching Products........
          </div>
        ) : (
          showProducts.map((product) => (
            <div
              key={product.id}
              className='product-card'
            >
              <img 
                src={product.imageUrl}
                alt="Product pic"
                className='product-image'
                onClick={()=> handleClick(product.id)}
              />

              <div className='product-info'>
                <h3 className='product-title'>{product.name}</h3>
                <p className='product-price'>
                  <span className='fs-5'>Ksh</span> {Number(product.price).toLocaleString()} 
                </p>
                {/* <p className='product-quantity'>
                  {product.quantity} Left
                </p> */}
              </div>

              {/* <button 
                className='add-to-cart-button'
                onClick={() => fetchCartProduct(product.id)} // call the function when clicked
              >
                Add to cart 
              </button> */}
            </div>
          ))
          )}
      </div>
    </div>
  )
}
