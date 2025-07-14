import React from 'react'
import ReactDOM from 'react-dom'
import './LogOutModal.css'

export default function LogOutModal({ onClose, onLogOut}) {

  // function to handle the log out logic
  // const onLogOut = 

  return ReactDOM.createPortal(
    <div className='logout-backdrop'>
      <div className='logout-card'>
        <h2>Are you sure you want to Log out?</h2>
        <div className='logout-buttons'>
          <button className='logout-btn' onClick={onLogOut}>
            Log Out
          </button>
          <button className='cancel-btn' onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
