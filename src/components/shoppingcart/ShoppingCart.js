import React from 'react'
import './ShoppingCart.css'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthProvider'

export default function ShoppingCart() {

  // Get the cart function from the Auth state in order to enable the cart to be hidden 
  // when It is displayed
  const { setShowCart } = useAuth()
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate= {{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      exit={{ x: 100, opacity: 0 }}
      className='shopping-cart'
    >
        <XCircle 
          size={30}
          className='close-cart'
          onClick={() => setShowCart((prev) => !prev)}
        />

        <h2>Cart</h2>



        <button className='checkout-button-cart'>
          Proceed To checkOut
        </button>
    </motion.div>
  )
}
