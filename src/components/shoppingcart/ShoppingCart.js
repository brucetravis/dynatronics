import React from 'react'
import './ShoppingCart.css'
import { motion } from 'framer-motion'
import { TrashIcon, XCircle } from 'lucide-react'
import { useShop } from '../../contexts/ShopProvider'

export default function ShoppingCart() {

  // Get the cart function from the Auth state in order to enable the cart to be hidden 
  // when It is displayed
  const { setShowCart, cartProducts, removeCartProduct, checkOut } = useShop()

  
  
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
        
        {/* render the cart products */}
        {cartProducts.map((cartProduct) => (
          <div
            id={cartProduct.id} 
            className='cart-card'
          >
            <div className='cart-content'>
              <div className='cart-image-card'>
                <img
                  src={cartProduct.imageUrl}
                  alt={cartProduct.name}
                  className=''
                />
              </div>
              
              <div className='card-info'>
                <h6 className='text-white fw-bold '>{cartProduct.name}</h6>
                <span className='cart-desc fw-bold'>{cartProduct.description}</span>
                
                <p className='text-warning fw-bold fs-5 mt-2'>Ksh {Number(cartProduct.price).toLocaleString()}</p>
                
                <div className='buttonAndTrash d-flex align-items-center justify-content-between'>
                  <div className='d-flex align-items-center gap-2'>
                    <button>-</button>
                    <span className='text-info fs-5 fw-bold mb-3'>{cartProduct.quantity}</span>
                    <button>+</button>
                  </div>
                  <TrashIcon 
                    size={20} 
                    className='remove-icon text-danger' 
                    onClick={() => removeCartProduct(cartProduct.id)}
                  />
                </div>
              </div>
            </div>

          </div>
        ))}



        <button 
          className='checkout-button-cart mt-3'
          onClick={checkOut}
        >
          Proceed To checkOut
        </button>
    </motion.div>
  )
}
