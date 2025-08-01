import React from 'react'
import '../Payment.css'

export default function MpesaForm() {
  return (
    <div>
        <form className='payment-form mpesa'>
        <label>MPESA Number</label>
        <input type='text' placeholder='07XXXXXXXX' />
        <button type='submit' className='checkout-btn'>Pay with MPESA</button>
        </form>
    </div>
  )
}
