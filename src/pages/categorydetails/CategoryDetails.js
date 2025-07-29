import React, { useEffect, useState } from 'react'
import './CategoryDetails.css'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../components/configs/firebase/firebase'
import CategoryCards from '../../components/cards/categorycards/CategoryCards'
import { Link } from 'react-router-dom'


export default function CategoryDetails() {

  // navigate to navigate to the dynamic productdetials page
  const navigate = useNavigate()

  // state to update with all category products
  const [ categoryProducts, setCategoryProducts ] = useState([]) // Initial state is an empty array

  // state to show loading of the products
  const [ loading, setLoading ] = useState(false) // Initial state is false meaning not loading

  // Extract the name of the specific category  (This is for the useEffect)
  const { categoryName } = useParams()

  // useEffect to watch out which category is being accessed
  useEffect(() => {
    // function to query products according to the specific category
    const fetchCategoryProducts = async () => {

      // try to fetch the products
      try {
        // Set loading to true at first
        setLoading(true)

        // Create a reference to the products collection
        const productsRef = collection(db, "Products")
        //  Filter accrodding to the specific categoryName
        const categoryProductsFilter= query(productsRef, where("category", "==", categoryName))

        // Get the product data (snapShot)
        const categoryProductSnapShot = await getDocs(categoryProductsFilter)

        // Map through to extract the Id and the product data so that the state can display It
        const fetchedProducts = categoryProductSnapShot.docs.map((categoryProduct) => ({
          // Get the Id that has ben stored separately
          id: categoryProduct.id,
          // spread out the product data
          ...categoryProduct.data()
        }))

        // Update the state with the product data (Id and the product data)
        setCategoryProducts(fetchedProducts)

      } catch (err) {
        console.error("Error fetching Products from Database: ", err)

      } finally {
        setLoading(false)
      }
    }

    // Call the function
    fetchCategoryProducts()
  }, [categoryName]) // Add a name dependency to watch out for the name being accessed

  // if loading (products are being fetched from the database)
  if (loading) { 
    return <div className='loading-category-products'>Loading.........</div> 
  }

  // If No Products have been found In the database that match the spcific category
  if (categoryProducts.length === 0) {
    return <div className='no-category-products-found'> No Products Found For this specific Category. Go back to <Link to='/'>Shop</Link></div>
  }

  return (
    <div className='category-details-page'>
      <div className='product-categories'>
        <CategoryCards />
      </div>

      {categoryProducts.map((categoryProduct) => (
        <div className='category-product'>
          <div className='category-product-image'>
            <img 
              src={categoryProduct.imageUrl}
              alt={categoryProduct.name}
              className=''
              onClick={() => navigate(`/productdetails/${categoryProduct.id}`)}
            />
          </div>
          
          <div className='mt-3'>
            <h5>{categoryProduct.name}</h5>
            <p className='text-warning'>Ksh <span>{categoryProduct.price}</span></p>
          </div>
        </div>
      ))}
    </div>
  )
}
