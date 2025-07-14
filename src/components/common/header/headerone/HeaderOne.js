import React from 'react'
import './HeaderOne.css'
import advertData from '../../../data/Advertdata'

export default function HeaderOne() {
  return (
    <div className='promo-container'>
      <div className="promo-marquee">
        {advertData.map(item => {
          const Icon = item.icon
          return (
            <div className='d-flex gap-2 px-2' key={item.id}>
              <Icon size={20} style={{ color: item.color, filter: 'dropShadow(0 0 4px white)' }} />
              <span className='text-white'>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
