import React, { useEffect, useRef, useState } from 'react'
import './ShoppingCart.css'
import { motion } from 'framer-motion'
import { Minus, Plus, TrashIcon, XCircle } from 'lucide-react'
import { useShop } from '../../contexts/ShopProvider'
import { toast } from 'react-toastify'
import { auth, db } from '../configs/firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useSearch } from '../../contexts/SearchProvider'

export default function ShoppingCart() {

  // Get the cart function from the Auth state in order to enable the cart to be hidden 
  // when It is displayed
  const { setShowCart, cartProducts, removeCartProduct, checkOut, setCartProducts } = useShop()

  // Get the loading state from the search Provider
  const { loading } = useSearch()

  const [ _, setForceRender ] = useState(false);


  // create a refrence object for each product
  const quantityRefs = useRef({}) // Initial ref is an object


  // useEffect to ensure that each product has Its initial quantity set to 1 even when a new product is added later
  useEffect(() => {
    cartProducts.forEach((product) => {
      
      // if the quantity of each product is falsy/undefined
      if (quantityRefs.current[product.id] === undefined) {
        // set the inital count to 1
        quantityRefs.current[product.id] = product.selectedQuantity || 1
      }
    })
  }, [cartProducts]) // watch out for a change in


  // if (cartProducts.length === 0) return <div className='cart-empty'>Your Cart is Empty</div>

  
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
        {loading ? (
          <div className='cart-loading'>Fetching Cart ..........</div>
        ) : cartProducts.length === 0 ? (
            <div className='cart-empty'>Your Cart Is Empty</div>
        ) : (
          cartProducts.map((cartProduct) => (
            <div
              key={cartProduct.id} 
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
                      <button 
                        className='text-danger fs-6'
                        onClick={() => {
                          // Store the current initial quantity in a variable
                          const currentQty = quantityRefs.current[cartProduct.id]

                          // If the current initial quantity is greater than 1
                          if (currentQty > 1) {
                            quantityRefs.current[cartProduct.id] -= 1
                            // Update the state to trigger a re-render
                            setForceRender(prev => !prev)
                          }
                        }}

                      >
                        <Minus 
                          size={18}
                          style={{ color: "red" }}
                        />

                      </button>
                      {/* <span className='text-info fs-5 fw-bold mb-3'>{cartProduct.quantity}</span> */}
                      {/* <span className='text-info fs-5 fw-bold mb-3'>{quantityRefs.current[cartProduct.id] || 1 }</span> */}
                      <span className='text-info fs-5 fw-bold mb-3'>{quantityRefs.current[cartProduct.id] || cartProduct.selectedQuantity || 1 }</span>
                      <button 
                        // className='text-success fs-5'
                        style={{ color: "#00FFAB" }}
                        onClick={() => {
                          
                          // Store the max quantity
                          const maxQty = cartProduct.quantity
                          // Store the initial count, which is 1
                          const currentQty = quantityRefs.current[cartProduct.id]

                          // If the count is less than the max quantity, increment
                          if (currentQty < maxQty) {
                            quantityRefs.current[cartProduct.id] += 1
                            // Trigger a render
                            setForceRender(prev => !prev)
                          }
                        }}

                      >
                        <Plus 
                          size={18}
                        />
                      </button>
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
          ))
        )}



        <button 
          className='checkout-button-cart mt-3'
          // onClick={() => checkOut(cartProducts)}
          onClick={async () => {
            const productsWithQuantities = cartProducts.map((product) => ({
              // Copy all previous products
              ...product,
              selectedQuantity: quantityRefs.current[product.id] || 1
            }))

            // save the selected Quantity for each user to firestore
            const user = auth.currentUser
            
            // if the user is logged in
            if (user) {
              for (const product of productsWithQuantities) {
                // create a reference to firestore
                const ref = doc(db, "users", user.uid, "Cart", product.id)

                try {
                  await setDoc(ref, {
                    ...product,
                    selectedQuantity: product.selectedQuantity
                  })
                } catch (err) {
                  console.error(`Error Updating product, ${product.id}`, err)
                }
              }
            }

            // Update local state
            setCartProducts(productsWithQuantities)

            // Proceed to checkout
            checkOut(productsWithQuantities)

            // setInterval(() => {
            //   // toast.success("Proceeding to Payment......")
            //   checkOut(productsWithQuantities)
            // }, 100)
          }}
        >
          Proceed To checkOut
        </button>
    </motion.div>
  )
}
