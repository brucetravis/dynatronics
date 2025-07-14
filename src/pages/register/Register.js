import React, { useEffect } from 'react'
import './Register.css'
import Form from '../../components/cards/formcard/Form'

export default function Register() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='register-page'>
      <Form />
    </div>
  )
}
