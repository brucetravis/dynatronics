import React from 'react'
import './LeftCards.css'
import { Link } from 'react-router-dom'
import promoData from '../../../components/data/PromoData'
import samsungVideo from '../../../videos/samsung-1.mp4'

export default function LeftCards() {
  return (
    <div className="col-12 col-md-3">
        <div className="promo-card small-left-card-one text-white" >
            <h5>{promoData[0].text}</h5>
            <Link to={promoData[0].link} className="shop-link">Shop Deals</Link>
        </div>

        <div className="promo-card small-left-card-two text-white mt-4" >
            <video muted autoPlay loop >
                <source src={samsungVideo} type='video/mp4' />
                Your browser does not suppoert the video tag
            </video>
        </div>

        {/* <div className="promo-card small-left-card-two text-white mt-4" >
            <h5>{promoData[4].text}</h5>
            <Link to={promoData[4].link} className="shop-link">Shop Deals</Link>
        </div> */}

        <div className="promo-card small-left-card-three text-white mt-4" >
            <h5>{promoData[4].text}</h5>
            <Link to={promoData[4].link} className="shop-link">Shop Deals</Link>
        </div>

        <div className="promo-card small-left-card-four text-white mt-4" >
            <h5>{promoData[4].text}</h5>
            <Link to={promoData[4].link} className="shop-link">Shop Deals</Link>
        </div>
        
    </div>
  )
}
