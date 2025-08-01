import React from 'react'
import '../../Payment.css'

export default function MasterCard() {
  return (
    <div>
        <form className='payment-form mastercard'>
        <label>MasterCard Number</label>
        <input type='text' placeholder='XXXX XXXX XXXX XXXX' />
        <div className='form-row'>
            <div>
            <label>Expiry Date:</label>
            <input type='text' placeholder='MM / YY' />
            </div>
            <div>
            <label>CVV:</label>
            <input type='password' placeholder='***' />
            </div>
        </div>
        <button type='submit' className='checkout-btn'>
            Pay with MasterCard
        </button>
        </form>
    </div>
  )
}
