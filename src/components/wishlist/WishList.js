import React from 'react'
import './WishList.css'
import { motion } from 'framer-motion'
import { Trash, XCircle } from 'lucide-react'
import { useWish } from '../../contexts/WishListProvider'

export default function WishList() {

  // Get the wishlist function from the WishListProvider so that we can be able to
  // close the wishlist section
  const { setShowWish, wishListProducts, removeWishItem, clearWish } = useWish()

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

      {wishListProducts.map((wishProduct) => (
        <div
          key={wishProduct.id} 
          className='wishlist-card'
        >
          <div className='wishlist-product-image'>
            <img 
              src={wishProduct.imageUrl}
              alt={wishProduct.name}
              className=''
            />
          </div>

          <div className='wishlist-product-info'>
            <h6 className='text-white fw-bold'>{wishProduct.name}</h6>
            <p className='wish-desc'>{wishProduct.description}</p>

            <p className='text-warning fs-5 fw-bold'>Ksh {Number(wishProduct.price).toLocaleString()}</p>

            <div className='buttonAndTrash d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center justify-content-center gap-2'>
                <button>+</button>
                <p className='text-info fs-5'>{wishProduct.quantity}</p>
                <button>-</button>
              </div>

              <Trash
                size={18}
                className='text-danger'
                onClick={() => removeWishItem(wishProduct.id)}
              />
            </div>
          </div>
          
        </div>
      ))}




      <button
        className='clear-wishlist mt-3'
        onClick={clearWish}
      >
        Clear Wishlist
      </button>
    </motion.div>
  )
}
