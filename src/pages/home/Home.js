import React, { useEffect } from 'react'
import './Home.css'
import LeftCards from '../../sections/smallpromo/left/LeftCards'
import BigPromo from '../../sections/bigpromo/BigPromo'
import RightCards from '../../sections/smallpromo/right/RightCards'
import MediumPromo from '../../sections/mediumpromo/MediumPromo'
import BigVideo from '../../sections/bigpromo/bigvideo/BigVideo'

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
        
        <div className='row g-4 align-items-center mt-4'>
          <MediumPromo />
          
          <BigVideo />
        </div>
      </div>

    </div>
  )
}
