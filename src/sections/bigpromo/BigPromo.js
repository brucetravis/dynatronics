import React from 'react'
import './BigPromo.css'
import { Link } from 'react-router-dom'
import promoData from '../../components/data/PromoData'

export default function BigPromo() {
  return (
    <div className="col-12 col-md-6">
      <div className="promo-card big-card-one text-white" >
        {/* <video>
          <source src={require('../../images/gaming/gaming-videos/gaming-video-1.mp4')} type='video/mp4' />
          Your browser does not support the video tag.
        </video> */}
          <h3 className="fw-bold">{promoData[1].text}</h3>
          <Link to={promoData[1].link} className="shop-link">Shop Deals</Link>
      </div>

      <div className='d-flex align-items-center gap-2 mt-4'>
        <div className="promo-card big-card-two text-white" >
          <h3 className="fw-bold">{promoData[5].text}</h3>
          <Link to={promoData[5].link} className="shop-link">Shop Deals</Link>
        </div>

        <div className="promo-card big-card-three text-white" >
          <h3 className="fw-bold">{promoData[5].text}</h3>
          <Link to={promoData[5].link} className="shop-link">Shop Deals</Link>
        </div>
      </div>

      <div className="promo-card big-card-four text-white mt-4" >
          <h3 className="fw-bold">{promoData[1].text}</h3>
          <Link to={promoData[1].link} className="shop-link">Shop Deals</Link>
      </div>

    </div>
  )
}
