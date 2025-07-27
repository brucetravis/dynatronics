import React, { useEffect, useState } from 'react'
import './Payment.css'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../components/configs/firebase/firebase'

export default function Payment() {
  

  // Extract the Id of a specific user to display a dynamic page for users
  const { userId } = useParams()

  // state to store the users purchased Products
  const [ purchasedUserProducts, setPurchasedUserProducts ] = useState([]) // Initial state is an array

  // useEffect to check the chack which specific user It is
  useEffect(() => {

    // Function to fetch Products from the database
    const fetchProductsToPay = async () => {
      
      try {
        // Create a reference to the collection of products to get all document
        const purchasedProductsRef = collection(db, "users", userId, "purchasedProducts")

        // Get a snapShot of all products
        const purchaseProdRefSnapShot = await getDocs(purchasedProductsRef)

        // payment data
        const userProducts = purchaseProdRefSnapShot.docs.map((doc) => ({
          // Get the product Id since It is stored separately from the product data
          id: doc.id,
          // spread out all the data
          ...doc.data()
        }))

        console.log(userProducts)
        // Update the purchasedProducts state
        setPurchasedUserProducts(userProducts)

      } catch (err) {
        console.error("Error fetching Products from firestore", err)
      }
    }
    
    // Call the function
    fetchProductsToPay()

  }, [userId])

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
      className='container-fluid my-5 payment-page'
    >
      <div className="payment-column d-flex align-items-center ">
        <div className='products-paid '>
          <div>
            <h3 className='text-warning fw-bold'>PURCHASED PRODUCTS</h3>
            
            <div
              className='prod-flex'
            >
              {purchasedUserProducts.map((purchasedProduct) => (
                <div
                  key={purchasedProduct.id}
                  className='prod-pay-details'
                >
                  <div>
                    <img 
                      src={purchasedProduct.imageUrl}
                      alt={purchasedProduct.name}
                    />
                  </div>
                  
                  <div className='prod-pay-info'>
                    <p className='name'>{purchasedProduct.name}</p>
                    <p className='desc'>{purchasedProduct.description}</p>
                    <p className='price text-warning fw-bold'>Ksh {Number(purchasedProduct.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='d-flex align-items-center justify-content-center mt-3'>
              <p className='text-warning fw-bold fs-4'>TOTAL:</p>
            </div>
          </div>

        </div>
        
        <div className='payment-method '>
          
        </div>
      </div>
    </motion.div>
  )
}
