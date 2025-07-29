import React, { useEffect, useRef, useState } from 'react'
import './WishList.css'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash, XCircle } from 'lucide-react'
import { useWish } from '../../contexts/WishListProvider'

export default function WishList() {

  // Get the wishlist function from the WishListProvider so that we can be able to
  // close the wishlist section
  const { setShowWish, wishListProducts, removeWishItem, clearWish } = useWish()
  
  // state to update the quantity
  const [ _, setForceRender ] = useState(false)
  
  // Create a reference object for each product
  const quantityRefs = useRef({}) // Initial ref is an object

  // useEffect to watch out for a chaneg in the cart products
  useEffect(() => {
    wishListProducts.forEach((product) => {

      // Set the initial quantity

      // If the quantity of each product is falsy
      if (quantityRefs.current[product.id] === undefined) {
        quantityRefs.current[product.id] = 1
      }
    })

  }, [wishListProducts]) // Watch out for a change in the wishList Products

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
                <button
                  className='text-danger'
                  onClick={() => {
                    // the current number of the product
                    const currentQty = quantityRefs.current[wishProduct.id]

                    if (currentQty > 1) {
                      quantityRefs.current[wishProduct.id] -= 1
                      setForceRender(prev => !prev)
                    }
                  }}
                >
                  <Minus 
                    size={18}
                  />
                </button>
                <p className='text-info fs-5'>{quantityRefs.current[wishProduct.id] || 1}</p>
                <button
                  style={{ color: "#00FFAB" }}         
                  onClick={() => {
                    // the max number of products
                    const maxQty = wishProduct.quantity
                    // The current quantity
                    const currentQty = quantityRefs.current[wishProduct.id]
                  
                    if (currentQty < maxQty) {
                      quantityRefs.current[wishProduct.id] += 1
                      setForceRender(prev => !prev)
                    }
                  }}
                >
                  <Plus
                    size={18}

                  />
                </button>
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
