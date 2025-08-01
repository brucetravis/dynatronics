import React from 'react';
import '../Payment.css';

export default function CardForm() {
  return (
    <div className='card-form'>
      <h3>Card Payment</h3>
      <form>
        <label>Cardholder Name</label>
        <input type="text" placeholder="Bruce Travis" />

        <label>Card Number</label>
        <input type="text" placeholder="1234 5678 9012 3456" />

        <div className='card-form-row'>
          <div>
            <label>Expiry</label>
            <input type="text" placeholder="MM/YY" />
          </div>
          <div>
            <label>CVV</label>
            <input type="text" placeholder="123" />
          </div>
        </div>

        <button className="pay-btn">Pay Now</button>
      </form>
    </div>
  );
}
