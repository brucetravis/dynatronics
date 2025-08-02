import React, { useEffect, useState } from 'react'
import './Payment.css'
import PayPal from './paypalform/PayPal';
import MpesaForm from './mpesaform/MpesaForm';
import MasterCard from './cardform/mastercard/MasterCard';
import Visa from './cardform/visa/Visa';
import { useShop } from '../../contexts/ShopProvider'
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchProvider';

export default function Payment() {

    // state for the default card to be selected
    const [ selectedCard, setSelectedCard ] = useState('visa') //default card

    // Get the loading state from the Search Provider
    const { loading } = useSearch()

    // DUMMY DATA
    // const cartItems = [
    //   { id: 1, name: 'Gaming Headset', qty: 2, price: 2500, image: require('../../images/gaming/console-1.jpg') },
    //   { id: 2, name: 'Smart Watch', qty: 1, price: 3500, image: require('../../images/headphones/headphones-1.jpg') },
    //   { id: 3, name: 'Wireless Mouse', qty: 1, price: 1500, image: require('../../images/gaming/gaming-pad-9.jpg') },
    // ];

    // const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    // Get the products from the cart so that we can display them in the payment page
    const { cartProducts } = useShop()

    const subtotal = cartProducts.reduce((total, item) => total + item.price * item.selectedQuantity || 1, 0);

    // useNavigate to navigate to another page
    const navigate = useNavigate()


    // useEffect to scroll top of the page on Mount 
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

  return (
    <div className='payment-page'>
      <div className='left-side'>
        {/* Shopping cart summary */}
        <h2>Your Shopping Cart</h2>

        <div className='cart-items'>
          {loading ? (
            <div className='payment-cart-loading'>Loading Cart to Pay.......</div>
          ) : (
            cartProducts.map(item => (
              <div className='cart-item' key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <p className='item-name'>{item.name}</p>
                  <p>Qty: {item.selectedQuantity || 1}</p>
                </div>
                <p className='item-price'>Ksh {Number(item.price * item.selectedQuantity || 1).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className='subtotal'>
          <p>Subtotal: <span>Ksh {Number(subtotal).toLocaleString()}</span></p>
          <button 
            className='back-btn' 
            onClick={() => navigate('/')
          }
            >← Back to Shop
          </button>
        </div>
        
      </div>

      <div className='right-side'>
        {/* Card Payment Form */}
        <h2>Card Details</h2>

        <div className='card-icons'>
          <img
            src={require('../../images/payment/visa_2.jpg')}
            alt='Visa'
            className={selectedCard === 'visa' ? 'active-card' : ''}
            onClick={() => setSelectedCard('visa')}
          />
          <img
            src={require('../../images/payment/master_card.jpg')}
            alt='MasterCard'
            className={selectedCard === 'mastercard' ? 'active-card' : ''}
            onClick={() => setSelectedCard('mastercard')}
          />

          <img
            src={require('../../images/payment/paypal.jpg')}
            alt='MasterCard'
            className={selectedCard === 'paypal' ? 'active-card' : ''}
            onClick={() => setSelectedCard('paypal')}
          />

          <img
            src={require('../../images/payment/mpesa.png')}
            alt='MasterCard'
            className={selectedCard === 'mpesa' ? 'active-card' : ''}
            onClick={() => setSelectedCard('mpesa')}
          />

        </div>

        {selectedCard === 'visa' && (<Visa />)}

        {selectedCard === 'mastercard' && (<MasterCard />)}

        {selectedCard === 'paypal' && (<PayPal />) }

        {selectedCard === 'mpesa' && (<MpesaForm />)} 

      </div>
    </div>
  )
}
