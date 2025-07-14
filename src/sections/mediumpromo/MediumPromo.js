import React from 'react'
import './MediumPromo.css'
import promoData from '../../components/data/PromoData'
import { Link } from 'react-router-dom'

export default function MediumPromo() {
  return (
    <div className='col-12 col-md-4'>
        <div className='promo-card medium-left-card-one text-white'>
            <h5>{promoData[0].text}</h5>
            <Link to={promoData[0].link} className="shop-link">Shop Deals</Link>
        </div>
    </div>
  )
}
