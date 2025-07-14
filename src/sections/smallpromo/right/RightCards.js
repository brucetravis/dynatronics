import React from 'react'
import './RightsCards.css'
import { Link } from 'react-router-dom'
import promoData from '../../../components/data/PromoData'
import headPhonesVideo from '../../../videos/headphones-1.mp4'

export default function RightCards() {
  return (
    <div className="col-12 col-md-3">
      <div className="promo-card small-right-card-one text-white mt-4" >
        <video controls autoPlay loop className='big-video'>
          <source src={headPhonesVideo} type='video/mp4' />
          Your browser does not suppoert the video tag
        </video>
      </div>

      {/* <div className="promo-card small-right-card-one text-white mt-4" >
        <h5>{promoData[2].text}</h5>
        <Link to={promoData[2].link} className="shop-link">Shop Deals</Link>
      </div> */}

      <div className="promo-card small-right-card-two text-white mt-4" >
        <h5>{promoData[2].text}</h5>
        <Link to={promoData[2].link} className="shop-link">Shop Deals</Link>
      </div>

      <div className="promo-card small-right-card-three text-white mt-4" >
        <h5>{promoData[2].text}</h5>
        <Link to={promoData[2].link} className="shop-link">Shop Deals</Link>
      </div>

      <div className="promo-card small-right-card-four text-white mt-4" >
        <h5>{promoData[2].text}</h5>
        <Link to={promoData[2].link} className="shop-link">Shop Deals</Link>
      </div>
    </div>
  )
}
