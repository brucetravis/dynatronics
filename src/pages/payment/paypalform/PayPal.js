import React from 'react'
import '../Payment.css'

export default function PayPal() {
  return (
    <div>
        <form className='payment-form paypal'>
        <label>Email Address</label>
        <input type='email' placeholder='yourname@example.com' />
        <button type='submit' className='checkout-btn'>Pay with PayPal</button>
        </form>
    </div>
  )
}
