import React, { useEffect } from 'react'
import './Home.css'
import promoData from '../../components/data/PromoData'
import { Link } from 'react-router-dom'
import LeftCards from '../../sections/smallpromo/left/LeftCards'
import BigPromo from '../../sections/bigpromo/BigPromo'
import RightCards from '../../sections/smallpromo/right/RightCards'

export default function Home() {


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <div className='home-page'>
      <div className="container-fluid mt-5">
        <div className="row  g-4 align-items-stretch">
          <LeftCards />

          <BigPromo />

          <RightCards />

        </div>
      </div>

    </div>
  )
}
