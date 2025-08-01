import React from 'react'
import '../../Payment.css'

export default function Visa() {
  return (
    <div>
        <form className={`payment-form `}>
            <label>Visa</label>
            <input 
              type='text'
              placeholder='XXXX XXXX XXXX XXXX'
            />

            <div className='form-row'>
              <div>
                <label>Expiry Date: </label>
                <input 
                  type='text'
                  placeholder='MM / YY'
                />
              </div>

              <div>
                <label>CVV: </label>
                <input
                  type='password'
                  placeholder='***'
                />
              </div>
            </div>

            <button
              type='submit'
              className='checkout-btn'
            >
              Pay with Visa
            </button>
          </form>
    </div>
  )
}
