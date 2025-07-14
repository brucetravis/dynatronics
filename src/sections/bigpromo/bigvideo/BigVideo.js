import React from 'react'
import './BigVideo.css'
import gamingVideo from '../../../videos/gaming-videos/gaming-video-1.mp4';


export default function BigVideo() {
  return (
    <div className='col-12 col-md-8'>
        <video controls autoPla loop className='big-video'>
          <source src={gamingVideo} type='video/mp4' />
          Your browser does not suppoert the video tag
        </video>
    </div>
  )
}
