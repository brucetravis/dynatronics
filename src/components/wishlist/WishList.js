import React from 'react'
import './WishList.css'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthProvider'

export default function WishList() {

  // Get the wishlist function from the AuthProvider so that we can be able to
  // close the wishlist section
  const { setShowWish } = useAuth()

  return (
    <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut"}}
        exit={{ x: 100, opacity: 0 }}
        className='wishlist-section'
    >

      <XCircle 
        size={30}
        className='close-wishlist'
        onClick={() => setShowWish((prev) => !prev)}
      />

      <h2>WishList</h2>




      <button
        className='clear-wishlist'
      >
        Clear Wishlist
      </button>
    </motion.div>
  )
}
