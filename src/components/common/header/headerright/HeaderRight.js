import React from 'react'
import './HeaderRight.css'
import { useAuth } from '../../../../contexts/AuthProvider'
import { ChevronDown } from 'lucide-react'

export default function HeaderRight() {

    // import the user from the context
    const { user } = useAuth()

    // extract the first name
    const firstName = user?.displayName?.split(' ')[0] || 'Guest';
    
  return (
    <div className='header-right'>
        <span className='greeting'>
           { user ? `Hi ${firstName}` : 'Guest' }
        </span>
        <ChevronDown size={18} className='chevron' />
    </div>
  )
}
